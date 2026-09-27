/**
 * PWD Delhi — Estimate Register
 * Stages: Rough → PE → AA/ES → DE → T/S → NIT
 * Spacious gov-simple UI (white cards, navy headers).
 */
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FilePlus2, FolderOpen, Search, Table2 } from 'lucide-react';
import { Badge, Breadcrumb, Button, Card, EmptyState } from '@/shared/ui';
import { apiGet } from '@/shared/lib/api';
import { DateDisplay } from '@/shared/ui/DateDisplay';
import {
  ESTIMATE_STAGE_LABELS,
  ESTIMATE_STAGES,
  type EstimateRegisterItem,
  type EstimateStage,
} from './types';
import { formatInr } from './peCompute';
import { loadRegister, stageFromBoqStatus } from './estimateStore';

interface ProjectRow {
  id: string;
  name: string;
}

interface BoqRow {
  id: string;
  project_id: string;
  name: string;
  description?: string;
  status: string;
  grand_total?: number;
  updated_at?: string;
  created_at?: string;
}

function stageBadgeVariant(
  stage: EstimateStage,
): 'neutral' | 'blue' | 'success' | 'warning' | 'error' {
  switch (stage) {
    case 'rough':
      return 'neutral';
    case 'pe':
      return 'blue';
    case 'aa_es':
      return 'warning';
    case 'de':
      return 'blue';
    case 'ts':
      return 'warning';
    case 'nit':
      return 'success';
    default:
      return 'neutral';
  }
}

