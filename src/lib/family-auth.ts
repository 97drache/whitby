import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const FAMILY_COOKIE = "family_docs_access";
const SESSION_DAYS = 30;
const DEFAULT_PIN = "0114";

function getFamilyPin() {
  const fromEnv = process.env.FAMILY_PIN?.trim();
  return fromEnv && fromEnv.length > 0 ? fromEnv : DEFAULT_PIN;
}

function getSessionSecret() {
  return (
    process.env.FAMILY_SESSION_SECRET?.trim() ||
    `canada-again-family-session-${getFamilyPin()}`
  );
}

function signValue(value: string) {
  return createHmac("sha256", getSessionSecret()).update(value).digest("hex");
}

export function isValidFamilyPin(pin: string) {
  const expected = getFamilyPin();
  const incoming = Buffer.from(pin.trim(), "utf8");
  const target = Buffer.from(expected, "utf8");

  if (incoming.length !== target.length) {
    return false;
  }

  return timingSafeEqual(incoming, target);
}

export function createFamilySessionToken() {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = `ok.${expiresAt}`;
  return `${payload}.${signValue(payload)}`;
}

export function verifyFamilySessionToken(token: string | undefined) {
  if (!token) {
    return false;
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return false;
  }

  const [status, expiresAtText, signature] = parts;
  if (status !== "ok") {
    return false;
  }

  const expiresAt = Number(expiresAtText);
  if (!Number.isFinite(expiresAt) || expiresAt < Date.now()) {
    return false;
  }

  const payload = `${status}.${expiresAtText}`;
  const expected = signValue(payload);
  const left = Buffer.from(signature, "utf8");
  const right = Buffer.from(expected, "utf8");

  if (left.length !== right.length) {
    return false;
  }

  return timingSafeEqual(left, right);
}

export async function isFamilyAuthenticated() {
  const cookieStore = await cookies();
  return verifyFamilySessionToken(cookieStore.get(FAMILY_COOKIE)?.value);
}

export function isFamilyAuthenticatedFromRequest(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`${FAMILY_COOKIE}=([^;]+)`));
  return verifyFamilySessionToken(match?.[1]);
}

export function familyCookieOptions(maxAgeSeconds: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: maxAgeSeconds,
  };
}
