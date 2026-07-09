import { NextResponse } from "next/server";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { uploadSlots } from "@/data/trip-data";
import { documentFileBlobPath } from "@/lib/doc-paths";
import { getBlobUploadToken } from "@/lib/doc-store";
import { isFamilyAuthenticatedFromRequest } from "@/lib/family-auth";

const ALLOWED_SLOT_IDS = new Set(uploadSlots.map((slot) => slot.id));
const MAX_FILE_BYTES = 15 * 1024 * 1024;

const ALLOWED_CONTENT_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/webp",
];

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      token: getBlobUploadToken(),
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        if (!isFamilyAuthenticatedFromRequest(request)) {
          throw new Error("가족 PIN으로 먼저 잠금 해제해 주세요.");
        }

        let slotId = "";
        if (clientPayload) {
          try {
            const payload = JSON.parse(clientPayload) as { slotId?: string };
            slotId = payload.slotId?.trim() ?? "";
          } catch {
            throw new Error("올바르지 않은 업로드입니다.");
          }
        }

        if (!ALLOWED_SLOT_IDS.has(slotId)) {
          throw new Error("올바르지 않은 문서 구분입니다.");
        }

        if (pathname !== documentFileBlobPath(slotId)) {
          throw new Error("올바르지 않은 업로드 경로입니다.");
        }

        return {
          allowedContentTypes: ALLOWED_CONTENT_TYPES,
          maximumSizeInBytes: MAX_FILE_BYTES,
          addRandomSuffix: false,
          allowOverwrite: true,
        };
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "업로드에 실패했습니다." },
      { status: 400 },
    );
  }
}
