/**
 * Optional best-effort persistence of PWD Delhi estimate snapshot into
 * linked BOQ.metadata.pwd_delhi_estimate (no new backend module).
 * LocalStorage remains the source of truth for the register.
 */
import { apiGet, apiPatch } from '@/shared/lib/api';
import type { EstimateRegisterItem } from './types';

const META_KEY = 'pwd_delhi_estimate';

interface BoqDetail {
  id: string;
  metadata?: Record<string, unknown> | null;
  metadata_?: Record<string, unknown> | null;
}

function snapshotFromItem(item: EstimateRegisterItem): Record<string, unknown> {
  return {
    id: item.id,
    name: item.name,
    workDescription: item.workDescription,
    projectId: item.projectId,
    projectName: item.projectName,
    stage: item.stage,
    amountInr: item.amountInr,
    updatedAt: item.updatedAt,
    peDraft: item.peDraft ?? null,
    deDraft: item.deDraft ?? null,
    sanction: item.sanction ?? null,
    syncedAt: new Date().toISOString(),
  };
}

/** Merge snapshot into BOQ metadata when item.boqId is set. Failures are ignored. */
export async function syncEstimateToBoq(
  item: EstimateRegisterItem,
): Promise<boolean> {
  if (!item.boqId) return false;
  try {
    const boq = await apiGet<BoqDetail>(`/v1/boq/boqs/${item.boqId}`);
    const existing =
      (boq.metadata as Record<string, unknown> | null | undefined) ??
      (boq.metadata_ as Record<string, unknown> | null | undefined) ??
      {};
    const next = {
      ...existing,
      [META_KEY]: snapshotFromItem(item),
    };
    await apiPatch(`/v1/boq/boqs/${item.boqId}`, { metadata: next });
    return true;
  } catch {
    return false;
  }
}

/** Read optional pwd_delhi_estimate snapshot from a BOQ detail response. */
export function estimateFromBoqMetadata(
  boqId: string,
  metadata: Record<string, unknown> | null | undefined,
): EstimateRegisterItem | null {
  if (!metadata || typeof metadata !== 'object') return null;
  const snap = metadata[META_KEY];
  if (!snap || typeof snap !== 'object') return null;
  const s = snap as Partial<EstimateRegisterItem>;
  if (!s.id || !s.name) return null;
  return {
    id: String(s.id),
    name: String(s.name),
    workDescription: String(s.workDescription ?? ''),
    projectId: (s.projectId as string | null) ?? null,
    projectName: String(s.projectName ?? '—'),
    stage: (s.stage as EstimateRegisterItem['stage']) ?? 'rough',
    amountInr: Number(s.amountInr) || 0,
    updatedAt: String(s.updatedAt ?? new Date().toISOString()),
    boqId,
    peDraft: (s.peDraft as EstimateRegisterItem['peDraft']) ?? null,
    deDraft: (s.deDraft as EstimateRegisterItem['deDraft']) ?? null,
    sanction: (s.sanction as EstimateRegisterItem['sanction']) ?? null,
  };
}
