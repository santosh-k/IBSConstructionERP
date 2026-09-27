/**
 * Demo PWD Delhi DSR catalog (placeholder).
 * Marked as demo until real CSV / india_pack PWD_DELHI_DSR rates land.
 * Rates are indicative INR figures for building + road SOR-style items.
 */

import type { DSRItem } from './types';

/** Banner shown in DE editor — never treat as sanctioned rates. */
export const DEMO_DSR_BANNER =
  '⚠ DEMO DSR (not sanctioned) — placeholder rates for officer walkthrough only. Replace with PWD Delhi DSR / india_pack CSV before production use.';

export const DEMO_DSR_CATALOG: readonly DSRItem[] = [
  {
    code: '2.8.1',
    description: 'Earth work in excavation by mechanical means (Hydraulic excavator) / manual means in foundation trenches or drains, including dressing of sides and ramming of bottoms, lift up to 1.5 m — ordinary soil',
    unit: 'cum',
    rate: 286.5,
    category: 'earthwork',
  },
  {
    code: '2.25',
    description: 'Filling available excavated earth (excluding rock) in trenches, plinth, sides of foundations etc. in layers not exceeding 20 cm in depth, consolidating each deposited layer by ramming and watering',
    unit: 'cum',
    rate: 168.4,
    category: 'earthwork',
  },
  {
    code: '4.1.3',
    description: 'Providing and laying in position cement concrete of specified grade excluding the cost of centering and shuttering — All work up to plinth level: 1:2:4 (1 cement : 2 coarse sand : 4 graded stone aggregate 20 mm nominal size)',
    unit: 'cum',
    rate: 6_245.0,
    category: 'concrete',
  },
  {
    code: '5.1',
    description: 'Providing and laying in position specified grade of reinforced cement concrete, excluding the cost of centering, shuttering, finishing and reinforcement — All work up to plinth level: 1:1.5:3',
    unit: 'cum',
    rate: 7_890.0,
    category: 'concrete',
  },
  {
    code: '5.9.1',
    description: 'Centering and shuttering including strutting, propping etc. and removal of form for Foundations, footings, bases of columns, etc. for mass concrete',
    unit: 'sqm',
    rate: 312.75,
    category: 'concrete',
  },
  {
    code: '5.22.6',
    description: 'Steel reinforcement for R.C.C. work including straightening, cutting, bending, placing in position and binding all complete upto plinth level — Thermo-Mechanically Treated bars of grade Fe-500D or more',
    unit: 'kg',
    rate: 89.65,
    category: 'steel',
  },
  {
    code: '6.1.2',
    description: 'Brick work with common burnt clay F.P.S. (non modular) bricks of class designation 7.5 in foundation and plinth in: Cement mortar 1:6 (1 cement : 6 coarse sand)',
    unit: 'cum',
    rate: 5_680.0,
    category: 'masonry',
  },
  {
    code: '6.4.1',
    description: 'Brick work with common burnt clay F.P.S. (non modular) bricks of class designation 7.5 in superstructure above plinth level up to floor V level in all shapes and sizes in: Cement mortar 1:4 (1 cement : 4 coarse sand)',
    unit: 'cum',
    rate: 6_420.0,
    category: 'masonry',
  },
  {
    code: '11.3.1',
    description: 'Cement concrete flooring 1:2:4 (1 cement : 2 coarse sand : 4 graded stone aggregate) finished with a floating coat of neat cement, including cement slurry, but excluding the cost of nosing of steps etc. complete — 40 mm thick',
    unit: 'sqm',
    rate: 428.5,
    category: 'finishing',
  },
  {
    code: '13.1.1',
    description: '12 mm cement plaster of mix: 1:4 (1 cement : 4 fine sand)',
    unit: 'sqm',
    rate: 198.2,
    category: 'finishing',
  },
  {
    code: '13.26',
    description: 'Providing and applying plaster of paris putty of 2 mm thickness over plastered surface to prepare the surface even and smooth complete',
    unit: 'sqm',
    rate: 156.8,
    category: 'finishing',
  },
  {
    code: '13.41.1',
    description: 'Distempering with oil bound washable distemper of approved brand and manufacture to give an even shade: New work (two or more coats) over and including water thinnable priming coat with cement primer',
    unit: 'sqm',
    rate: 112.4,
    category: 'finishing',
  },
  {
    code: '10.25.2',
    description: 'Steel work welded in built up sections/ framed work, including cutting, hoisting, fixing in position and applying a priming coat of approved steel primer — In gratings, frames, guard bar, ladders, railings, brackets, gates and similar works',
    unit: 'kg',
    rate: 112.9,
    category: 'steel',
  },
  {
    code: '16.1',
    description: 'Preparation and consolidation of sub grade with power road roller of 8 to 12 tonne capacity after excavating earth to an average of 22.5 cm depth, dressing to camber and consolidating with road roller including making good the undulations etc. and re-rolling the sub grade and disposal of surplus earth with lead upto 50 metres',
    unit: 'sqm',
    rate: 124.6,
    category: 'road',
  },
  {
    code: '16.3.1',
    description: 'Supplying and stacking at site: 90 mm to 45 mm size stone aggregate',
    unit: 'cum',
    rate: 1_685.0,
    category: 'road',
  },
  {
    code: '16.31.1.1',
    description: 'Providing and applying tack coat using bitumen emulsion conforming to IS:8887, using emulsion pressure distributor including preparing the surface & cleaning with mechanical broom — On W.B.M. / W.M.M. @ 0.4 kg/sqm',
    unit: 'sqm',
    rate: 18.75,
    category: 'road',
  },
  {
    code: '16.40.1',
    description: 'Providing and laying Dense Graded Bituminous Macadam using crushed stone aggregates of specified grading, premixed with bituminous binder and filler, transporting the hot mix to work site, laying with a hydrostatic paver finisher with sensor control to the required grade, level and alignment, rolling with smooth wheeled, vibratory and tandem rollers to achieve the desired compaction — 50 to 75 mm thickness (Grading I)',
    unit: 'cum',
    rate: 9_850.0,
    category: 'road',
  },
  {
    code: '16.57.1',
    description: 'Providing and laying Bituminous concrete using crushed stone aggregates of specified grading, premixed with bituminous binder and filler, transporting the hot mix to work site, laying with a hydrostatic paver finisher with sensor control to the required grade, level and alignment, rolling with smooth wheeled, vibratory and tandem rollers to achieve the desired compaction — 40/50 mm thickness (Grading II)',
    unit: 'cum',
    rate: 11_240.0,
    category: 'road',
  },
  {
    code: '19.1.1',
    description: 'Providing, laying and jointing glazed stoneware pipes class SP-1 with stiff mixture of cement mortar in the proportion of 1:1 (1 cement : 1 fine sand) including testing of joints etc. complete: 100 mm diameter',
    unit: 'm',
    rate: 312.0,
    category: 'misc',
  },
  {
    code: '21.1.1.1',
    description: 'Providing and fixing aluminium work for doors, windows, ventilators and partitions with extruded built up standard tubular sections/ appropriate Z sections and other sections of approved make conforming to IS: 733 and IS: 1285, fixing with dash fasteners of required dia and size, including filling up of gaps at junctions, at top, bottom and sides with required EPDM rubber/ neoprene gasket etc. — For fixed portion: Anodised aluminium (anodised transparent or dyed to required shade according to IS: 1868, Minimum anodic coating of grade AC 15)',
    unit: 'kg',
    rate: 428.5,
    category: 'misc',
  },
  {
    code: '9.1.1',
    description: 'Providing wood work in frames of doors, windows, clerestory windows and other frames, wrought framed and fixed in position with hold fast lugs or with dash fasteners of required dia & length (hold fast lugs or dash fastener shall be paid for separately): Second class teak wood',
    unit: 'cum',
    rate: 1_28_500.0,
    category: 'misc',
  },
  {
    code: '12.1.1',
    description: 'Providing corrugated G.S. sheet roofing including vertical / curved surface fixed with polymer coated J or L hooks, bolts and nuts 8 mm diameter with bitumen and G.I. limpet washers or with G.I. limpet washers filled with white lead, including a coat of approved steel primer and two coats of approved paint on overlapping of sheets complete (up to any pitch in horizontal/ vertical or curved surfaces) excluding the cost of purlins, rafters and trusses: 0.63 mm thick with zinc coating not less than 275 gm/m²',
    unit: 'sqm',
    rate: 785.0,
    category: 'misc',
  },
] as const;

export function searchDemoDSR(query: string, category?: DSRItem['category'] | 'all'): DSRItem[] {
  const q = query.trim().toLowerCase();
  return DEMO_DSR_CATALOG.filter((item) => {
    if (category && category !== 'all' && item.category !== category) return false;
    if (!q) return true;
    return (
      item.code.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.unit.toLowerCase().includes(q)
    );
  });
}
