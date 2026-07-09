import { mkdir, readdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";
import { del, get, list, put } from "@vercel/blob";
import { defaultSharedDetails, normalizeSharedDetails, type SharedDetails } from "@/data/trip-data";

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

const DOC_PREFIX = "canada-family-docs";
const DETAILS_PATH = "canada-family-shared-details.json";
const LOCAL_DIR = path.join(process.cwd(), ".data", "shared-docs");
const LOCAL_DETAILS = path.join(process.cwd(), ".data", "shared-details.json");

const memoryDocs = new Map<string, StoredDocumentRecord>();
let memoryDetails: SharedDetails = defaultSharedDetails;

export type StorageInfo = {
  mode: "blob" | "local" | "ephemeral";
  persistent: boolean;
  message: string;
  checks?: {
    vercelRuntime: boolean;
    hasReadWriteToken: boolean;
    hasStoreId: boolean;
    hasOidcToken: boolean;
    readWriteTokenKey?: string;
    storeIdKey?: string;
  };
};

type BlobEnvSuffix = "READ_WRITE_TOKEN" | "STORE_ID";

function findBlobEnvKey(suffix: BlobEnvSuffix) {
  const standard = suffix === "READ_WRITE_TOKEN" ? "BLOB_READ_WRITE_TOKEN" : "BLOB_STORE_ID";
  if (process.env[standard]) return standard;

  for (const key of Object.keys(process.env)) {
    if (key.startsWith("BLOB_") && key.endsWith(`_${suffix}`) && process.env[key]) {
      return key;
    }
  }

  return undefined;
}

function readBlobEnv(suffix: BlobEnvSuffix) {
  const key = findBlobEnvKey(suffix);
  return key ? process.env[key] : undefined;
}

function getBlobClientOptions() {
  const token = readBlobEnv("READ_WRITE_TOKEN");
  const storeId = readBlobEnv("STORE_ID");
  const options: { token?: string; storeId?: string } = {};

  if (token) options.token = token;
  if (storeId) options.storeId = storeId;

  return options;
}

function hasBlobStorage() {
  const { token, storeId } = getBlobClientOptions();
  if (token) return true;
  if (storeId && isVercelRuntime()) return true;
  return false;
}

function getBlobAuthMethod() {
  const { token, storeId } = getBlobClientOptions();
  if (storeId && isVercelRuntime()) return "oidc";
  if (token) return "token";
  return null;
}

function isVercelRuntime() {
  return process.env.VERCEL === "1" || Boolean(process.env.VERCEL_ENV);
}

export function getStorageInfo(): StorageInfo {
  const readWriteTokenKey = findBlobEnvKey("READ_WRITE_TOKEN");
  const storeIdKey = findBlobEnvKey("STORE_ID");
  const checks = {
    vercelRuntime: isVercelRuntime(),
    hasReadWriteToken: Boolean(readWriteTokenKey),
    hasStoreId: Boolean(storeIdKey),
    hasOidcToken: Boolean(process.env.VERCEL_OIDC_TOKEN),
    readWriteTokenKey,
    storeIdKey,
  };

  if (hasBlobStorage()) {
    const authMethod = getBlobAuthMethod();
    return {
      mode: "blob",
      persistent: true,
      message:
        authMethod === "oidc"
          ? "Vercel Blob(OIDC)에 저장되어 배포 후에도 유지됩니다."
          : "Vercel Blob에 저장되어 배포 후에도 유지됩니다.",
      checks,
    };
  }

  if (isVercelRuntime()) {
    return {
      mode: "ephemeral",
      persistent: false,
      message:
        "영구 저장소가 연결되지 않았습니다. 배포할 때마다 업로드한 서류가 사라집니다. Vercel 대시보드에서 Blob 스토어를 연결해 주세요.",
      checks,
    };
  }

  return {
    mode: "local",
    persistent: true,
    message: "로컬 .data 폴더에 저장됩니다.",
    checks,
  };
}

async function ensureLocalDir() {
  await mkdir(LOCAL_DIR, { recursive: true });
}

function localDocPath(slotId: string) {
  return path.join(LOCAL_DIR, `${slotId}.json`);
}

async function readBlobJson(pathname: string) {
  const result = await get(pathname, {
    ...getBlobClientOptions(),
    access: "private",
  });
  if (!result || !result.stream) return null;
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
    const result = await list({ prefix: `${DOC_PREFIX}/`, ...getBlobClientOptions() });
    const metas: StoredDocumentMeta[] = [];
    for (const blob of result.blobs) {
      const record = await readBlobJson(blob.pathname);
      if (record) metas.push(toMeta(record));
    }
    return metas;
  }

  if (isVercelRuntime()) {
    return Array.from(memoryDocs.values()).map(toMeta);
  }

  try {
    await ensureLocalDir();
    const files = await readdir(LOCAL_DIR);
    const metas: StoredDocumentMeta[] = [];
    for (const file of files) {
      if (!file.endsWith('.json')) continue;
      const raw = await readFile(path.join(LOCAL_DIR, file), 'utf8');
      const record = JSON.parse(raw) as StoredDocumentRecord;
      metas.push(toMeta(record));
    }
    return metas;
  } catch {
    return [];
  }
}

