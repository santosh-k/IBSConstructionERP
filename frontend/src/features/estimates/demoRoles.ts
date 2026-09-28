/**
 * PWD Delhi — demo Planning vs Engineer wing roles (NOT GNCTD prod RBAC).
 *
 * One login can flip Planning ↔ Engineer via localStorage for officer-desk demos.
 * Split follows docs/PWD_DELHI_UI_PLAN.md:
 *   - Planning: PE wizard, early stage advance (Rough → PE → AA/ES), Abstract view,
 *     AA/ES sanction note. Not DE deep-edit or late T/S / NIT advance.
 *   - Engineer: DE editor + DSR, DE → T/S → NIT advance, T/S sanction notes,
 *     Abstract/SOQ export. Not PE create/edit or early Planning advances.
 */

import type { EstimateStage } from './types';
import { ESTIMATE_STAGE_LABELS } from './types';

export type DemoWingRole = 'planning' | 'engineer';

export const DEMO_WING_STORAGE_KEY = 'pwd_delhi_demo_wing_role';

/** Custom event so pages update when the switcher changes role in-tab. */
export const DEMO_WING_CHANGE_EVENT = 'pwd-delhi-demo-wing-change';

export const DEMO_ROLE_LABELS: Record<
  DemoWingRole,
  { en: string; hi: string; short: string }
> = {
  planning: { en: 'Planning', hi: 'योजना', short: 'Planning' },
  engineer: { en: 'Engineer', hi: 'अभियंता', short: 'Engineer' },
};

export const DEMO_ROLE_BANNER =
  'Demo roles only — not GNCTD production RBAC · डेमो भूमिकाएँ — वास्तविक आरबीएसी नहीं';

const DEFAULT_ROLE: DemoWingRole = 'planning';

export function loadDemoWingRole(): DemoWingRole {
  try {
    const raw = localStorage.getItem(DEMO_WING_STORAGE_KEY);
    if (raw === 'planning' || raw === 'engineer') return raw;
  } catch {
    /* ignore */
  }
  return DEFAULT_ROLE;
}

export function saveDemoWingRole(role: DemoWingRole): void {
  try {
    localStorage.setItem(DEMO_WING_STORAGE_KEY, role);
  } catch {
    /* ignore */
  }
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(DEMO_WING_CHANGE_EVENT, { detail: { role } }),
    );
  }
}

/** Stages this demo wing may advance FROM (into the next stage). */
export function canAdvanceFromStage(
  role: DemoWingRole,
  from: EstimateStage,
): boolean {
  if (role === 'planning') {
    return from === 'rough' || from === 'pe';
  }
  // Engineer: AA/ES → DE, DE → T/S, T/S → NIT
  return from === 'aa_es' || from === 'de' || from === 'ts';
}

export function advanceBlockedReason(
  role: DemoWingRole,
  from: EstimateStage,
): string | null {
  if (canAdvanceFromStage(role, from)) return null;
  const next = ESTIMATE_STAGE_LABELS[from];
  if (role === 'planning') {
    return `Planning demo role cannot advance past AA/ES (blocked at ${next}). Switch to Engineer · योजना भूमिका बाद के चरण नहीं बढ़ा सकती — अभियंता चुनें`;
  }
  return `Engineer demo role cannot advance early stages (${next}). Switch to Planning · अभियंता भूमिका प्रारंभिक चरण नहीं बढ़ा सकती — योजना चुनें`;
}

export function canCreateOrEditPE(role: DemoWingRole): boolean {
  return role === 'planning';
}

export function peEditBlockedReason(role: DemoWingRole): string | null {
  if (canCreateOrEditPE(role)) return null;
  return 'PE create/edit is a Planning demo affordance. Switch role · पीई संपादन योजना भूमिका के लिए है';
}

export function canCreateOrEditDE(role: DemoWingRole): boolean {
  return role === 'engineer';
}

export function deEditBlockedReason(role: DemoWingRole): string | null {
  if (canCreateOrEditDE(role)) return null;
  return 'DE deep-edit / DSR pick is an Engineer demo affordance. Switch role · डीई संपादन अभियंता भूमिका के लिए है';
}

/** Both wings may view Abstract / SOQ exports. */
export function canExportAbstractSoq(_role: DemoWingRole): boolean {
  return true;
}

/** Planning edits AA/ES note; Engineer edits T/S + power notes. */
export function canEditAaEsNote(role: DemoWingRole): boolean {
  return role === 'planning';
}

export function canEditTsSanctionNotes(role: DemoWingRole): boolean {
  return role === 'engineer';
}

export function aaEsNoteBlockedReason(role: DemoWingRole): string | null {
  if (canEditAaEsNote(role)) return null;
  return 'AA/ES notes are a Planning demo field. Switch role · एए/ईएस नोट योजना के लिए है';
}

export function tsSanctionBlockedReason(role: DemoWingRole): string | null {
  if (canEditTsSanctionNotes(role)) return null;
  return 'T/S & power notes are an Engineer demo field. Switch role · टी/एस नोट अभियंता के लिए है';
}

export function canSaveAnySanction(role: DemoWingRole): boolean {
  return canEditAaEsNote(role) || canEditTsSanctionNotes(role);
}
