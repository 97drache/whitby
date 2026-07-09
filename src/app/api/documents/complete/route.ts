import { NextResponse } from "next/server";
import { saveDocumentMeta } from "@/lib/doc-store";
import { isFamilyAuthenticated } from "@/lib/family-auth";
import { uploadSlots } from "@/data/trip-data";

const ALLOWED_SLOT_IDS = new Set(uploadSlots.map((slot) => slot.id));

export async function POST(request: Request) {
  if (!(await isFamilyAuthenticated())) {
    return NextResponse.json({ error: "Family PIN required." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      slotId?: string;
      name?: string;
      type?: string;
      size?: number;
      blobPathname?: string;
    };

    const slotId = body.slotId?.trim() ?? "";
    const name = body.name?.trim() ?? "";
    const type = body.type?.trim() || "application/octet-stream";
    const size = Number(body.size ?? 0);
    const blobPathname = body.blobPathname?.trim() ?? "";

    if (!ALLOWED_SLOT_IDS.has(slotId) || !name || !blobPathname || !Number.isFinite(size) || size <= 0) {
      return NextResponse.json({ error: "올바르지 않은 업로드입니다." }, { status: 400 });
    }

    const document = await saveDocumentMeta({
      slotId,
      name,
      type,
      size,
      blobPathname,
    });

    return NextResponse.json({ document });
  } catch {
    return NextResponse.json({ error: "문서를 저장할 수 없습니다." }, { status: 500 });
  }
}
