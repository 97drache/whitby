import { NextResponse } from "next/server";
import { getSharedDetails, saveSharedDetails } from "@/lib/doc-store";
import { isFamilyAuthenticated } from "@/lib/family-auth";

export async function GET() {
  if (!(await isFamilyAuthenticated())) {
    return NextResponse.json({ error: "Family PIN required." }, { status: 401 });
  }

  const details = await getSharedDetails();
  return NextResponse.json({ details });
}

export async function POST(request: Request) {
  if (!(await isFamilyAuthenticated())) {
    return NextResponse.json({ error: "Family PIN required." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      canadaPhoneNumber?: string;
      carNumber?: string;
    };

    const details = await saveSharedDetails({
      canadaPhoneNumber: String(body.canadaPhoneNumber ?? ""),
      carNumber: String(body.carNumber ?? ""),
    });

    return NextResponse.json({ details });
  } catch {
    return NextResponse.json({ error: "공유 정보를 저장할 수 없습니다." }, { status: 500 });
  }
}