export async function getDocument(slotId: string): Promise<StoredDocumentRecord | null> {
  if (hasBlobStorage()) return readBlobJson(`${DOC_PREFIX}/${slotId}.json`);
  if (isVercelRuntime()) return memoryDocs.get(slotId) ?? null;
  try {
    const raw = await readFile(localDocPath(slotId), 'utf8');
    return JSON.parse(raw) as StoredDocumentRecord;
  } catch {
    return null;
  }
}

export async function saveDocument(input: { slotId: string; name: string; type: string; dataUrl: string; }) {
  const record: StoredDocumentRecord = {
    slotId: input.slotId,
    name: input.name,
    type: input.type,
    size: Buffer.byteLength(input.dataUrl, 'utf8'),
    uploadedAt: new Date().toISOString(),
    dataUrl: input.dataUrl,
  };

  if (hasBlobStorage()) {
    await put(`${DOC_PREFIX}/${input.slotId}.json`, JSON.stringify(record), {
      ...getBlobClientOptions(),
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return toMeta(record);
  }

  if (isVercelRuntime()) {
    memoryDocs.set(input.slotId, record);
    return toMeta(record);
  }

  await ensureLocalDir();
  await writeFile(localDocPath(input.slotId), JSON.stringify(record), 'utf8');
  return toMeta(record);
}

export async function deleteDocument(slotId: string) {
  if (hasBlobStorage()) {
    const result = await list({ prefix: `${DOC_PREFIX}/${slotId}.json`, ...getBlobClientOptions() });
    if (result.blobs[0]) await del(result.blobs[0].url, getBlobClientOptions());
    return;
  }

  if (isVercelRuntime()) {
    memoryDocs.delete(slotId);
    return;
  }

  try {
    await unlink(localDocPath(slotId));
  } catch {}
}

export async function clearDocuments() {
  const docs = await listDocuments();
  await Promise.all(docs.map((doc) => deleteDocument(doc.slotId)));
}

export async function getSharedDetails(): Promise<SharedDetails> {
  if (hasBlobStorage()) {
    const result = await get(DETAILS_PATH, { ...getBlobClientOptions(), access: 'private' });
    if (!result || !result.stream) return defaultSharedDetails;
    const raw = await new Response(result.stream).text();
    return normalizeSharedDetails(JSON.parse(raw));
  }

  if (isVercelRuntime()) return normalizeSharedDetails(memoryDetails);

  try {
    const raw = await readFile(LOCAL_DETAILS, 'utf8');
    return normalizeSharedDetails(JSON.parse(raw));
  } catch {
    return defaultSharedDetails;
  }
}

export async function saveSharedDetails(details: SharedDetails) {
  const next = normalizeSharedDetails(details);

  if (hasBlobStorage()) {
    await put(DETAILS_PATH, JSON.stringify(next), {
      ...getBlobClientOptions(),
      access: 'private',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType: 'application/json',
    });
    return next;
  }

  if (isVercelRuntime()) {
    memoryDetails = next;
    return next;
  }

  await mkdir(path.dirname(LOCAL_DETAILS), { recursive: true });
  await writeFile(LOCAL_DETAILS, JSON.stringify(next), 'utf8');
  return next;
}
