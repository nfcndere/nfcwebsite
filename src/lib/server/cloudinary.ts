import { v2 as cloudinary } from 'cloudinary';

export const CLOUDINARY_FOLDER = 'nfc-media';

export const UPLOAD_LIMITS = {
  image: {
    maxBytes: 10 * 1024 * 1024,
    mimeTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/heic', 'image/heif'],
    formats: ['jpg', 'jpeg', 'png', 'webp', 'gif', 'avif', 'heic', 'heif'],
  },
  video: {
    maxBytes: 50 * 1024 * 1024,
    mimeTypes: ['video/mp4', 'video/quicktime', 'video/webm', 'video/x-matroska', 'video/3gpp'],
    formats: ['mp4', 'mov', 'webm', 'mkv', '3gp'],
  },
} as const;

export type UploadResourceType = keyof typeof UPLOAD_LIMITS;

type CloudinaryCredentials = {
  cloudName: string;
  apiKey: string;
  apiSecret: string;
};

/**
 * Lit les identifiants Cloudinary depuis les variables séparées (`CLOUDINARY_CLOUD_NAME`,
 * `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) OU depuis `CLOUDINARY_URL`
 * (`cloudinary://<api_key>:<api_secret>@<cloud_name>`).
 */
export function getCloudinaryCredentials(): CloudinaryCredentials | null {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME?.trim();
  const apiKey = process.env.CLOUDINARY_API_KEY?.trim();
  const apiSecret = process.env.CLOUDINARY_API_SECRET?.trim();
  if (cloudName && apiKey && apiSecret) {
    return { cloudName, apiKey, apiSecret };
  }

  const rawUrl = process.env.CLOUDINARY_URL?.trim();
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    if (parsed.protocol !== 'cloudinary:') return null;
    const urlCloudName = parsed.hostname;
    const urlApiKey = decodeURIComponent(parsed.username);
    const urlApiSecret = decodeURIComponent(parsed.password);
    if (!urlCloudName || !urlApiKey || !urlApiSecret) return null;
    return { cloudName: urlCloudName, apiKey: urlApiKey, apiSecret: urlApiSecret };
  } catch {
    return null;
  }
}

/** Configuration paresseuse : aucune lecture de secret au chargement du module. */
function ensureConfigured() {
  const creds = getCloudinaryCredentials();
  if (!creds) return;
  cloudinary.config({
    cloud_name: creds.cloudName,
    api_key: creds.apiKey,
    api_secret: creds.apiSecret,
    secure: true,
  });
}

export function isCloudinaryConfigured() {
  return Boolean(getCloudinaryCredentials());
}

export function resourceTypeFromMime(mimeType: string): UploadResourceType | null {
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  return null;
}

/**
 * Vérifie un fichier annoncé (type MIME + taille) avant de signer un envoi direct.
 * Renvoie un message d'erreur, ou null si le fichier est accepté.
 */
export function validateDeclaredUpload(resourceType: UploadResourceType, mimeType: string, size: number) {
  const limits = UPLOAD_LIMITS[resourceType];
  if (!(limits.mimeTypes as readonly string[]).includes(mimeType.toLowerCase())) {
    return `Type de fichier non accepté pour ${resourceType === 'image' ? 'une image' : 'une vidéo'}.`;
  }
  if (!Number.isFinite(size) || size <= 0 || size > limits.maxBytes) {
    return `Taille invalide : maximum ${limits.maxBytes / (1024 * 1024)} Mio pour ${resourceType === 'image' ? 'une image' : 'une vidéo'}.`;
  }
  return null;
}

/**
 * Signe les paramètres d'un envoi direct navigateur → Cloudinary.
 * Le secret sert uniquement à calculer la signature et n'est jamais renvoyé.
 */
export function signUploadParams(resourceType: UploadResourceType, now = Date.now()) {
  const creds = getCloudinaryCredentials();
  if (!creds) throw new Error('Cloudinary is not configured.');
  const { apiSecret, apiKey, cloudName } = creds;

  const timestamp = Math.floor(now / 1_000);
  const allowedFormats = UPLOAD_LIMITS[resourceType].formats.join(',');
  const paramsToSign = { allowed_formats: allowedFormats, folder: CLOUDINARY_FOLDER, timestamp };
  const signature = cloudinary.utils.api_sign_request(paramsToSign, apiSecret);

  return {
    timestamp,
    signature,
    apiKey,
    cloudName,
    folder: CLOUDINARY_FOLDER,
    resourceType,
    allowedFormats,
    maxBytes: UPLOAD_LIMITS[resourceType].maxBytes,
    uploadUrl: `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
  };
}

/**
 * Vrai si l'URL est une URL de livraison HTTPS du compte Cloudinary configuré
 * (`https://res.cloudinary.com/<cloudName>/<image|video>/upload/...`) qui contient le publicId.
 */
export function isAccountCloudinaryUrl(url: string, publicId: string, cloudName = getCloudinaryCredentials()?.cloudName) {
  if (!cloudName) return false;
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    return false;
  }
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'res.cloudinary.com') return false;
  const segments = parsed.pathname.split('/').filter(Boolean);
  if (segments[0] !== cloudName) return false;
  if (!['image', 'video'].includes(segments[1] ?? '') || segments[2] !== 'upload') return false;
  const decodedPath = decodeURIComponent(parsed.pathname);
  return decodedPath.includes(`/${publicId}`);
}

export async function uploadToCloudinary(filePath: string, options = {}) {
  ensureConfigured();
  return cloudinary.uploader.upload(filePath, options);
}

export async function destroyFromCloudinary(publicId: string, resourceType: UploadResourceType = 'image') {
  ensureConfigured();
  return cloudinary.uploader.destroy(publicId, { resource_type: resourceType, invalidate: true });
}

/** Lit les métadonnées réelles d'un asset (taille, format) via l'Admin API. */
export async function getCloudinaryResource(publicId: string, resourceType: UploadResourceType) {
  ensureConfigured();
  return cloudinary.api.resource(publicId, { resource_type: resourceType });
}

export function getCloudinary() {
  ensureConfigured();
  return cloudinary;
}

export default cloudinary;
