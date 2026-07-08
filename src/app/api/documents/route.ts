import { NextResponse } from "next/server";
import {
  clearDocuments,
  deleteDocument,
  listDocuments,
  saveDocument,
} from "@/lib/doc-store";
import { isFamilyAuthenticated } from "@/lib/family-auth";
import { uploadSlots } from "@/data/trip-data";

const ALLOWED_SLOT_IDS = new Set(uploadSlots.map((slot) => slot.id));
const MAX_FILE_CHARS = 4_500_000;

export async function GET() {
  if (!(await isFamilyAuthenticated())) {
    return NextResponse.json({ error: "Family PIN required." }, { status: 401 });
  }

  const documents = await listDocuments();
  return NextResponse.json({ documents });
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
      return NextResponse.json({ error: "Invalid document upload." }, { status: 400 });
    }

    if (dataUrl.length > MAX_FILE_CHARS) {
      return NextResponse.json(
        { error: "File is too large. Please upload a smaller PDF or image." },
        { status: 400 },
      );
    }

    const document = await saveDocument({ slotId, name, type, dataUrl });
    return NextResponse.json({ document });
  } catch {
    return NextResponse.json({ error: "Unable to save document." }, { status: 500 });
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
      return NextResponse.json({ error: "Invalid document slot." }, { status: 400 });
    }

    await deleteDocument(slotId);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to delete document." }, { status: 500 });
  }
}
