import { NextResponse } from "next/server";
import { getStorageInfo } from "@/lib/doc-store";

export async function GET() {
  return NextResponse.json(getStorageInfo());
}