export function EstimateRegisterPage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<EstimateRegisterItem[]>(() => loadRegister());
  const [stageFilter, setStageFilter] = useState<EstimateStage | 'all'>('all');
  const [search, setSearch] = useState('');

  const refresh = useCallback(() => {
    setItems(loadRegister());
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Optional: surface BOQ list alongside local register (demo-friendly).
  const { data: projects } = useQuery({
    queryKey: ['pwd-estimates-projects'],
    queryFn: () => apiGet<ProjectRow[]>('/v1/projects/'),
    staleTime: 60_000,
    retry: false,
  });

  const { data: boqDerived } = useQuery({
    queryKey: ['pwd-estimates-boq-merge', projects?.map((p) => p.id).join(',')],
    enabled: !!projects && projects.length > 0,
    queryFn: async () => {
      const projectMap = new Map(projects!.map((p) => [p.id, p.name]));
      const chunks = await Promise.all(
        projects!.slice(0, 12).map(async (p) => {
          try {
            const boqs = await apiGet<BoqRow[]>(`/v1/boq/boqs/?project_id=${p.id}`);
            return boqs.map((b) => ({
              id: `boq-${b.id}`,
              name: b.name,
              workDescription: b.description || 'From BOQ list',
              projectId: b.project_id,
              projectName: projectMap.get(b.project_id) || 'Project',
              stage: stageFromBoqStatus(b.status),
              amountInr: b.grand_total ?? 0,
              updatedAt: b.updated_at || b.created_at || new Date().toISOString(),
              boqId: b.id,
              peDraft: null,
            })) as EstimateRegisterItem[];
          } catch {
            return [] as EstimateRegisterItem[];
          }
        }),
      );
      return chunks.flat();
    },
    staleTime: 60_000,
    retry: false,
  });

  const merged = useMemo(() => {
    const byId = new Map<string, EstimateRegisterItem>();
    for (const row of items) byId.set(row.id, row);
    // BOQ-derived rows appear only when not already represented by a PE draft id.
    for (const row of boqDerived ?? []) {
      if (!byId.has(row.id)) byId.set(row.id, row);
    }
    return Array.from(byId.values()).sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    );
  }, [items, boqDerived]);

  const stageCounts = useMemo(() => {
    const counts: Record<string, number> = { all: merged.length };
    for (const s of ESTIMATE_STAGES) counts[s] = 0;
    for (const row of merged) {
      counts[row.stage] = (counts[row.stage] ?? 0) + 1;
    }
    return counts;
  }, [merged]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return merged.filter((row) => {
      if (stageFilter !== 'all' && row.stage !== stageFilter) return false;
      if (!q) return true;
      return (
        row.name.toLowerCase().includes(q) ||
        row.projectName.toLowerCase().includes(q) ||
        row.workDescription.toLowerCase().includes(q)
      );
    });
  }, [merged, stageFilter, search]);

  const openEstimate = (row: EstimateRegisterItem) => {
    if (row.peDraft || row.stage === 'pe' || row.stage === 'rough') {
      navigate(`/estimates/pe/${row.id}`);
      return;
    }
    if (row.boqId) {
      navigate(`/boq/${row.boqId}`);
      return;
    }
    navigate(`/estimates/pe/${row.id}`);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
      <Breadcrumb
        items={[
          { label: 'Dashboard', to: '/' },
          { label: 'Estimates' },
        ]}
        className="mb-4"
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#0B3A6E]">
            Estimate Register
          </h1>
          <p className="mt-1 text-sm text-content-secondary">
            अनुमान पंजी · Rough → PE → AA/ES → DE → T/S → NIT
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="primary"
            icon={<FilePlus2 className="h-4 w-4" />}
            onClick={() => navigate('/estimates/pe')}
          >
            New PE
          </Button>
          <Button variant="secondary" onClick={() => navigate('/boq')}>
            Open BOQ list
          </Button>
        </div>
      </div>

      {/* Stage chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStageFilter('all')}
          className={`rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
            stageFilter === 'all'
              ? 'bg-[#0B3A6E] text-white border-[#0B3A6E]'
              : 'bg-white text-content-secondary border-border hover:border-[#0B3A6E]/40'
          }`}
        >
          All ({stageCounts.all ?? 0})
        </button>
        {ESTIMATE_STAGES.map((stage) => (
          <button
            key={stage}
            type="button"
            onClick={() => setStageFilter(stage)}
            className={`rounded-full px-3 py-1.5 text-sm font-medium border transition-colors ${
              stageFilter === stage
                ? 'bg-[#0B3A6E] text-white border-[#0B3A6E]'
                : 'bg-white text-content-secondary border-border hover:border-[#0B3A6E]/40'
            }`}
          >
            {ESTIMATE_STAGE_LABELS[stage]} ({stageCounts[stage] ?? 0})
          </button>
        ))}
      </div>

      <Card padding="none" className="overflow-hidden border border-[#e2e7ef] shadow-sm">
        <div className="pwd-navy-bar px-4 py-3 flex items-center gap-2">
          <Table2 className="h-4 w-4 opacity-90" />
          <span className="text-sm font-semibold tracking-wide">Works estimates</span>
        </div>

        <div className="border-b border-border bg-[#F5F7FA] px-4 py-3">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-content-tertiary" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search work, project…"
              className="w-full rounded-md border border-border bg-white py-2 pl-9 pr-3 text-sm outline-none focus:border-[#0B3A6E] focus:ring-1 focus:ring-[#0B3A6E]/30"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={<FolderOpen className="h-8 w-8" />}
              title="No estimates in this view"
              description="Create a Preliminary Estimate or clear filters."
              action={
                <Button variant="primary" onClick={() => navigate('/estimates/pe')}>
                  New PE
                </Button>
              }
            />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-white text-content-tertiary">
                  <th className="px-4 py-3 font-medium">Name / Work</th>
                  <th className="px-4 py-3 font-medium">Project</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 font-medium text-right">Amount (₹)</th>
                  <th className="px-4 py-3 font-medium">Updated</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((row) => (
                  <tr
                    key={row.id}
                    className="border-b border-border/70 last:border-0 hover:bg-[#F5F7FA]/80"
                  >
                    <td className="px-4 py-3.5">
                      <div className="font-medium text-content-primary">{row.name}</div>
                      <div className="mt-0.5 text-xs text-content-tertiary line-clamp-1">
                        {row.workDescription}
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-content-secondary">{row.projectName}</td>
                    <td className="px-4 py-3.5">
                      <Badge variant={stageBadgeVariant(row.stage)} size="sm" dot>
                        {ESTIMATE_STAGE_LABELS[row.stage]}
                      </Badge>
                    </td>
                    <td className="px-4 py-3.5 text-right tabular-nums font-medium text-content-primary">
                      {formatInr(row.amountInr)}
                    </td>
                    <td className="px-4 py-3.5 text-content-secondary">
                      <DateDisplay value={row.updatedAt} />
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" size="sm" onClick={() => openEstimate(row)}>
                          Open
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <p className="mt-4 text-xs text-content-tertiary">
        Demo register uses local storage; BOQ rows merge when the API is reachable.
        Detailed Estimate (DE) editor lands in a later phase.
      </p>
    </div>
  );
}
