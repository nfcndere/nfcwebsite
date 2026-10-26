import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const mockPrisma = vi.hoisted(() => ({
  user: { findUnique: vi.fn() },
  article: { findMany: vi.fn(), findFirst: vi.fn(), update: vi.fn() },
  match: { findMany: vi.fn(), findFirst: vi.fn() },
  player: { findMany: vi.fn(), findFirst: vi.fn() },
  apiRateLimitBucket: { deleteMany: vi.fn(), upsert: vi.fn() },
  auditLog: { create: vi.fn() },
}));

vi.mock('@/lib/prisma', () => ({
  prisma: mockPrisma,
  default: mockPrisma,
}));

import {
  authorize,
  getUserFromToken,
  requireAdmin,
  requireEditor,
  signAccessToken,
  signRefreshToken,
} from '@/lib/server/auth';
import { POST as refreshHandler } from '@/app/api/auth/refresh/route';
import { POST as signUploadHandler } from '@/app/api/uploads/sign/route';
import { GET as listArticlesHandler } from '@/app/api/articles/route';
import { DELETE as deleteArticleHandler } from '@/app/api/articles/[id]/route';
import { GET as listMatchesHandler } from '@/app/api/matches/route';
import { GET as listPlayersHandler } from '@/app/api/players/route';
import { isAccountCloudinaryUrl, signUploadParams, validateDeclaredUpload } from '@/lib/server/cloudinary';
import { standingInputSchema } from '@/lib/validation/standing';
import { getMatchState, getNextMatch, isStandingConsistent } from '@/lib/match-state';
import { getResourceView, isDataStale } from '@/lib/resource-state';

const TEST_USERS = {
  admin: { id: 'u-admin', name: 'Admin', email: 'admin@nfc.cm', role: 'ADMIN', active: true, tokenVersion: 0 },
  editor: { id: 'u-editor', name: 'Éditeur', email: 'editor@nfc.cm', role: 'EDITOR', active: true, tokenVersion: 0 },
  user: { id: 'u-user', name: 'Membre', email: 'user@nfc.cm', role: 'USER', active: true, tokenVersion: 0 },
  inactive: { id: 'u-inactive', name: 'Inactif', email: 'off@nfc.cm', role: 'EDITOR', active: false, tokenVersion: 0 },
} as const;

