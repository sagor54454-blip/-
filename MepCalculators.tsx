import React, { useState } from 'react';
import { CalculationResult, CalculatorModuleId, UnitRates } from '../../types/calculator';
import {
  ElectricalInput,
  PlumbingInput,
  calculateElectrical,
  calculatePlumbing,
} from '../../utils/calculations';
import { CheckboxField, NumberField, SegmentedToggle } from '../FormControls';
import { ResultPanel } from '../ResultPanel';

interface MepProps {
  activeModule: 'plumbing' | 'electrical';
  rates: UnitRates;
  onAddToBoq: (
    moduleId: CalculatorModuleId,
    moduleLabel: string,
    itemName: string,
    dimensionsText: string,
    result: CalculationResult
  ) => void;
}

export const MepCalculators: React.FC<MepProps> = ({ activeModule, rates, onAddToBoq }) => {
  const [plumbing, setPlumbing] = useState<PlumbingInput>({
    bathrooms: 3,
    kitchens: 1,
    floors: 1,
    qualityTier: 'standard',
    includePumpAndTank: true,
    tankCapacityLitre: 1500,
    includeLabor: true,
  });

  const [electrical, setElectrical] = useState<ElectricalInput>({
    areaSft: 1400,
    rooms: 4,
    acPoints: 2,
    geyserPoints: 2,
    wiringType: 'concealed',
    qualityTier: 'standard',
    includeLightsAndFans: true,
    includeLabor: true,
  });

  if (activeModule === 'plumbing') {
    const result = calculatePlumbing(plumbing, rates);
    const dimsText = `${plumbing.bathrooms} বাথ · ${plumbing.kitchens} কিচেন · ${plumbing.floors} তলা`;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
          <div>
            <h2 className="text-base font-semibold text-slate-900">প্লাম্বিং ও স্যানিটারি কাজের তথ্য</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              বাথরুম, কিচেন ও তলার সংখ্যা অনুযায়ী পাইপলাইন, স্যানিটারি ফিক্সচার ও পানির ট্যাংকের বাজেট হিসাব।
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <NumberField
              label="বাথরুম / টয়লেট"
              unit="টি"
              value={plumbing.bathrooms}
              min={0}
              onChange={(v) => setPlumbing({ ...plumbing, bathrooms: v })}
            />
            <NumberField
              label="কিচেন / রান্নাঘর"
              unit="টি"
              value={plumbing.kitchens}
              min={0}
              onChange={(v) => setPlumbing({ ...plumbing, kitchens: v })}
            />
            <NumberField
              label="ভবনের তলা"
              unit="তলা"
              value={plumbing.floors}
              min={1}
              onChange={(v) => setPlumbing({ ...plumbing, floors: v })}
            />
          </div>

          <SegmentedToggle
            label="মালামালের মান (Quality Tier)"
            value={plumbing.qualityTier}
            options={[
              { value: 'economy', label: 'ইকোনমি (সাধারণ)' },
              { value: 'standard', label: 'স্ট্যান্ডার্ড (ভালো মান)' },
              { value: 'premium', label: 'প্রিমিয়াম (ব্র্যান্ডেড)' },
            ]}
            onChange={(v) => setPlumbing({ ...plumbing, qualityTier: v })}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
            <CheckboxField
              label="ওভারহেড পানির ট্যাংক ও মোটর পাম্প যুক্ত করুন"
              description="ট্যাংক এবং বৈদ্যুতিক পানির পাম্পসহ"
              checked={plumbing.includePumpAndTank}
              onChange={(c) => setPlumbing({ ...plumbing, includePumpAndTank: c })}
            />
            {plumbing.includePumpAndTank && (
              <NumberField
                label="ট্যাংকের ধারণক্ষমতা"
                unit="লিটার"
                step={500}
                value={plumbing.tankCapacityLitre}
                min={500}
                onChange={(v) => setPlumbing({ ...plumbing, tankCapacityLitre: v })}
              />
            )}
          </div>

          <div className="pt-3 border-t border-slate-200">
            <CheckboxField
              label="প্লাম্বিং মিস্ত্রি খরচ যুক্ত করুন"
              checked={plumbing.includeLabor}
              onChange={(c) => setPlumbing({ ...plumbing, includeLabor: c })}
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultPanel
            moduleId="plumbing"
            moduleLabel="প্লাম্বিং"
            defaultItemName={`প্লাম্বিং (${plumbing.bathrooms} বাথ · ${plumbing.kitchens} কিচেন)`}
            dimensionsText={dimsText}
            result={result}
            onAddToBoq={(name, dims, res) => onAddToBoq('plumbing', 'প্লাম্বিং', name, dims, res)}
          />
        </div>
      </div>
    );
  }

  // ELECTRICAL CALCULATOR
  const elecResult = calculateElectrical(electrical, rates);
  const elecDimsText = `${electrical.areaSft} SFT · ${electrical.rooms} রুম · ${electrical.acPoints} AC`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">ইলেকট্রিক্যাল ওয়্যারিং ও ফিক্সচার তথ্য</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ফ্লোর এরিয়া ও পয়েন্ট সংখ্যা অনুযায়ী তার (কয়েল), পাইপ, সুইচ-সকেট, ব্রেকার এবং মিস্ত্রি খরচের এস্টিমেট।
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <NumberField
            label="মোট ফ্লোর এরিয়া"
            unit="SFT"
            step={50}
            value={electrical.areaSft}
            min={100}
            onChange={(v) => setElectrical({ ...electrical, areaSft: v })}
          />
          <NumberField
            label="মোট রুম / ইউনিট সংখ্যা"
            unit="টি"
            value={electrical.rooms}
            min={1}
            onChange={(v) => setElectrical({ ...electrical, rooms: v })}
            hint="বেড, ড্রয়িং, ডাইনিং ও কিচেন মিলিয়ে"
          />
          <NumberField
            label="এসি (AC) পয়েন্ট সংখ্যা"
            unit="টি"
            value={electrical.acPoints}
            min={0}
            onChange={(v) => setElectrical({ ...electrical, acPoints: v })}
          />
          <NumberField
            label="গিজার / হেভি লোড পয়েন্ট"
            unit="টি"
            value={electrical.geyserPoints}
            min={0}
            onChange={(v) => setElectrical({ ...electrical, geyserPoints: v })}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <SegmentedToggle
            label="ওয়্যারিং পদ্ধতি"
            value={electrical.wiringType}
            options={[
              { value: 'concealed', label: 'কনসিল্ড (দেয়ালের ভেতর)' },
              { value: 'surface', label: 'সারফেস / চ্যানেল' },
            ]}
            onChange={(v) => setElectrical({ ...electrical, wiringType: v })}
          />
          <SegmentedToggle
            label="তার ও সুইচের মান"
            value={electrical.qualityTier}
            options={[
              { value: 'economy', label: 'ইকোনমি' },
              { value: 'standard', label: 'স্ট্যান্ডার্ড' },
              { value: 'premium', label: 'প্রিমিয়াম' },
            ]}
            onChange={(v) => setElectrical({ ...electrical, qualityTier: v })}
          />
        </div>

        <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
          <CheckboxField
            label="লাইট ও সিলিং ফ্যান ফিক্সচার বরাদ্দ রাখুন"
            description="প্রতি রুমে লাইট ও ফ্যান কেনার গড় বাজেট"
            checked={electrical.includeLightsAndFans}
            onChange={(c) => setElectrical({ ...electrical, includeLightsAndFans: c })}
          />
          <CheckboxField
            label="ইলেকট্রিশিয়ান মিস্ত্রি খরচ যুক্ত করুন"
            checked={electrical.includeLabor}
            onChange={(c) => setElectrical({ ...electrical, includeLabor: c })}
          />
        </div>
      </div>

      <div className="lg:col-span-5">
        <ResultPanel
          moduleId="electrical"
          moduleLabel="ইলেকট্রিক"
          defaultItemName={`ইলেকট্রিক (${electrical.areaSft} SFT)`}
          dimensionsText={elecDimsText}
          result={elecResult}
          onAddToBoq={(name, dims, res) => onAddToBoq('electrical', 'ইলেকট্রিক', name, dims, res)}
        />
      </div>
    </div>
  );
};
