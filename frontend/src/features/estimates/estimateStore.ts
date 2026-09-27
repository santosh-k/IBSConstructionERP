/**
 * Frontend-first estimate register persistence (localStorage).
 * Seeds demo Delhi works; merges optional BOQ-derived rows when API is available.
 */

import type { EstimateRegisterItem, EstimateStage, PEWizardState } from './types';
import { computeAbstract } from './peCompute';

const STORAGE_KEY = 'pwd_delhi_estimate_register_v1';

function nowIso(): string {
  return new Date().toISOString();
}

function uid(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export function createEmptyPEWizard(partial?: Partial<PEWizardState>): PEWizardState {
  return {
    id: partial?.id ?? uid('pe'),
    workName: partial?.workName ?? '',
    projectName: partial?.projectName ?? '',
    workType: partial?.workType ?? 'building',
    plinthAreaSqm: partial?.plinthAreaSqm ?? 0,
    locationNote: partial?.locationNote ?? 'Circle / Division — NCT of Delhi',
    parCode: partial?.parCode ?? '',
    parDescription: partial?.parDescription ?? '',
    parRate: partial?.parRate ?? 0,
    costIndexFactor: partial?.costIndexFactor ?? 1.18,
    costIndexLabel: partial?.costIndexLabel ?? 'Delhi CI 2026 Q1 (+18%)',
    contingencyPct: partial?.contingencyPct ?? 3,
    stage: partial?.stage ?? 'pe',
    updatedAt: partial?.updatedAt ?? nowIso(),
  };
}

function seedDemoRows(): EstimateRegisterItem[] {
  const pe = createEmptyPEWizard({
    id: 'pe-demo-school',
    workName: 'Construction of Govt. Sr. Sec. School, Rohini Sec-17',
    projectName: 'Education — Rohini',
    workType: 'building',
    plinthAreaSqm: 4_250,
    parCode: 'PAR-BLDG-RCC-G+3',
    parDescription: 'RCC framed building (G+3) — civil works',
    parRate: 28_500,
    costIndexFactor: 1.18,
    costIndexLabel: 'Delhi CI 2026 Q1 (+18%)',
    contingencyPct: 3,
    stage: 'pe',
  });
  const peAmount = computeAbstract(pe).estimatedCost;

  const rows: EstimateRegisterItem[] = [
    {
      id: 'est-demo-rough-drain',
      name: 'Storm water drain improvements — Najafgarh',
      workDescription: 'Rough cost for circular drain lining',
      projectId: null,
      projectName: 'Drainage — Najafgarh',
      stage: 'rough',
      amountInr: 1_85_00_000,
      updatedAt: nowIso(),
      peDraft: null,
    },
    {
      id: pe.id,
      name: pe.workName,
      workDescription: 'Preliminary Estimate (PAR-based)',
      projectId: null,
      projectName: pe.projectName,
      stage: 'pe',
      amountInr: peAmount,
      updatedAt: pe.updatedAt,
      peDraft: pe,
    },
    {
      id: 'est-demo-aaes-hospital',
      name: 'Upgradation of Polyclinic — Dwarka Sec-9',
      workDescription: 'AA/ES accorded — awaiting DE',
      projectId: null,
      projectName: 'Health — Dwarka',
      stage: 'aa_es',
      amountInr: 12_40_00_000,
      updatedAt: nowIso(),
      peDraft: null,
    },
    {
      id: 'est-demo-de-road',
      name: 'Strengthening of MDR — Outer Ring Rd stretch',
      workDescription: 'Detailed Estimate in progress (DSR)',
      projectId: null,
      projectName: 'Roads — South Circle',
      stage: 'de',
      amountInr: 8_75_50_000,
      updatedAt: nowIso(),
      peDraft: null,
    },
    {
      id: 'est-demo-ts-bridge',
      name: 'Pedestrian subway — ITO crossing',
      workDescription: 'Technical Sanction pending CE',
      projectId: null,
      projectName: 'Bridges — Central',
      stage: 'ts',
      amountInr: 5_20_00_000,
      updatedAt: nowIso(),
      peDraft: null,
    },
    {
      id: 'est-demo-nit-office',
      name: 'Office complex — PWD HQ annex (Phase-I)',
      workDescription: 'NIT floated',
      projectId: null,
      projectName: 'Buildings — HQ',
      stage: 'nit',
      amountInr: 42_15_00_000,
      updatedAt: nowIso(),
      peDraft: null,
    },
  ];
  return rows;
}

export function loadRegister(): EstimateRegisterItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = seedDemoRows();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    const parsed = JSON.parse(raw) as EstimateRegisterItem[];
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const seed = seedDemoRows();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return parsed;
  } catch {
    return seedDemoRows();
  }
}

export function saveRegister(items: EstimateRegisterItem[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function upsertEstimate(item: EstimateRegisterItem): EstimateRegisterItem[] {
  const list = loadRegister();
  const idx = list.findIndex((r) => r.id === item.id);
  if (idx >= 0) {
    list[idx] = item;
  } else {
    list.unshift(item);
  }
  saveRegister(list);
  return list;
}

export function getEstimateById(id: string): EstimateRegisterItem | undefined {
  return loadRegister().find((r) => r.id === id);
}

export function savePEDraft(state: PEWizardState): EstimateRegisterItem {
  const abstract = computeAbstract(state);
  const updated: PEWizardState = { ...state, updatedAt: nowIso(), stage: 'pe' };
  const item: EstimateRegisterItem = {
    id: updated.id,
    name: updated.workName || 'Untitled PE',
    workDescription: updated.parDescription
      ? `PE — ${updated.parDescription}`
      : 'Preliminary Estimate',
    projectId: null,
    projectName: updated.projectName || '—',
    stage: 'pe' as EstimateStage,
    amountInr: abstract.estimatedCost,
    updatedAt: updated.updatedAt,
    peDraft: updated,
  };
  upsertEstimate(item);
  return item;
}

/** Map BOQ status strings loosely onto estimate stages for optional merge. */
export function stageFromBoqStatus(status: string | undefined | null): EstimateStage {
  const s = (status || '').toLowerCase();
  if (s.includes('nit') || s === 'tendered') return 'nit';
  if (s.includes('ts') || s.includes('sanction')) return 'ts';
  if (s === 'final' || s === 'approved') return 'de';
  if (s === 'draft') return 'pe';
  return 'rough';
}
