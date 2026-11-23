import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { CONCRETE_RATIOS, REBAR_DIAMETERS, getRebarKgPerFoot, formatNum } from '../../data/rates';
import {
  CalculationResult,
  CalculatorModuleId,
  ConcreteRatioKey,
  RebarDia,
  UnitRates,
} from '../../types/calculator';
import {
  BeamInput,
  ColumnInput,
  FootingInput,
  PilingInput,
  RodEntryInput,
  SlabInput,
  calculateBeam,
  calculateColumn,
  calculateFooting,
  calculatePiling,
  calculateRodQuick,
  calculateSlab,
} from '../../utils/calculations';
import { BlueprintDiagram } from '../BlueprintDiagram';
import { CheckboxField, NumberField, SegmentedToggle, SelectField } from '../FormControls';
import { ResultPanel } from '../ResultPanel';

interface StructuralProps {
  activeModule: 'footing' | 'piling' | 'column' | 'beam' | 'slab' | 'rod';
  rates: UnitRates;
  onAddToBoq: (
    moduleId: CalculatorModuleId,
    moduleLabel: string,
    itemName: string,
    dimensionsText: string,
    result: CalculationResult
  ) => void;
}

const diaOptions = REBAR_DIAMETERS.map((d) => ({ value: d, label: `${d} mm` }));
const ratioOptions: { value: ConcreteRatioKey; label: string }[] = [
  { value: '1:1.5:3', label: CONCRETE_RATIOS['1:1.5:3'].label },
  { value: '1:2:4', label: CONCRETE_RATIOS['1:2:4'].label },
  { value: '1:3:6', label: CONCRETE_RATIOS['1:3:6'].label },
];

