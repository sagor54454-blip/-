import React, { useState } from 'react';
import { MORTAR_RATIOS } from '../../data/rates';
import {
  CalculationResult,
  CalculatorModuleId,
  MortarRatioKey,
  UnitRates,
} from '../../types/calculator';
import {
  BrickworkInput,
  PaintingInput,
  PlasterInput,
  TILE_SIZES,
  TileSizeKey,
  TilesInput,
  calculateBrickwork,
  calculatePainting,
  calculatePlaster,
  calculateTiles,
} from '../../utils/calculations';
import { BlueprintDiagram } from '../BlueprintDiagram';
import { CheckboxField, NumberField, SegmentedToggle, SelectField } from '../FormControls';
import { ResultPanel } from '../ResultPanel';

interface FinishingProps {
  activeModule: 'brickwork' | 'plaster' | 'painting' | 'tiles';
  rates: UnitRates;
  onAddToBoq: (
    moduleId: CalculatorModuleId,
    moduleLabel: string,
    itemName: string,
    dimensionsText: string,
    result: CalculationResult
  ) => void;
}

const mortarOptions: { value: MortarRatioKey; label: string }[] = [
  { value: '1:4', label: MORTAR_RATIOS['1:4'].label },
  { value: '1:5', label: MORTAR_RATIOS['1:5'].label },
  { value: '1:6', label: MORTAR_RATIOS['1:6'].label },
];

