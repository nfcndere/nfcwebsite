'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { isDataStale } from '@/lib/resource-state';

export type ApiStatus = 'loading' | 'ok' | 'empty' | 'stale' | 'partial' | 'error';
type ApiEnvelope<T> = { status?: ApiStatus; data: T; updatedAt?: string | null; message?: string };

export function useApiResource<T>(
  url: string,
  options: { staleAfterMs?: number; retry?: number; timeoutMs?: number } = {},
) {
  const { staleAfterMs, retry = 1, timeoutMs = 10_000 } = options;
  const [data, setData] = useState<T>();
  const [status, setStatus] = useState<ApiStatus>('loading');
  const [updatedAt, setUpdatedAt] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);
  const hasData = useRef(false);
  const activeController = useRef<AbortController | null>(null);

  const refresh = useCallback(() => setAttempt((current) => current + 1), []);

  useEffect(() => {
    let mounted = true;
    let cancelled = false;

    async function load() {
      setStatus('loading');
      setError(null);
      for (let index = 0; index <= retry; index += 1) {
        const controller = new AbortController();
        activeController.current = controller;
        const timeout = window.setTimeout(() => controller.abort(), timeoutMs);
        try {
          const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
          if (!response.ok) throw new Error(`Requête refusée (${response.status}).`);
          const result = await response.json() as ApiEnvelope<T> | T;
          if (!mounted || cancelled) return;
          if (result && typeof result === 'object' && 'data' in result) {
            const envelope = result as ApiEnvelope<T>;
            const staleByAge = staleAfterMs !== undefined && isDataStale(envelope.updatedAt, staleAfterMs);
            setData(envelope.data);
            hasData.current = true;
            setUpdatedAt(envelope.updatedAt ?? null);
            setStatus(staleByAge ? 'stale' : envelope.status ?? 'ok');
            setError(envelope.message ?? null);
          } else {
            const rawData = result as T;
            setData(rawData);
            hasData.current = true;
            setUpdatedAt(null);
            setStatus(Array.isArray(rawData) && rawData.length === 0 ? 'empty' : 'ok');
          }
          return;
        } catch (cause) {
          if (!mounted || cancelled) return;
          if (index < retry) continue;
          const message = controller.signal.aborted
            ? 'La requête a dépassé le délai prévu.'
            : cause instanceof Error ? cause.message : 'Impossible de charger les données.';
          setError(message);
          setStatus(hasData.current ? 'stale' : 'error');
        } finally {
          window.clearTimeout(timeout);
        }
      }
    }

    void load();
    return () => {
      mounted = false;
      cancelled = true;
      activeController.current?.abort();
    };
  }, [url, retry, timeoutMs, staleAfterMs, attempt]);

  return { data, status, updatedAt, error, retry: refresh };
}
