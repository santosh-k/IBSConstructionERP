/**
 * Compact demo wing switcher — Planning ↔ Engineer.
 * Persists in localStorage; not real auth / org RBAC.
 */
import { useCallback, useEffect, useState, type ReactNode } from 'react';
import {
  DEMO_ROLE_BANNER,
  DEMO_ROLE_LABELS,
  DEMO_WING_CHANGE_EVENT,
  loadDemoWingRole,
  saveDemoWingRole,
  type DemoWingRole,
} from './demoRoles';

/** Subscribe to localStorage + in-tab custom events for the demo wing role. */
export function useDemoWingRole(): [DemoWingRole, (role: DemoWingRole) => void] {
  const [role, setRoleState] = useState<DemoWingRole>(() => loadDemoWingRole());

  useEffect(() => {
    const sync = () => setRoleState(loadDemoWingRole());
    const onCustom = (e: Event) => {
      const detail = (e as CustomEvent<{ role?: DemoWingRole }>).detail;
      if (detail?.role === 'planning' || detail?.role === 'engineer') {
        setRoleState(detail.role);
      } else {
        sync();
      }
    };
    window.addEventListener('storage', sync);
    window.addEventListener(DEMO_WING_CHANGE_EVENT, onCustom);
    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(DEMO_WING_CHANGE_EVENT, onCustom);
    };
  }, []);

  const setRole = useCallback((next: DemoWingRole) => {
    saveDemoWingRole(next);
    setRoleState(next);
  }, []);

  return [role, setRole];
}

interface DemoRoleSwitcherProps {
  /** Compact inline (register header) vs full-width banner strip */
  variant?: 'banner' | 'inline';
  className?: string;
}

export function DemoRoleSwitcher({
  variant = 'banner',
  className = '',
}: DemoRoleSwitcherProps) {
  const [role, setRole] = useDemoWingRole();
  const label = DEMO_ROLE_LABELS[role];

  const select = (
    <label className="inline-flex items-center gap-2 text-xs sm:text-sm">
      <span className="font-medium text-[#0B3A6E] whitespace-nowrap">
        Demo wing · डेमो विंग
      </span>
      <select
        value={role}
        onChange={(e) => setRole(e.target.value as DemoWingRole)}
        className="rounded-md border border-[#0B3A6E]/35 bg-white px-2 py-1 text-sm font-semibold text-[#0B3A6E] outline-none focus:border-[#0B3A6E] focus:ring-1 focus:ring-[#0B3A6E]/30"
        aria-label="Demo Planning or Engineer wing role"
      >
        <option value="planning">
          {DEMO_ROLE_LABELS.planning.en} · {DEMO_ROLE_LABELS.planning.hi}
        </option>
        <option value="engineer">
          {DEMO_ROLE_LABELS.engineer.en} · {DEMO_ROLE_LABELS.engineer.hi}
        </option>
      </select>
      <span
        className={`rounded-full px-2 py-0.5 text-2xs font-semibold ${
          role === 'planning'
            ? 'bg-[#e8eef5] text-[#0B3A6E]'
            : 'bg-[var(--pwd-accent-subtle,#fef3e8)] text-[#0B3A6E]'
        }`}
      >
        {label.en}
      </span>
    </label>
  );

  if (variant === 'inline') {
    return <div className={className}>{select}</div>;
  }

  return (
    <div
      className={`mb-4 rounded-md border border-[#0B3A6E]/20 bg-[#F5F7FA] px-3 py-2.5 ${className}`}
      role="region"
      aria-label="Demo wing role switcher"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        {select}
        <p className="text-2xs sm:text-xs text-content-tertiary max-w-xl">
          {DEMO_ROLE_BANNER}
        </p>
      </div>
    </div>
  );
}

/** Wrap a disabled control so title/tooltip still works (Button uses pointer-events-none). */
export function RoleGate({
  blocked,
  reason,
  children,
}: {
  blocked: boolean;
  reason: string | null;
  children: ReactNode;
}) {
  if (!blocked) return <>{children}</>;
  return (
    <span
      className="inline-flex"
      title={reason ?? undefined}
      aria-label={reason ?? undefined}
    >
      {children}
    </span>
  );
}