function makeRequest(url: string, options: { method?: string; token?: string; body?: unknown } = {}) {
  const headers = new Headers();
  if (options.token) headers.set('authorization', `Bearer ${options.token}`);
  if (options.body !== undefined) headers.set('content-type', 'application/json');
  return new NextRequest(url, {
    method: options.method ?? (options.body !== undefined ? 'POST' : 'GET'),
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

beforeEach(() => {
  vi.clearAllMocks();
  process.env.JWT_SECRET = 'test-access-secret-long-value';
  process.env.JWT_REFRESH_SECRET = 'test-refresh-secret-long-value';
  process.env.CLOUDINARY_CLOUD_NAME = 'nfc-cloud';
  process.env.CLOUDINARY_API_KEY = '123456789';
  process.env.CLOUDINARY_API_SECRET = 'super-secret-never-exposed';

  mockPrisma.user.findUnique.mockImplementation(async ({ where }: { where: { id: string } }) => {
    return Object.values(TEST_USERS).find((u) => u.id === where.id) ?? null;
  });
  mockPrisma.apiRateLimitBucket.deleteMany.mockResolvedValue({ count: 0 });
  mockPrisma.apiRateLimitBucket.upsert.mockResolvedValue({ key: 'k', count: 1, expiresAt: new Date(Date.now() + 60_000) });
  mockPrisma.auditLog.create.mockResolvedValue({ id: 'audit-1' });
});

// ===================================
// 1. Refresh de jeton
// ===================================
describe('POST /api/auth/refresh', () => {
  it('émet un nouveau token d’accès et effectue la rotation du refreshToken', async () => {
    const refreshToken = signRefreshToken(TEST_USERS.editor);
    const response = await refreshHandler(makeRequest('https://www.ngaounderefc.cm/api/auth/refresh', { body: { refreshToken } }));
    expect(response.status).toBe(200);
    const payload = await response.json();
    expect(payload.success).toBe(true);
    expect(typeof payload.token).toBe('string');
    expect(typeof payload.refreshToken).toBe('string');
    expect(payload.user.id).toBe(TEST_USERS.editor.id);

    const verifiedAccess = await getUserFromToken(payload.token, 'access');
    const verifiedRefresh = await getUserFromToken(payload.refreshToken, 'refresh');
    expect(verifiedAccess?.id).toBe(TEST_USERS.editor.id);
    expect(verifiedRefresh?.id).toBe(TEST_USERS.editor.id);
  });

  it('refuse un access token présenté comme refreshToken (401)', async () => {
    const accessToken = signAccessToken(TEST_USERS.editor);
    const response = await refreshHandler(makeRequest('https://www.ngaounderefc.cm/api/auth/refresh', { body: { refreshToken: accessToken } }));
    expect(response.status).toBe(401);
  });

  it('refuse un refreshToken si l’utilisateur n’existe plus, est désactivé ou si tokenVersion a changé (401)', async () => {
    const ghostToken = signRefreshToken({ id: 'ghost-user', email: 'ghost@nfc.cm', role: 'ADMIN' });
    const inactiveToken = signRefreshToken(TEST_USERS.inactive);
    const oldVersionToken = signRefreshToken({ ...TEST_USERS.admin, tokenVersion: 99 });

    for (const refreshToken of [ghostToken, inactiveToken, oldVersionToken, 'invalid.jwt.token']) {
      const res = await refreshHandler(makeRequest('https://www.ngaounderefc.cm/api/auth/refresh', { body: { refreshToken } }));
      expect(res.status).toBe(401);
    }
  });
});

// ===================================
// 2. Distinction 401 / 403 et erreurs de configuration JWT
// ===================================
describe('requireEditor / authorize (401 vs 403 vs 500 JSON)', () => {
  it('renvoie 401 sans jeton ou avec un jeton invalide', async () => {
    const noTokenRes = await requireEditor(makeRequest('https://www.ngaounderefc.cm/api/articles'));
    expect(noTokenRes?.status).toBe(401);

    const badTokenRes = await requireEditor(makeRequest('https://www.ngaounderefc.cm/api/articles', { token: 'malformed' }));
    expect(badTokenRes?.status).toBe(401);
  });

  it('renvoie 403 pour un utilisateur authentifié avec le rôle USER', async () => {
    const userToken = signAccessToken(TEST_USERS.user);
    const denied = await requireEditor(makeRequest('https://www.ngaounderefc.cm/api/articles', { token: userToken }));
    expect(denied?.status).toBe(403);
  });

  it('renvoie 403 sur requireAdmin pour un EDITOR et autorise un ADMIN', async () => {
    const editorToken = signAccessToken(TEST_USERS.editor);
    const adminToken = signAccessToken(TEST_USERS.admin);

    const editorResult = await requireAdmin(makeRequest('https://www.ngaounderefc.cm/api/users', { token: editorToken }));
    expect(editorResult.ok).toBe(false);
    if (!editorResult.ok) expect(editorResult.response.status).toBe(403);

    const adminResult = await requireAdmin(makeRequest('https://www.ngaounderefc.cm/api/users', { token: adminToken }));
    expect(adminResult.ok).toBe(true);
  });

  it('renvoie 500 JSON explicite (et ne lève pas à l’import) si JWT_SECRET manque', async () => {
    delete process.env.JWT_SECRET;
    const result = await authorize(makeRequest('https://www.ngaounderefc.cm/api/articles', { token: 'any-token' }));
    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.response.status).toBe(500);
      await expect(result.response.json()).resolves.toEqual({
        status: 'error',
        message: 'Configuration de sécurité indisponible.',
      });
    }
  });
});

// ===================================
// 3. Validation du classement (zod)
// ===================================
describe('Validation du classement du NFC (standingInputSchema)', () => {
  it('accepte un classement cohérent et normalise la forme en majuscules', () => {
    const parsed = standingInputSchema.safeParse({
      rank: 1,
      played: 5,
      won: 3,
      drawn: 1,
      lost: 1,
      goalsFor: 9,
      goalsAgainst: 4,
      form: 'v-v-n-d-v',
    });
    expect(parsed.success).toBe(true);
    if (parsed.success) expect(parsed.data.form).toBe('V-V-N-D-V');
  });

  it('rejette joués ≠ V + N + D, les valeurs négatives et une forme de plus de 5 matchs ou invalide', () => {
    const base = { rank: 2, played: 5, won: 3, drawn: 1, lost: 1, goalsFor: 6, goalsAgainst: 3, form: 'V-V-N-V-V' };

    expect(standingInputSchema.safeParse({ ...base, played: 4 }).success).toBe(false);
    expect(standingInputSchema.safeParse({ ...base, rank: 0 }).success).toBe(false);
    expect(standingInputSchema.safeParse({ ...base, goalsAgainst: -1 }).success).toBe(false);
    expect(standingInputSchema.safeParse({ ...base, form: 'V-V-N-V-V-V' }).success).toBe(false);
    expect(standingInputSchema.safeParse({ ...base, form: 'W-W-D-L-W' }).success).toBe(false);
    expect(standingInputSchema.safeParse({ ...base, form: 'VVNVV' }).success).toBe(false);
  });
});

// ===================================
// 4. Filtrage des suppressions logiques (deletedAt: null) et statut des articles
// ===================================
describe('Suppression logique (Article, Match, Player)', () => {
  it('filtre deletedAt: null sur les lectures publiques d’articles, matchs et joueurs', async () => {
    mockPrisma.article.findMany.mockResolvedValue([]);
    mockPrisma.match.findMany.mockResolvedValue([]);
    mockPrisma.player.findMany.mockResolvedValue([]);

    await listArticlesHandler(makeRequest('https://www.ngaounderefc.cm/api/articles?status=all'));
    expect(mockPrisma.article.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { deletedAt: null, published: true } }),
    );

    await listMatchesHandler(makeRequest('https://www.ngaounderefc.cm/api/matches'));
    expect(mockPrisma.match.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { deletedAt: null } }),
    );

    await listPlayersHandler();
    expect(mockPrisma.player.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { deletedAt: null } }),
    );
  });

  it('autorise ?status=all|draft uniquement pour un éditeur authentifié, toujours avec deletedAt: null', async () => {
    mockPrisma.article.findMany.mockResolvedValue([]);
    const editorToken = signAccessToken(TEST_USERS.editor);

    await listArticlesHandler(makeRequest('https://www.ngaounderefc.cm/api/articles?status=draft', { token: editorToken }));
    expect(mockPrisma.article.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({ where: { deletedAt: null, published: false } }),
    );

    await listArticlesHandler(makeRequest('https://www.ngaounderefc.cm/api/articles?status=all', { token: editorToken }));
    expect(mockPrisma.article.findMany).toHaveBeenLastCalledWith(
      expect.objectContaining({ where: { deletedAt: null } }),
    );
  });

  it('effectue un update(deletedAt) et jamais un delete physique sur DELETE /api/articles/[id]', async () => {
    const editorToken = signAccessToken(TEST_USERS.editor);
    mockPrisma.article.findFirst.mockResolvedValue({ id: 'art-1', title: 'Test', deletedAt: null });
    mockPrisma.article.update.mockResolvedValue({ id: 'art-1', deletedAt: new Date() });

    const res = await deleteArticleHandler(
      makeRequest('https://www.ngaounderefc.cm/api/articles/art-1', { method: 'DELETE', token: editorToken }),
      { params: { id: 'art-1' } },
    );
    expect(res.status).toBe(200);
    expect(mockPrisma.article.update).toHaveBeenCalledWith({
      where: { id: 'art-1' },
      data: { deletedAt: expect.any(Date) },
    });
  });
});

