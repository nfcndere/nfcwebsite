export function getSafeExternalUrl(value: string | null | undefined) {
  if (!value) return null;
  try {
    const url = new URL(value);
    return url.protocol === 'https:' || url.protocol === 'http:' ? url.toString() : null;
  } catch {
    return null;
  }
}

export function getWhatsAppNumber(value: string | null | undefined) {
  const number = value?.replace(/\D/g, '') ?? '';
  return number.length >= 7 && number.length <= 15 ? number : null;
}
