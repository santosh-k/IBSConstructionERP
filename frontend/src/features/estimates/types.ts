/**
 * PWD Delhi — Works Estimating types (Planning + Engineer wings).
 * Stages follow docs/PWD_DELHI_UI_PLAN.md estimate register.
 */

export type EstimateStage =
  | 'rough'
  | 'pe'
  | 'aa_es'
  | 'de'
  | 'ts'
  | 'nit';

export const ESTIMATE_STAGES: readonly EstimateStage[] = [
  'rough',
  'pe',
  'aa_es',
  'de',
  'ts',
  'nit',
] as const;

export const ESTIMATE_STAGE_LABELS: Record<EstimateStage, string> = {
  rough: 'Rough',
  pe: 'PE',
  aa_es: 'AA/ES',
  de: 'DE',
  ts: 'T/S',
  nit: 'NIT',
};

export interface EstimateRegisterItem {
  id: string;
  name: string;
  workDescription: string;
  projectId: string | null;
  projectName: string;
  stage: EstimateStage;
  amountInr: number;
  updatedAt: string;
  /** Optional link to an existing BOQ if derived from list API */
  boqId?: string | null;
  peDraft?: PEWizardState | null;
}

export interface PEWizardState {
  id: string;
  /** Work / estimate title */
  workName: string;
  projectName: string;
  /** Building / road / other */
  workType: 'building' | 'road' | 'other';
  /** Plinth area in m² (buildings) or equivalent measure */
  plinthAreaSqm: number;
  /** Location note (zone / circle) */
  locationNote: string;
  /** Plinth Area Rate code / description */
  parCode: string;
  parDescription: string;
  /** PAR ₹ / m² */
  parRate: number;
  /** Cost Index factor (e.g. 1.18) */
  costIndexFactor: number;
  costIndexLabel: string;
  /** Contingency percentage (e.g. 3) */
  contingencyPct: number;
  stage: EstimateStage;
  updatedAt: string;
}

export interface AbstractOfCost {
  plinthAreaSqm: number;
  parRate: number;
  costIndexFactor: number;
  baseCost: number;
  indexedCost: number;
  contingencyPct: number;
  contingencyAmount: number;
  estimatedCost: number;
  /** Informational GST 18% for works contract — not added into PE total by default */
  gstPct: number;
  gstAmount: number;
  totalWithGstInfo: number;
}

export const GST_WORKS_PCT = 18;