// ===================================
// 5. Signature d'upload Cloudinary et validation d'URL
// ===================================
describe('Signature d’upload Cloudinary (POST /api/uploads/sign)', () => {
  it('renvoie une signature valide pour une image ≤ 10 Mio sans jamais exposer le secret', async () => {
    const editorToken = signAccessToken(TEST_USERS.editor);
    const response = await signUploadHandler(
      makeRequest('https://www.ngaounderefc.cm/api/uploads/sign', {
        token: editorToken,
        body: { mimeType: 'image/webp', size: 2 * 1024 * 1024 },
      }),
    );
    expect(response.status).toBe(200);
    const rawText = await response.text();
    expect(rawText).not.toContain(process.env.CLOUDINARY_API_SECRET!);

    const payload = JSON.parse(rawText);
    expect(payload.status).toBe('ok');
    expect(payload.data).toMatchObject({
      apiKey: '123456789',
      cloudName: 'nfc-cloud',
      folder: 'nfc-media',
      resourceType: 'image',
    });
    expect(payload.data.signature).toMatch(/^[a-f0-9]{40}$/);
    expect(signUploadParams('image', payload.data.timestamp * 1_000).signature).toBe(payload.data.signature);
  });

  it('supporte aussi CLOUDINARY_URL seul (configuration Vercel)', async () => {
    delete process.env.CLOUDINARY_CLOUD_NAME;
    delete process.env.CLOUDINARY_API_KEY;
    delete process.env.CLOUDINARY_API_SECRET;
    process.env.CLOUDINARY_URL = 'cloudinary://987654321:url-secret-never-exposed@nfc-url-cloud';

    const editorToken = signAccessToken(TEST_USERS.editor);
    const response = await signUploadHandler(
      makeRequest('https://www.ngaounderefc.cm/api/uploads/sign', {
        token: editorToken,
        body: { mimeType: 'image/jpeg', size: 1_024 * 1_024 },
      }),
    );
    expect(response.status).toBe(200);
    const rawText = await response.text();
    expect(rawText).not.toContain('url-secret-never-exposed');
    const payload = JSON.parse(rawText);
    expect(payload.data).toMatchObject({
      apiKey: '987654321',
      cloudName: 'nfc-url-cloud',
      folder: 'nfc-media',
    });
    expect(
      isAccountCloudinaryUrl(
        'https://res.cloudinary.com/nfc-url-cloud/image/upload/v1/nfc-media/img.jpg',
        'nfc-media/img',
      ),
    ).toBe(true);
    delete process.env.CLOUDINARY_URL;
  });

  it('refuse une image > 10 Mio, une vidéo > 50 Mio ou un type MIME non autorisé', async () => {
    expect(validateDeclaredUpload('image', 'image/jpeg', 10 * 1024 * 1024 + 1)).not.toBeNull();
    expect(validateDeclaredUpload('video', 'video/mp4', 50 * 1024 * 1024)).toBeNull();
    expect(validateDeclaredUpload('video', 'video/mp4', 50 * 1024 * 1024 + 1)).not.toBeNull();
    expect(validateDeclaredUpload('image', 'image/svg+xml', 1_024)).not.toBeNull();
  });

  it('vérifie que l’URL enregistrée appartient au compte Cloudinary et contient le publicId', () => {
    expect(
      isAccountCloudinaryUrl(
        'https://res.cloudinary.com/nfc-cloud/image/upload/v1700000/nfc-media/photo_1.webp',
        'nfc-media/photo_1',
        'nfc-cloud',
      ),
    ).toBe(true);
    expect(
      isAccountCloudinaryUrl(
        'https://res.cloudinary.com/other-cloud/image/upload/v1700000/nfc-media/photo_1.webp',
        'nfc-media/photo_1',
        'nfc-cloud',
      ),
    ).toBe(false);
    expect(isAccountCloudinaryUrl('https://evil.example.com/nfc-cloud/image/upload/nfc-media/photo_1.webp', 'nfc-media/photo_1', 'nfc-cloud')).toBe(
      false,
    );
  });
});