export const StructuralCalculators: React.FC<StructuralProps> = ({
  activeModule,
  rates,
  onAddToBoq,
}) => {
  // Footing state
  const [footing, setFooting] = useState<FootingInput>({
    count: 12,
    lengthFt: 5,
    widthFt: 5,
    thicknessIn: 14,
    ratio: '1:1.5:3',
    aggregateType: 'stone',
    barDia: 12,
    spacingIn: 6,
    doubleMesh: false,
    includeSolingAndCc: true,
    includeLabor: true,
    wastagePct: 3,
  });

  // Piling state
  const [piling, setPiling] = useState<PilingInput>({
    count: 24,
    diameterIn: 18,
    lengthFt: 55,
    ratio: '1:1.5:3',
    aggregateType: 'stone',
    mainBarCount: 6,
    mainBarDia: 16,
    spiralDia: 8,
    spiralPitchIn: 6,
    includeLabor: true,
    wastagePct: 5,
  });

  // Column state
  const [column, setColumn] = useState<ColumnInput>({
    count: 12,
    widthIn: 12,
    depthIn: 15,
    heightFt: 10,
    ratio: '1:1.5:3',
    aggregateType: 'stone',
    mainBarCount: 6,
    mainBarDia: 16,
    tieDia: 10,
    tieSpacingIn: 6,
    lappingFt: 2.5,
    includeLabor: true,
    wastagePct: 3,
  });

  // Beam state
  const [beam, setBeam] = useState<BeamInput>({
    count: 1,
    lengthFt: 160,
    widthIn: 10,
    depthIn: 15,
    ratio: '1:2:4',
    aggregateType: 'khoa',
    topBarCount: 2,
    topBarDia: 16,
    bottomBarCount: 3,
    bottomBarDia: 16,
    extraBarCount: 2,
    extraBarDia: 12,
    stirrupDia: 8,
    stirrupSpacingIn: 6,
    includeLabor: true,
    wastagePct: 3,
  });

  // Slab state
  const [slab, setSlab] = useState<SlabInput>({
    lengthFt: 40,
    widthFt: 30,
    thicknessIn: 5,
    ratio: '1:2:4',
    aggregateType: 'khoa',
    mainBarDia: 10,
    mainSpacingIn: 5,
    distBarDia: 10,
    distSpacingIn: 6,
    extraTopPct: 20,
    includeLabor: true,
    wastagePct: 3,
  });

  // Quick Rod Weight state
  const [rodEntries, setRodEntries] = useState<RodEntryInput[]>([
    { dia: 16, lengthFt: 39.5, pieces: 20 },
    { dia: 12, lengthFt: 39.5, pieces: 25 },
    { dia: 10, lengthFt: 39.5, pieces: 30 },
  ]);

  if (activeModule === 'footing') {
    const result = calculateFooting(footing, rates);
    const dimsText = `${footing.count}টি · ${footing.lengthFt}' × ${footing.widthFt}' × ${footing.thicknessIn}"`;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
          <BlueprintDiagram
            moduleId="footing"
            dims={{ l: footing.lengthFt, w: footing.widthFt, t: footing.thicknessIn }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              label="ফুটিংয়ের সংখ্যা"
              unit="টি"
              value={footing.count}
              min={1}
              onChange={(v) => setFooting({ ...footing, count: v })}
            />
            <NumberField
              label="পুরুত্ব / গভীরতা (Thickness)"
              unit="ইঞ্চি"
              value={footing.thicknessIn}
              min={6}
              onChange={(v) => setFooting({ ...footing, thicknessIn: v })}
            />
            <NumberField
              label="দৈর্ঘ্য (Length)"
              unit="ফুট"
              step={0.5}
              value={footing.lengthFt}
              min={1}
              onChange={(v) => setFooting({ ...footing, lengthFt: v })}
            />
            <NumberField
              label="প্রস্থ (Width)"
              unit="ফুট"
              step={0.5}
              value={footing.widthFt}
              min={1}
              onChange={(v) => setFooting({ ...footing, widthFt: v })}
            />
            <SelectField
              label="কংক্রিট অনুপাত"
              value={footing.ratio}
              options={ratioOptions}
              onChange={(v) => setFooting({ ...footing, ratio: v })}
            />
            <SegmentedToggle
              label="অ্যাগ্রিগেট (খোয়া / পাথর)"
              value={footing.aggregateType}
              options={[
                { value: 'stone', label: 'পাথর (Stone)' },
                { value: 'khoa', label: 'ইটের খোয়া' },
              ]}
              onChange={(v) => setFooting({ ...footing, aggregateType: v })}
            />
            <SelectField
              label="জালির রড সাইজ (Dia)"
              value={footing.barDia}
              options={diaOptions}
              onChange={(v) => setFooting({ ...footing, barDia: v })}
            />
            <NumberField
              label="রডের দূরত্ব (Spacing c/c)"
              unit="ইঞ্চি"
              value={footing.spacingIn}
              min={3}
              onChange={(v) => setFooting({ ...footing, spacingIn: v })}
            />
          </div>
          <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <CheckboxField
              label="ইট সলিং ও ৩ ইঞ্চি CC (1:3:6) যুক্ত করুন"
              description="ফুটিংয়ের নিচে ১ স্তর ফ্ল্যাট সলিং ও সিসি ঢালাই"
              checked={footing.includeSolingAndCc}
              onChange={(c) => setFooting({ ...footing, includeSolingAndCc: c })}
            />
            <CheckboxField
              label="ডাবল জালি (টপ + বটম)"
              description="উপরে ও নিচে উভয় স্তরে রড থাকলে টিক দিন"
              checked={footing.doubleMesh}
              onChange={(c) => setFooting({ ...footing, doubleMesh: c })}
            />
            <CheckboxField
              label="মিস্ত্রি / লেবার খরচ যুক্ত করুন"
              checked={footing.includeLabor}
              onChange={(c) => setFooting({ ...footing, includeLabor: c })}
            />
          </div>
        </div>
        <div className="lg:col-span-5">
          <ResultPanel
            moduleId="footing"
            moduleLabel="ফুটিং"
            defaultItemName={`ফুটিং (${footing.count}টি)`}
            dimensionsText={dimsText}
            result={result}
            onAddToBoq={(name, dims, res) => onAddToBoq('footing', 'ফুটিং', name, dims, res)}
          />
        </div>
      </div>
    );
  }

  if (activeModule === 'piling') {
    const result = calculatePiling(piling, rates);
    const dimsText = `${piling.count}টি পাইল · Ø${piling.diameterIn}" × ${piling.lengthFt}'`;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
          <BlueprintDiagram
            moduleId="piling"
            dims={{ d: piling.diameterIn, l: piling.lengthFt, s: piling.spiralPitchIn }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              label="পাইলের সংখ্যা"
              unit="টি"
              value={piling.count}
              min={1}
              onChange={(v) => setPiling({ ...piling, count: v })}
            />
            <NumberField
              label="পাইলের ব্যাস (Diameter)"
              unit="ইঞ্চি"
              value={piling.diameterIn}
              min={10}
              onChange={(v) => setPiling({ ...piling, diameterIn: v })}
            />
            <NumberField
              label="পাইলের গভীরতা / দৈর্ঘ্য"
              unit="ফুট"
              value={piling.lengthFt}
              min={5}
              onChange={(v) => setPiling({ ...piling, lengthFt: v })}
            />
            <SelectField
              label="কংক্রিট অনুপাত"
              value={piling.ratio}
              options={ratioOptions.slice(0, 2)}
              onChange={(v) => setPiling({ ...piling, ratio: v })}
            />
            <NumberField
              label="খাড়া মেইন রড সংখ্যা"
              unit="পিস / পাইল"
              value={piling.mainBarCount}
              min={4}
              onChange={(v) => setPiling({ ...piling, mainBarCount: v })}
            />
            <SelectField
              label="মেইন রডের সাইজ"
              value={piling.mainBarDia}
              options={diaOptions}
              onChange={(v) => setPiling({ ...piling, mainBarDia: v })}
            />
            <SelectField
              label="স্পাইরাল / রিং রডের সাইজ"
              value={piling.spiralDia}
              options={diaOptions.slice(0, 3)}
              onChange={(v) => setPiling({ ...piling, spiralDia: v })}
            />
            <NumberField
              label="স্পাইরাল রিং পিচ (দূরত্ব)"
              unit="ইঞ্চি c/c"
              value={piling.spiralPitchIn}
              min={3}
              onChange={(v) => setPiling({ ...piling, spiralPitchIn: v })}
            />
          </div>
          <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <SegmentedToggle
              label="খোয়া / পাথর"
              value={piling.aggregateType}
              options={[
                { value: 'stone', label: 'পাথর (সুপারিশকৃত)' },
                { value: 'khoa', label: 'ইটের খোয়া' },
              ]}
              onChange={(v) => setPiling({ ...piling, aggregateType: v })}
            />
            <CheckboxField
              label="ঢালাই ও কেজিং লেবার যুক্ত করুন"
              checked={piling.includeLabor}
              onChange={(c) => setPiling({ ...piling, includeLabor: c })}
            />
          </div>
        </div>
        <div className="lg:col-span-5">
          <ResultPanel
            moduleId="piling"
            moduleLabel="পাইলিং"
            defaultItemName={`পাইলিং (${piling.count}টি · Ø${piling.diameterIn}")`}
            dimensionsText={dimsText}
            result={result}
            onAddToBoq={(name, dims, res) => onAddToBoq('piling', 'পাইলিং', name, dims, res)}
          />
        </div>
      </div>
    );
  }

  if (activeModule === 'column') {
    const result = calculateColumn(column, rates);
    const dimsText = `${column.count}টি · ${column.widthIn}" × ${column.depthIn}" × ${column.heightFt}'`;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
          <BlueprintDiagram
            moduleId="column"
            dims={{ w: column.widthIn, d: column.depthIn, h: column.heightFt }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              label="কলামের সংখ্যা"
              unit="টি"
              value={column.count}
              min={1}
              onChange={(v) => setColumn({ ...column, count: v })}
            />
            <NumberField
              label="কলামের উচ্চতা (Height)"
              unit="ফুট"
              step={0.5}
              value={column.heightFt}
              min={1}
              onChange={(v) => setColumn({ ...column, heightFt: v })}
            />
            <NumberField
              label="প্রস্থ (Width)"
              unit="ইঞ্চি"
              value={column.widthIn}
              min={6}
              onChange={(v) => setColumn({ ...column, widthIn: v })}
            />
            <NumberField
              label="পুরুত্ব / গভীরতা (Depth)"
              unit="ইঞ্চি"
              value={column.depthIn}
              min={6}
              onChange={(v) => setColumn({ ...column, depthIn: v })}
            />
            <NumberField
              label="খাড়া মেইন রড সংখ্যা"
              unit="পিস / কলাম"
              value={column.mainBarCount}
              min={4}
              onChange={(v) => setColumn({ ...column, mainBarCount: v })}
            />
            <SelectField
              label="মেইন রডের সাইজ"
              value={column.mainBarDia}
              options={diaOptions}
              onChange={(v) => setColumn({ ...column, mainBarDia: v })}
            />
            <SelectField
              label="রিং / টাই রডের সাইজ"
              value={column.tieDia}
              options={diaOptions.slice(0, 3)}
              onChange={(v) => setColumn({ ...column, tieDia: v })}
            />
            <NumberField
              label="রিংয়ের দূরত্ব (Spacing)"
              unit="ইঞ্চি c/c"
              value={column.tieSpacingIn}
              min={3}
              onChange={(v) => setColumn({ ...column, tieSpacingIn: v })}
            />
            <SelectField
              label="কংক্রিট অনুপাত"
              value={column.ratio}
              options={ratioOptions.slice(0, 2)}
              onChange={(v) => setColumn({ ...column, ratio: v })}
            />
            <NumberField
              label="ল্যাপিং / এক্সট্রা রড"
              unit="ফুট / কলাম"
              step={0.5}
              value={column.lappingFt}
              min={0}
              onChange={(v) => setColumn({ ...column, lappingFt: v })}
            />
          </div>
          <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <SegmentedToggle
              label="খোয়া / পাথর"
              value={column.aggregateType}
              options={[
                { value: 'stone', label: 'পাথর (Stone)' },
                { value: 'khoa', label: 'ইটের খোয়া' },
              ]}
              onChange={(v) => setColumn({ ...column, aggregateType: v })}
            />
            <CheckboxField
              label="মিস্ত্রি / লেবার খরচ যুক্ত করুন"
              checked={column.includeLabor}
              onChange={(c) => setColumn({ ...column, includeLabor: c })}
            />
          </div>
        </div>
        <div className="lg:col-span-5">
          <ResultPanel
            moduleId="column"
            moduleLabel="কলাম"
            defaultItemName={`কলাম (${column.count}টি · ${column.widthIn}"×${column.depthIn}")`}
            dimensionsText={dimsText}
            result={result}
            onAddToBoq={(name, dims, res) => onAddToBoq('column', 'কলাম', name, dims, res)}
          />
        </div>
      </div>
    );
  }

  if (activeModule === 'beam') {
    const result = calculateBeam(beam, rates);
    const dimsText = `${beam.count}টি · দৈর্ঘ্য ${beam.lengthFt}' (${beam.widthIn}" × ${beam.depthIn}")`;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
          <BlueprintDiagram
            moduleId="beam"
            dims={{ l: beam.lengthFt, w: beam.widthIn, d: beam.depthIn }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              label="মোট বীমের দৈর্ঘ্য"
              unit="ফুট"
              value={beam.lengthFt}
              min={1}
              onChange={(v) => setBeam({ ...beam, lengthFt: v })}
            />
            <NumberField
              label="একই মাপের বীম সংখ্যা"
              unit="টি"
              value={beam.count}
              min={1}
              onChange={(v) => setBeam({ ...beam, count: v })}
            />
            <NumberField
              label="বীমের প্রস্থ (Width)"
              unit="ইঞ্চি"
              value={beam.widthIn}
              min={6}
              onChange={(v) => setBeam({ ...beam, widthIn: v })}
            />
            <NumberField
              label="বীমের গভীরতা (Depth)"
              unit="ইঞ্চি"
              value={beam.depthIn}
              min={6}
              onChange={(v) => setBeam({ ...beam, depthIn: v })}
            />
            <NumberField
              label="উপরের রড (Top Bar) সংখ্যা"
              unit="টি"
              value={beam.topBarCount}
              min={0}
              onChange={(v) => setBeam({ ...beam, topBarCount: v })}
            />
            <SelectField
              label="উপরের রডের সাইজ"
              value={beam.topBarDia}
              options={diaOptions}
              onChange={(v) => setBeam({ ...beam, topBarDia: v })}
            />
            <NumberField
              label="নিচের রড (Bottom Bar) সংখ্যা"
              unit="টি"
              value={beam.bottomBarCount}
              min={0}
              onChange={(v) => setBeam({ ...beam, bottomBarCount: v })}
            />
            <SelectField
              label="নিচের রডের সাইজ"
              value={beam.bottomBarDia}
              options={diaOptions}
              onChange={(v) => setBeam({ ...beam, bottomBarDia: v })}
            />
            <NumberField
              label="এক্সট্রা টপ/বটম রড সংখ্যা"
              unit="টি"
              value={beam.extraBarCount}
              min={0}
              onChange={(v) => setBeam({ ...beam, extraBarCount: v })}
            />
            <SelectField
              label="এক্সট্রা রডের সাইজ"
              value={beam.extraBarDia}
              options={diaOptions}
              onChange={(v) => setBeam({ ...beam, extraBarDia: v })}
            />
            <SelectField
              label="স্টিরাপ / রিং রডের সাইজ"
              value={beam.stirrupDia}
              options={diaOptions.slice(0, 3)}
              onChange={(v) => setBeam({ ...beam, stirrupDia: v })}
            />
            <NumberField
              label="স্টিরাপের দূরত্ব (Spacing)"
              unit="ইঞ্চি c/c"
              value={beam.stirrupSpacingIn}
              min={3}
              onChange={(v) => setBeam({ ...beam, stirrupSpacingIn: v })}
            />
          </div>
          <div className="mt-5 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
            <SelectField
              label="কংক্রিট অনুপাত"
              value={beam.ratio}
              options={ratioOptions.slice(0, 2)}
              onChange={(v) => setBeam({ ...beam, ratio: v })}
            />
            <SegmentedToggle
              label="খোয়া / পাথর"
              value={beam.aggregateType}
              options={[
                { value: 'khoa', label: 'ইটের খোয়া' },
                { value: 'stone', label: 'পাথর (Stone)' },
              ]}
              onChange={(v) => setBeam({ ...beam, aggregateType: v })}
            />
          </div>
          <div className="mt-3">
            <CheckboxField
              label="মিস্ত্রি / লেবার খরচ যুক্ত করুন"
              checked={beam.includeLabor}
              onChange={(c) => setBeam({ ...beam, includeLabor: c })}
            />
          </div>
        </div>
        <div className="lg:col-span-5">
          <ResultPanel
            moduleId="beam"
            moduleLabel="বীম"
            defaultItemName={`বীম (${beam.lengthFt} ফুট)`}
            dimensionsText={dimsText}
            result={result}
            onAddToBoq={(name, dims, res) => onAddToBoq('beam', 'বীম', name, dims, res)}
          />
        </div>
      </div>
    );
  }

  if (activeModule === 'slab') {
    const result = calculateSlab(slab, rates);
    const dimsText = `${slab.lengthFt}' × ${slab.widthFt}' (${slab.lengthFt * slab.widthFt} SFT · ${slab.thicknessIn}")`;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
          <BlueprintDiagram
            moduleId="slab"
            dims={{ l: slab.lengthFt, w: slab.widthFt, t: slab.thicknessIn }}
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              label="ছাদের দৈর্ঘ্য (Length)"
              unit="ফুট"
              step={0.5}
              value={slab.lengthFt}
              min={1}
              onChange={(v) => setSlab({ ...slab, lengthFt: v })}
            />
            <NumberField
              label="ছাদের প্রস্থ (Width)"
              unit="ফুট"
              step={0.5}
              value={slab.widthFt}
              min={1}
              onChange={(v) => setSlab({ ...slab, widthFt: v })}
            />
            <NumberField
              label="ছাদের পুরুত্ব (Thickness)"
              unit="ইঞ্চি"
              step={0.5}
              value={slab.thicknessIn}
              min={3}
              onChange={(v) => setSlab({ ...slab, thicknessIn: v })}
            />
            <SelectField
              label="কংক্রিট অনুপাত"
              value={slab.ratio}
              options={ratioOptions.slice(0, 2)}
              onChange={(v) => setSlab({ ...slab, ratio: v })}
            />
            <SelectField
              label="মেইন রডের সাইজ"
              value={slab.mainBarDia}
              options={diaOptions.slice(0, 4)}
              onChange={(v) => setSlab({ ...slab, mainBarDia: v })}
            />
            <NumberField
              label="মেইন রডের দূরত্ব"
              unit="ইঞ্চি c/c"
              value={slab.mainSpacingIn}
              min={3}
              onChange={(v) => setSlab({ ...slab, mainSpacingIn: v })}
            />
            <SelectField
              label="বাইন্ডার / ডিস্ট্রিবিউশন রড"
              value={slab.distBarDia}
              options={diaOptions.slice(0, 4)}
              onChange={(v) => setSlab({ ...slab, distBarDia: v })}
            />
            <NumberField
              label="বাইন্ডার রডের দূরত্ব"
              unit="ইঞ্চি c/c"
              value={slab.distSpacingIn}
              min={3}
              onChange={(v) => setSlab({ ...slab, distSpacingIn: v })}
            />
            <NumberField
              label="ক্র্যাঙ্ক ও এক্সট্রা টপ ভাতা"
              unit="%"
              value={slab.extraTopPct}
              min={0}
              max={50}
              onChange={(v) => setSlab({ ...slab, extraTopPct: v })}
              hint="সাধারণত ১৫% থেকে ২৫% ধরা হয়"
            />
            <SegmentedToggle
              label="অ্যাগ্রিগেট"
              value={slab.aggregateType}
              options={[
                { value: 'khoa', label: 'ইটের খোয়া' },
                { value: 'stone', label: 'পাথর (Stone)' },
              ]}
              onChange={(v) => setSlab({ ...slab, aggregateType: v })}
            />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200">
            <CheckboxField
              label="ছাদ ঢালাই ও রড বাইন্ডিং মিস্ত্রি খরচ যুক্ত করুন"
              checked={slab.includeLabor}
              onChange={(c) => setSlab({ ...slab, includeLabor: c })}
            />
          </div>
        </div>
        <div className="lg:col-span-5">
          <ResultPanel
            moduleId="slab"
            moduleLabel="ছাদ"
            defaultItemName={`ছাদ ঢালাই (${slab.lengthFt * slab.widthFt} SFT)`}
            dimensionsText={dimsText}
            result={result}
            onAddToBoq={(name, dims, res) => onAddToBoq('slab', 'ছাদ', name, dims, res)}
          />
        </div>
      </div>
    );
  }

  // QUICK ROD WEIGHT CALCULATOR
  const rodResult = calculateRodQuick(rodEntries, rates);
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-900">রডের ডায়া ও দৈর্ঘ্য অনুযায়ী ওজন</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              সাধারণত ১ পিস পূর্ণ রডের দৈর্ঘ্য ৩৯.৫ ফুট (১২ মিটার) হয়।
            </p>
          </div>
          <button
            type="button"
            onClick={() =>
              setRodEntries([...rodEntries, { dia: 12, lengthFt: 39.5, pieces: 10 }])
            }
            className="h-9 px-3 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-xs font-medium text-slate-800 inline-flex items-center gap-1.5 whitespace-nowrap shrink-0"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>লাইন যোগ করুন</span>
          </button>
        </div>

        <div className="space-y-3">
          {rodEntries.map((entry, idx) => {
            const lineKg = entry.lengthFt * entry.pieces * getRebarKgPerFoot(entry.dia);
            return (
              <div
                key={idx}
                className="grid grid-cols-12 gap-2.5 items-end bg-slate-50 border border-slate-200/80 rounded-lg p-3"
              >
                <div className="col-span-4 sm:col-span-3">
                  <SelectField
                    label="সাইজ (mm)"
                    value={entry.dia}
                    options={diaOptions}
                    onChange={(v) => {
                      const next = [...rodEntries];
                      next[idx] = { ...entry, dia: v };
                      setRodEntries(next);
                    }}
                  />
                </div>
                <div className="col-span-4 sm:col-span-3">
                  <NumberField
                    label="দৈর্ঘ্য (ফুট)"
                    step={0.5}
                    value={entry.lengthFt}
                    onChange={(v) => {
                      const next = [...rodEntries];
                      next[idx] = { ...entry, lengthFt: v };
                      setRodEntries(next);
                    }}
                  />
                </div>
                <div className="col-span-4 sm:col-span-3">
                  <NumberField
                    label="পিস / সংখ্যা"
                    value={entry.pieces}
                    onChange={(v) => {
                      const next = [...rodEntries];
                      next[idx] = { ...entry, pieces: v };
                      setRodEntries(next);
                    }}
                  />
                </div>
                <div className="col-span-12 sm:col-span-3 flex items-center justify-between sm:justify-end gap-2 pt-1 sm:pb-2">
                  <span className="text-xs font-mono-num font-semibold text-slate-800">
                    {formatNum(lineKg, 1)} কেজি
                  </span>
                  {rodEntries.length > 1 && (
                    <button
                      type="button"
                      onClick={() => setRodEntries(rodEntries.filter((_, i) => i !== idx))}
                      aria-label="লাইন মুছুন"
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded-md hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Standard Rebar Reference Table */}
        <div className="mt-6 pt-5 border-t border-slate-200">
          <h3 className="text-xs font-semibold text-slate-600 mb-2.5">
            প্রতি ফুট ও পূর্ণ রডের (৩৯.৫ ফুট) স্ট্যান্ডার্ড ওজন তালিকা
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {REBAR_DIAMETERS.map((d) => {
              const perFt = getRebarKgPerFoot(d);
              return (
                <div key={d} className="border border-slate-200 rounded-lg px-2.5 py-2 bg-slate-50/70">
                  <div className="font-semibold text-slate-900 font-mono-num">{d} mm</div>
                  <div className="text-slate-600 font-mono-num mt-0.5">{formatNum(perFt, 3)} কেজি/ফুট</div>
                  <div className="text-slate-500 font-mono-num">{formatNum(perFt * 39.5, 2)} কেজি/পিস</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="lg:col-span-5">
        <ResultPanel
          moduleId="rod"
          moduleLabel="রড"
          defaultItemName="রডের হিসাব"
          dimensionsText={`${rodEntries.length}টি আইটেম`}
          result={rodResult}
          onAddToBoq={(name, dims, res) => onAddToBoq('rod', 'রড', name, dims, res)}
        />
      </div>
    </div>
  );
};
