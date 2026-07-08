import { NextResponse } from "next/server";
import {
  FAMILY_COOKIE,
  createFamilySessionToken,
  familyCookieOptions,
  isValidFamilyPin,
} from "@/lib/family-auth";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { pin?: string };
    const pin = body.pin?.trim() ?? "";

    if (!isValidFamilyPin(pin)) {
      return NextResponse.json({ error: "Wrong family PIN." }, { status: 401 });
    }

    const token = createFamilySessionToken();
    const response = NextResponse.json({ ok: true });
    response.cookies.set(
      FAMILY_COOKIE,
      token,
      familyCookieOptions(30 * 24 * 60 * 60),
    );
    return response;
  } catch {
    return NextResponse.json({ error: "Unable to unlock documents." }, { status: 400 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true });
  response.cookies.set(FAMILY_COOKIE, "", familyCookieOptions(0));
  return response;
}
