import { NextResponse } from "next/server";
import {
  clearDocuments,
  deleteDocument,
  getStorageInfo,
  listDocuments,
  saveDocument,
} from "@/lib/doc-store";
import { isFamilyAuthenticated } from "@/lib/family-auth";
import { uploadSlots } from "@/data/trip-data";

const ALLOWED_SLOT_IDS = new Set(uploadSlots.map((slot) => slot.id));
const MAX_FILE_CHARS = 4_500_000;

export async function GET() {
  const documents = await listDocuments();
  return NextResponse.json({ documents, storage: getStorageInfo() });
}

export async function POST(request: Request) {
  if (!(await isFamilyAuthenticated())) {
    return NextResponse.json({ error: "Family PIN required." }, { status: 401 });
  }

  try {
    const body = (await request.json()) as {
      slotId?: string;
      name?: string;
      type?: string;
      dataUrl?: string;
    };

    const slotId = body.slotId?.trim() ?? "";
    const name = body.name?.trim() ?? "";
    const type = body.type?.trim() || "application/octet-stream";
    const dataUrl = body.dataUrl ?? "";

    if (!ALLOWED_SLOT_IDS.has(slotId) || !name || !dataUrl.startsWith("data:")) {
      return NextResponse.json({ error: "올바르지 않은 업로드입니다." }, { status: 400 });
    }

    if (dataUrl.length > MAX_FILE_CHARS) {
      return NextResponse.json(
        { error: "파일이 너무 큽니다. PDF를 압축하거나 이미지로 변환해 주세요." },
        { status: 400 },
      );
    }

    const document = await saveDocument({ slotId, name, type, dataUrl });
    return NextResponse.json({ document });
  } catch {
    return NextResponse.json({ error: "문서를 저장할 수 없습니다." }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  if (!(await isFamilyAuthenticated())) {
    return NextResponse.json({ error: "Family PIN required." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const slotId = searchParams.get("slotId");
  const clearAll = searchParams.get("all") === "1";

  try {
    if (clearAll) {
      await clearDocuments();
      return NextResponse.json({ ok: true });
    }

    if (!slotId || !ALLOWED_SLOT_IDS.has(slotId)) {
      return NextResponse.json({ error: "올바르지 않은 문서 구분입니다." }, { status: 400 });
    }

    await deleteDocument(slotId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "문서를 삭제할 수 없습니다." }, { status: 500 });
  }
}