// ===================================
// 6. Contrats du domaine public existant (parité avec tests/domain.test.mjs)
// ===================================
describe('Contrats du domaine public (match-state & resource-state)', () => {
  const now = new Date('2026-10-24T12:00:00.000Z');
  const sampleMatch = (status: any, date = '2026-10-25T12:00:00.000Z') => ({
    id: 'm1',
    homeTeam: 'NFC',
    awayTeam: 'Adversaire',
    status,
    date,
  });

  it('calcule correctement les états de match, la cohérence du classement et les vues DataState', () => {
    expect(getMatchState(sampleMatch('PROGRAMME'), now)).toBe('UPCOMING');
    expect(getMatchState(sampleMatch('EN_COURS', '2026-10-24T11:00:00.000Z'), now)).toBe('LIVE');
    expect(getNextMatch([sampleMatch('PROGRAMME', '2026-10-23T12:00:00.000Z'), sampleMatch('PROGRAMME')], now)?.date).toBe(
      '2026-10-25T12:00:00.000Z',
    );
    expect(
      isStandingConsistent({ played: 5, won: 3, drawn: 1, lost: 1, goalsFor: 8, goalsAgainst: 5, goalDifference: 3, points: 10 }),
    ).toBe(true);
    expect(isDataStale('2026-10-24T10:00:00.000Z', 60_000, now.getTime())).toBe(true);
    expect(getResourceView('ok')).toBe('content');
  });
});
