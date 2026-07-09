import { NextResponse } from "next/server";
import { getDocument } from "@/lib/doc-store";
import { uploadSlots } from "@/data/trip-data";

const ALLOWED_SLOT_IDS = new Set(uploadSlots.map((slot) => slot.id));

type RouteContext = {
  params: Promise<{ slotId: string }>;
};

function buildContentDisposition(name: string, download: boolean) {
  const encoded = encodeURIComponent(name);
  const fallback = name.replace(/[^\x20-\x7E]+/g, "_").replace(/"/g, "");
  const mode = download ? "attachment" : "inline";
  return `${mode}; filename="${fallback || "document"}"; filename*=UTF-8''${encoded}`;
}

function decodeDataUrl(dataUrl: string) {
  const match = dataUrl.match(/^data:([^;,]+)?(;base64)?,([\s\S]*)$/);
  if (!match) return null;

  const [, mimeType, base64Flag, rawBody] = match;
  const body = decodeURIComponent(rawBody);
  const buffer = base64Flag ? Buffer.from(body, "base64") : Buffer.from(body, "utf8");

  return {
    buffer,
    mimeType: mimeType || "application/octet-stream",
  };
}

export async function GET(request: Request, context: RouteContext) {
  const { slotId } = await context.params;
  if (!ALLOWED_SLOT_IDS.has(slotId)) {
    return NextResponse.json({ error: "Invalid document slot." }, { status: 400 });
  }
  const document = await getDocument(slotId);
  if (!document) {
    return NextResponse.json({ error: "Document not found." }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const format = searchParams.get("format");
  const shouldDownload = searchParams.get("download") === "1";

  if (format === "file") {
    const decoded = decodeDataUrl(document.dataUrl ?? "");
    if (!decoded) {
      return NextResponse.json({ error: "Document content is invalid." }, { status: 500 });
    }

    return new NextResponse(decoded.buffer, {
      headers: {
        "Content-Type": document.type || decoded.mimeType,
        "Content-Length": String(decoded.buffer.byteLength),
        "Content-Disposition": buildContentDisposition(document.name, shouldDownload),
        "Cache-Control": "private, no-store",
      },
    });
  }

  return NextResponse.json(document);
}