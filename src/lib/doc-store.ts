import { mkdir, readdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { del, get, list, put } from "@vercel/blob";

export type StoredDocumentMeta = {
  slotId: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
};

type StoredDocumentRecord = StoredDocumentMeta & {
  dataUrl: string;
};

const META_PREFIX = "canada-family-docs";
const LOCAL_DIR = path.join(process.cwd(), ".data", "shared-docs");

const memoryStore = new Map<string, StoredDocumentRecord>();

function hasBlobStorage() {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function isVercelRuntime() {
  return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
}

async function ensureLocalDir() {
  await mkdir(LOCAL_DIR, { recursive: true });
}

function localPath(slotId: string) {
  return path.join(LOCAL_DIR, `${slotId}.json`);
}

async function readBlobJson(pathname: string) {
  const result = await get(pathname, { access: "private" });
  if (!result || !result.stream) {
    return null;
  }

  const response = new Response(result.stream);
  const raw = await response.text();
  return JSON.parse(raw) as StoredDocumentRecord;
}

function toMeta(record: StoredDocumentRecord): StoredDocumentMeta {
  return {
    slotId: record.slotId,
    name: record.name,
    type: record.type,
    size: record.size,
    uploadedAt: record.uploadedAt,
  };
}

export async function listDocuments(): Promise<StoredDocumentMeta[]> {
  if (hasBlobStorage()) {
    const result = await list({ prefix: `${META_PREFIX}/` });
    const metas: StoredDocumentMeta[] = [];

    for (const blob of result.blobs) {
      const record = await readBlobJson(blob.pathname);
      if (!record) {
        continue;
      }
      metas.push(toMeta(record));
    }

    return metas;
  }

  if (isVercelRuntime()) {
    return Array.from(memoryStore.values()).map(toMeta);
  }

  try {
    await ensureLocalDir();
    const files = await readdir(LOCAL_DIR);
    const metas: StoredDocumentMeta[] = [];

    for (const file of files) {
      if (!file.endsWith(".json")) {
        continue;
      }

      const raw = await readFile(path.join(LOCAL_DIR, file), "utf8");
      const record = JSON.parse(raw) as StoredDocumentRecord;
      metas.push(toMeta(record));
    }

    return metas;
  } catch {
    return [];
  }
}

export async function getDocument(
  slotId: string,
): Promise<StoredDocumentRecord | null> {
  if (hasBlobStorage()) {
    return readBlobJson(`${META_PREFIX}/${slotId}.json`);
  }

  if (isVercelRuntime()) {
    return memoryStore.get(slotId) ?? null;
  }

  try {
    const raw = await readFile(localPath(slotId), "utf8");
    return JSON.parse(raw) as StoredDocumentRecord;
  } catch {
    return null;
  }
}

export async function saveDocument(input: {
  slotId: string;
  name: string;
  type: string;
  dataUrl: string;
}) {
  const record: StoredDocumentRecord = {
    slotId: input.slotId,
    name: input.name,
    type: input.type,
    size: Buffer.byteLength(input.dataUrl, "utf8"),
    uploadedAt: new Date().toISOString(),
    dataUrl: input.dataUrl,
  };

  if (hasBlobStorage()) {
    await put(`${META_PREFIX}/${input.slotId}.json`, JSON.stringify(record), {
      access: "private",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: "application/json",
    });
    return toMeta(record);
  }

  if (isVercelRuntime()) {
    memoryStore.set(input.slotId, record);
    return toMeta(record);
  }

  await ensureLocalDir();
  await writeFile(localPath(input.slotId), JSON.stringify(record), "utf8");
  return toMeta(record);
}

export async function deleteDocument(slotId: string) {
  if (hasBlobStorage()) {
    const result = await list({ prefix: `${META_PREFIX}/${slotId}.json` });
    if (result.blobs[0]) {
      await del(result.blobs[0].url);
    }
    return;
  }

  if (isVercelRuntime()) {
    memoryStore.delete(slotId);
    return;
  }

  try {
    await unlink(localPath(slotId));
  } catch {
    // already missing
  }
}

export async function clearDocuments() {
  const docs = await listDocuments();
  await Promise.all(docs.map((doc) => deleteDocument(doc.slotId)));
}
