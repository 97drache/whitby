function digitsOnly(phone: string) {
  return phone.replace(/\D/g, "");
}

export function toKoreanTelHref(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;

  const digits = digitsOnly(trimmed);
  if (!digits) return null;

  let national = digits;
  if (national.startsWith("82")) {
    national = national.slice(2);
  }
  if (national.startsWith("0")) {
    national = national.slice(1);
  }

  return national ? `tel:+82${national}` : null;
}

export function toCanadaTelHref(phone: string): string | null {
  const trimmed = phone.trim();
  if (!trimmed) return null;

  const digits = digitsOnly(trimmed);
  if (!digits) return null;

  if (digits.startsWith("1")) {
    return `tel:+${digits}`;
  }

  return `tel:+1${digits}`;
}
