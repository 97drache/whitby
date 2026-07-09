export const DOC_PREFIX = "canada-family-docs";

export function documentMetaBlobPath(slotId: string) {
  return `${DOC_PREFIX}/${slotId}.json`;
}

export function documentFileBlobPath(slotId: string) {
  return `${DOC_PREFIX}/${slotId}/file`;
}
