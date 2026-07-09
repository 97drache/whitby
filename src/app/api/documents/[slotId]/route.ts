import { NextResponse } from "next/server";
import { getDocument } from "@/lib/doc-store";
import { uploadSlots } from "@/data/trip-data";

const ALLOWED_SLOT_IDS = new Set(uploadSlots.map((slot) => slot.id));

type RouteContext = {
  params: Promise<{ slotId: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { slotId } = await context.params;
  if (!ALLOWED_SLOT_IDS.has(slotId)) {
    return NextResponse.json({ error: "Invalid document slot." }, { status: 400 });
  }
  const document = await getDocument(slotId);
  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }
  return NextResponse.json(document);
}