export const FinishingCalculators: React.FC<FinishingProps> = ({
  activeModule,
  rates,
  onAddToBoq,
}) => {
  // Brickwork
  const [brick, setBrick] = useState<BrickworkInput>({
    wallType: '5inch',
    lengthFt: 80,
    heightFt: 10,
    deductionSft: 85,
    ratio: '1:5',
    includeLabor: true,
    wastagePct: 5,
  });

  // Plaster
  const [plasterMode, setPlasterMode] = useState<'area' | 'dims'>('dims');
  const [plasterDims, setPlasterDims] = useState({ lengthFt: 120, heightFt: 10 });
  const [plaster, setPlaster] = useState<PlasterInput>({
    surfaceType: 'inside',
    areaSft: 1200,
    deductionSft: 100,
    thicknessIn: 0.5,
    ratio: '1:5',
    includeLabor: true,
  });

  // Painting
  const [paintMode, setPaintMode] = useState<'area' | 'dims'>('area');
  const [paintDims, setPaintDims] = useState({ lengthFt: 120, heightFt: 10 });
  const [painting, setPainting] = useState<PaintingInput>({
    areaSft: 1500,
    paintType: 'plastic',
    coats: 2,
    includePrimer: true,
    includePutty: true,
    includeLabor: true,
  });

  // Tiles
  const [tilesMode, setTilesMode] = useState<'dims' | 'area'>('dims');
  const [tilesDims, setTilesDims] = useState({ lengthFt: 40, widthFt: 30 });
  const [tiles, setTiles] = useState<TilesInput>({
    areaSft: 1200,
    tileSize: '24x24',
    application: 'floor',
    wastagePct: 7,
    customTileRateSft: undefined,
    includeLabor: true,
  });

  if (activeModule === 'brickwork') {
    const result = calculateBrickwork(brick, rates);
    const dimsText = `${brick.wallType === '5inch' ? '৫"' : '১০"'} দেয়াল · ${brick.lengthFt}' × ${brick.heightFt}'`;
    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
          <BlueprintDiagram
            moduleId="brickwork"
            dims={{
              l: brick.lengthFt,
              h: brick.heightFt,
              t: brick.wallType === '5inch' ? '৫ ইঞ্চি' : '১০ ইঞ্চি',
            }}
          />
          <div className="mb-4">
            <SegmentedToggle
              label="দেয়ালের পুরুত্ব"
              value={brick.wallType}
              options={[
                { value: '5inch', label: '৫ ইঞ্চি গাঁথুনি (পার্টিশন)' },
                { value: '10inch', label: '১০ ইঞ্চি গাঁথুনি (মেইন/বাইরের)' },
              ]}
              onChange={(v) => setBrick({ ...brick, wallType: v })}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberField
              label="দেয়ালের মোট দৈর্ঘ্য"
              unit="ফুট"
              step={0.5}
              value={brick.lengthFt}
              onChange={(v) => setBrick({ ...brick, lengthFt: v })}
            />
            <NumberField
              label="দেয়ালের উচ্চতা"
              unit="ফুট"
              step={0.5}
              value={brick.heightFt}
              onChange={(v) => setBrick({ ...brick, heightFt: v })}
            />
            <NumberField
              label="দরজা-জানালা বাদ (Deduction)"
              unit="SFT"
              value={brick.deductionSft}
              onChange={(v) => setBrick({ ...brick, deductionSft: v })}
              hint="দরজা/জানালার ক্ষেত্রফল বাদ দিতে চাইলে লিখুন"
            />
            <SelectField
              label="মসলার অনুপাত (সিমেন্ট : বালি)"
              value={brick.ratio}
              options={mortarOptions}
              onChange={(v) => setBrick({ ...brick, ratio: v })}
            />
            <NumberField
              label="ইট ওয়েস্টেজ / ভাঙা ভাতা"
              unit="%"
              value={brick.wastagePct}
              max={15}
              onChange={(v) => setBrick({ ...brick, wastagePct: v })}
            />
          </div>
          <div className="mt-4 pt-3 border-t border-slate-200">
            <CheckboxField
              label="গাঁথুনি মিস্ত্রি খরচ যুক্ত করুন"
              checked={brick.includeLabor}
              onChange={(c) => setBrick({ ...brick, includeLabor: c })}
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultPanel
            moduleId="brickwork"
            moduleLabel="ইটের গাঁথুনি"
            defaultItemName={`${brick.wallType === '5inch' ? '৫"' : '১০"'} ইটের গাঁথুনি`}
            dimensionsText={dimsText}
            result={result}
            onAddToBoq={(name, dims, res) =>
              onAddToBoq('brickwork', 'ইটের গাঁথুনি', name, dims, res)
            }
          />
        </div>
      </div>
    );
  }

  if (activeModule === 'plaster') {
    const effectiveArea =
      plasterMode === 'dims' ? plasterDims.lengthFt * plasterDims.heightFt : plaster.areaSft;
    const effectivePlaster: PlasterInput = { ...plaster, areaSft: effectiveArea };
    const result = calculatePlaster(effectivePlaster, rates);
    const dimsText = `${Math.max(0, effectiveArea - plaster.deductionSft)} SFT · পুরুত্ব ${plaster.thicknessIn}"`;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
          <SegmentedToggle
            label="প্লাস্টারের স্থান"
            value={plaster.surfaceType}
            options={[
              { value: 'inside', label: 'ভেতরের দেয়াল (০.৫")' },
              { value: 'outside', label: 'বাইরের দেয়াল (০.৭৫")' },
              { value: 'ceiling', label: 'সিলিং (০.৫")' },
            ]}
            onChange={(v) =>
              setPlaster({
                ...plaster,
                surfaceType: v,
                thicknessIn: v === 'outside' ? 0.75 : 0.5,
                ratio: v === 'ceiling' ? '1:4' : v === 'outside' ? '1:6' : '1:5',
              })
            }
          />

          <SegmentedToggle
            label="মাপ দেওয়ার পদ্ধতি"
            value={plasterMode}
            options={[
              { value: 'dims', label: 'দৈর্ঘ্য × উচ্চতা দিয়ে' },
              { value: 'area', label: 'সরাসরি মোট SFT দিয়ে' },
            ]}
            onChange={setPlasterMode}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {plasterMode === 'dims' ? (
              <>
                <NumberField
                  label="দৈর্ঘ্য"
                  unit="ফুট"
                  value={plasterDims.lengthFt}
                  onChange={(v) => setPlasterDims({ ...plasterDims, lengthFt: v })}
                />
                <NumberField
                  label="উচ্চতা / প্রস্থ"
                  unit="ফুট"
                  value={plasterDims.heightFt}
                  onChange={(v) => setPlasterDims({ ...plasterDims, heightFt: v })}
                />
              </>
            ) : (
              <NumberField
                label="মোট প্লাস্টার ক্ষেত্রফল"
                unit="SFT"
                value={plaster.areaSft}
                onChange={(v) => setPlaster({ ...plaster, areaSft: v })}
              />
            )}

            <NumberField
              label="দরজা-জানালা বাদ (Deduction)"
              unit="SFT"
              value={plaster.deductionSft}
              onChange={(v) => setPlaster({ ...plaster, deductionSft: v })}
            />
            <NumberField
              label="প্লাস্টারের পুরুত্ব"
              unit="ইঞ্চি"
              step={0.125}
              value={plaster.thicknessIn}
              onChange={(v) => setPlaster({ ...plaster, thicknessIn: v })}
            />
            <SelectField
              label="মসলার অনুপাত (সিমেন্ট : বালি)"
              value={plaster.ratio}
              options={mortarOptions}
              onChange={(v) => setPlaster({ ...plaster, ratio: v })}
            />
          </div>

          <div className="pt-3 border-t border-slate-200">
            <CheckboxField
              label="প্লাস্টার মিস্ত্রি খরচ যুক্ত করুন"
              checked={plaster.includeLabor}
              onChange={(c) => setPlaster({ ...plaster, includeLabor: c })}
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultPanel
            moduleId="plaster"
            moduleLabel="প্লাস্টার"
            defaultItemName="দেয়াল ও সিলিং প্লাস্টার"
            dimensionsText={dimsText}
            result={result}
            onAddToBoq={(name, dims, res) => onAddToBoq('plaster', 'প্লাস্টার', name, dims, res)}
          />
        </div>
      </div>
    );
  }

  if (activeModule === 'painting') {
    const effectiveArea =
      paintMode === 'dims' ? paintDims.lengthFt * paintDims.heightFt : painting.areaSft;
    const result = calculatePainting({ ...painting, areaSft: effectiveArea }, rates);
    const dimsText = `${effectiveArea} SFT · ${painting.coats} কোট`;

    return (
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
          <SegmentedToggle
            label="মাপ দেওয়ার পদ্ধতি"
            value={paintMode}
            options={[
              { value: 'area', label: 'মোট SFT হিসেবে' },
              { value: 'dims', label: 'দৈর্ঘ্য × উচ্চতা হিসেবে' },
            ]}
            onChange={setPaintMode}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paintMode === 'area' ? (
              <NumberField
                label="রং করার মোট ক্ষেত্রফল"
                unit="SFT"
                value={painting.areaSft}
                onChange={(v) => setPainting({ ...painting, areaSft: v })}
              />
            ) : (
              <>
                <NumberField
                  label="দৈর্ঘ্য"
                  unit="ফুট"
                  value={paintDims.lengthFt}
                  onChange={(v) => setPaintDims({ ...paintDims, lengthFt: v })}
                />
                <NumberField
                  label="উচ্চতা"
                  unit="ফুট"
                  value={paintDims.heightFt}
                  onChange={(v) => setPaintDims({ ...paintDims, heightFt: v })}
                />
              </>
            )}

            <SelectField
              label="রঙের ধরন"
              value={painting.paintType}
              options={[
                { value: 'plastic', label: 'প্লাস্টিক পেইন্ট (ভেতরের দেয়াল)' },
                { value: 'weathercoat', label: 'ওয়েদারকোট (বাইরের দেয়াল)' },
                { value: 'distemper', label: 'ডিসটেম্পার (ইকোনমি)' },
                { value: 'enamel', label: 'এনামেল পেইন্ট (দরজা/গ্রিল)' },
              ]}
              onChange={(v) => setPainting({ ...painting, paintType: v })}
            />

            <SegmentedToggle
              label="রঙের কোট সংখ্যা"
              value={String(painting.coats)}
              options={[
                { value: '2', label: '২ কোট (স্ট্যান্ডার্ড)' },
                { value: '3', label: '৩ কোট (গাঢ়/ফ্রেশ)' },
              ]}
              onChange={(v) => setPainting({ ...painting, coats: v === '3' ? 3 : 2 })}
            />
          </div>

          <div className="pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-x-6">
            <CheckboxField
              label="প্রাইমার / ওয়াল সিলার যুক্ত করুন"
              description="দেয়ালের স্থায়িত্ব ও কম রং খরচের জন্য"
              checked={painting.includePrimer}
              onChange={(c) => setPainting({ ...painting, includePrimer: c })}
            />
            <CheckboxField
              label="ওয়াল পুট্টি (২ কোট) যুক্ত করুন"
              description="দেয়াল মসৃণ করার জন্য"
              checked={painting.includePutty}
              onChange={(c) => setPainting({ ...painting, includePutty: c })}
            />
            <CheckboxField
              label="রং মিস্ত্রি খরচ যুক্ত করুন"
              checked={painting.includeLabor}
              onChange={(c) => setPainting({ ...painting, includeLabor: c })}
            />
          </div>
        </div>

        <div className="lg:col-span-5">
          <ResultPanel
            moduleId="painting"
            moduleLabel="রং"
            defaultItemName="রং ও পুট্টি"
            dimensionsText={dimsText}
            result={result}
            onAddToBoq={(name, dims, res) => onAddToBoq('painting', 'রং', name, dims, res)}
          />
        </div>
      </div>
    );
  }

  // TILES CALCULATOR
  const effectiveTileArea =
    tilesMode === 'dims' ? tilesDims.lengthFt * tilesDims.widthFt : tiles.areaSft;
  const tilesResult = calculateTiles({ ...tiles, areaSft: effectiveTileArea }, rates);
  const tileDimsText = `${effectiveTileArea} SFT · সাইজ ${tiles.tileSize}`;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      <div className="lg:col-span-7 bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-4">
        <SegmentedToggle
          label="টাইলস লাগানোর স্থান"
          value={tiles.application}
          options={[
            { value: 'floor', label: 'ফ্লোর টাইলস (১.৫" মসলা বেড)' },
            { value: 'wall', label: 'বাথরুম/কিচেন ওয়াল (০.৭৫" বেড)' },
          ]}
          onChange={(v) =>
            setTiles({
              ...tiles,
              application: v,
              tileSize: v === 'wall' ? '12x24' : '24x24',
            })
          }
        />

        <SegmentedToggle
          label="মাপ দেওয়ার পদ্ধতি"
          value={tilesMode}
          options={[
            { value: 'dims', label: 'দৈর্ঘ্য × প্রস্থ দিয়ে' },
            { value: 'area', label: 'মোট SFT দিয়ে' },
          ]}
          onChange={setTilesMode}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {tilesMode === 'dims' ? (
            <>
              <NumberField
                label="দৈর্ঘ্য"
                unit="ফুট"
                step={0.5}
                value={tilesDims.lengthFt}
                onChange={(v) => setTilesDims({ ...tilesDims, lengthFt: v })}
              />
              <NumberField
                label="প্রস্থ / উচ্চতা"
                unit="ফুট"
                step={0.5}
                value={tilesDims.widthFt}
                onChange={(v) => setTilesDims({ ...tilesDims, widthFt: v })}
              />
            </>
          ) : (
            <NumberField
              label="মোট ক্ষেত্রফল"
              unit="SFT"
              value={tiles.areaSft}
              onChange={(v) => setTiles({ ...tiles, areaSft: v })}
            />
          )}

          <SelectField
            label="টাইলসের সাইজ"
            value={tiles.tileSize}
            options={(Object.keys(TILE_SIZES) as TileSizeKey[]).map((k) => ({
              value: k,
              label: TILE_SIZES[k].label,
            }))}
            onChange={(v) => setTiles({ ...tiles, tileSize: v })}
          />

          <NumberField
            label="কাটিং ওয়েস্টেজ ভাতা"
            unit="%"
            value={tiles.wastagePct}
            max={20}
            onChange={(v) => setTiles({ ...tiles, wastagePct: v })}
            hint="সাধারণত ৫% থেকে ১০% ধরা হয়"
          />

          <NumberField
            label="প্রতি SFT টাইলসের দাম (ঐচ্ছিক)"
            unit="টাকা / SFT"
            value={tiles.customTileRateSft ?? rates.tilesSft}
            onChange={(v) => setTiles({ ...tiles, customTileRateSft: v })}
          />
        </div>

        <div className="pt-3 border-t border-slate-200">
          <CheckboxField
            label="টাইলস ফিটিং মিস্ত্রি খরচ যুক্ত করুন"
            checked={tiles.includeLabor}
            onChange={(c) => setTiles({ ...tiles, includeLabor: c })}
          />
        </div>
      </div>

      <div className="lg:col-span-5">
        <ResultPanel
          moduleId="tiles"
          moduleLabel="টাইলস"
          defaultItemName={`টাইলস (${tiles.application === 'floor' ? 'ফ্লোর' : 'ওয়াল'})`}
          dimensionsText={tileDimsText}
          result={tilesResult}
          onAddToBoq={(name, dims, res) => onAddToBoq('tiles', 'টাইলস', name, dims, res)}
        />
      </div>
    </div>
  );
};
