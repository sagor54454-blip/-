import React, { useState } from 'react';
import { Check, Plus } from 'lucide-react';
import { formatBDT, formatNum } from '../data/rates';
import { CalculationResult, CalculatorModuleId } from '../types/calculator';

interface ResultPanelProps {
  moduleId: CalculatorModuleId;
  moduleLabel: string;
  defaultItemName: string;
  dimensionsText: string;
  result: CalculationResult;
  onAddToBoq: (itemName: string, dimensionsText: string, result: CalculationResult) => void;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  defaultItemName,
  dimensionsText,
  result,
  onAddToBoq,
}) => {
  const [customName, setCustomName] = useState('');
  const [addedFeedback, setAddedFeedback] = useState(false);

  const handleAdd = () => {
    const finalName = customName.trim() || defaultItemName;
    onAddToBoq(finalName, dimensionsText, result);
    setAddedFeedback(true);
    setCustomName('');
    setTimeout(() => setAddedFeedback(false), 1800);
  };

  const { materials } = result;
  const rodByDiaEntries = materials.rodByDia
    ? (Object.entries(materials.rodByDia) as [string, number][]).filter(([, kg]) => kg > 0)
    : [];

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 space-y-5">
      {/* Primary Cost Headline */}
      <div className="pb-4 border-b border-slate-200">
        <div className="flex items-center justify-between gap-2 text-xs text-slate-500 mb-1">
          <span>{result.summaryMetricLabel}</span>
          <span className="font-mono-num text-slate-700 font-medium">{result.summaryMetricValue}</span>
        </div>
        <div className="flex items-baseline justify-between gap-4 mt-2">
          <div>
            <p className="text-xs font-medium text-slate-500">সর্বমোট আনুমানিক খরচ</p>
            <p className="text-3xl font-bold font-mono-num text-slate-900 tracking-tight mt-0.5">
              {formatBDT(result.totalCost)}
            </p>
          </div>
          <div className="text-right text-xs text-slate-600 space-y-0.5">
            <div>
              মালামাল:{' '}
              <span className="font-mono-num font-semibold text-slate-800">
                {formatBDT(result.materialCost)}
              </span>
            </div>
            {result.laborCost > 0 && (
              <div>
                মিস্ত্রি:{' '}
                <span className="font-mono-num font-semibold text-slate-800">
                  {formatBDT(result.laborCost)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Key Material Quantities Grid */}
      {(materials.cementBags ||
        materials.sandSylhetCft ||
        materials.sandLocalCft ||
        materials.khoaCft ||
        materials.stoneCft ||
        materials.bricksPcs ||
        materials.rodKg ||
        materials.paintLitres ||
        materials.tilesPcs) && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 mb-2.5">প্রয়োজনীয় মালামালের পরিমাণ</h3>
          <div className="grid grid-cols-2 gap-2.5">
            {materials.cementBags !== undefined && materials.cementBags > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2.5">
                <span className="block text-xs text-slate-500">সিমেন্ট</span>
                <span className="block text-base font-semibold font-mono-num text-slate-900 mt-0.5">
                  {formatNum(materials.cementBags, 1)} ব্যাগ
                </span>
              </div>
            )}
            {materials.rodKg !== undefined && materials.rodKg > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2.5">
                <span className="block text-xs text-slate-500">মোট রড</span>
                <span className="block text-base font-semibold font-mono-num text-slate-900 mt-0.5">
                  {formatNum(materials.rodKg, 1)} কেজি
                </span>
              </div>
            )}
            {materials.sandSylhetCft !== undefined && materials.sandSylhetCft > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2.5">
                <span className="block text-xs text-slate-500">সিলেট বালি</span>
                <span className="block text-base font-semibold font-mono-num text-slate-900 mt-0.5">
                  {formatNum(materials.sandSylhetCft, 1)} CFT
                </span>
              </div>
            )}
            {materials.sandLocalCft !== undefined && materials.sandLocalCft > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2.5">
                <span className="block text-xs text-slate-500">চিকন বালি</span>
                <span className="block text-base font-semibold font-mono-num text-slate-900 mt-0.5">
                  {formatNum(materials.sandLocalCft, 1)} CFT
                </span>
              </div>
            )}
            {materials.khoaCft !== undefined && materials.khoaCft > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2.5">
                <span className="block text-xs text-slate-500">ইটের খোয়া</span>
                <span className="block text-base font-semibold font-mono-num text-slate-900 mt-0.5">
                  {formatNum(materials.khoaCft, 1)} CFT
                </span>
              </div>
            )}
            {materials.stoneCft !== undefined && materials.stoneCft > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2.5">
                <span className="block text-xs text-slate-500">পাথর (Stone)</span>
                <span className="block text-base font-semibold font-mono-num text-slate-900 mt-0.5">
                  {formatNum(materials.stoneCft, 1)} CFT
                </span>
              </div>
            )}
            {materials.bricksPcs !== undefined && materials.bricksPcs > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2.5">
                <span className="block text-xs text-slate-500">ইট</span>
                <span className="block text-base font-semibold font-mono-num text-slate-900 mt-0.5">
                  {formatNum(materials.bricksPcs, 0)} পিস
                </span>
              </div>
            )}
            {materials.paintLitres !== undefined && materials.paintLitres > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2.5">
                <span className="block text-xs text-slate-500">রং</span>
                <span className="block text-base font-semibold font-mono-num text-slate-900 mt-0.5">
                  {formatNum(materials.paintLitres, 1)} লিটার
                </span>
              </div>
            )}
            {materials.tilesPcs !== undefined && materials.tilesPcs > 0 && (
              <div className="bg-slate-50 border border-slate-200/80 rounded-lg px-3 py-2.5">
                <span className="block text-xs text-slate-500">টাইলস</span>
                <span className="block text-base font-semibold font-mono-num text-slate-900 mt-0.5">
                  {materials.tilesPcs} পিস ({materials.tilesBoxes} বক্স)
                </span>
              </div>
            )}
          </div>

          {rodByDiaEntries.length > 0 && (
            <div className="mt-2.5 pt-2.5 border-t border-slate-100 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-600">
              <span className="font-medium text-slate-700">ডায়া অনুযায়ী রড:</span>
              {rodByDiaEntries.map(([dia, kg]) => (
                <span key={dia} className="font-mono-num">
                  {dia}mm: <strong className="text-slate-900">{formatNum(kg, 1)} কেজি</strong>
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Detailed Cost Table */}
      <div>
        <h3 className="text-xs font-semibold text-slate-500 mb-2">খরচের বিস্তারিত বিবরণ</h3>
        <div className="border border-slate-200 rounded-lg overflow-hidden">
          <table className="w-full text-xs sm:text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="text-left font-medium py-2 px-3">আইটেম</th>
                <th className="text-right font-medium py-2 px-2">পরিমাণ</th>
                <th className="text-right font-medium py-2 px-3">টাকা</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {result.costItems.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/60">
                  <td className="py-2 px-3 text-slate-800">
                    <div>{item.label}</div>
                    <div className="text-[11px] text-slate-400 font-mono-num">দর: {item.unitRateText}</div>
                  </td>
                  <td className="py-2 px-2 text-right font-mono-num text-slate-600 whitespace-nowrap">
                    {item.quantityText}
                  </td>
                  <td className="py-2 px-3 text-right font-mono-num font-medium text-slate-900 whitespace-nowrap">
                    {formatBDT(item.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Formula / Engineering Note */}
      <p className="text-xs text-slate-500 leading-relaxed">{result.formulaNote}</p>

      {/* Add to Project BOQ Section */}
      <div className="pt-4 border-t border-slate-200 space-y-2.5">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            placeholder={`নাম লিখুন (যেমন: ${defaultItemName})`}
            className="flex-1 h-10 px-3 bg-slate-50 border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-blue-700"
          />
          <button
            type="button"
            onClick={handleAdd}
            className={`h-10 px-4 rounded-lg text-sm font-medium inline-flex items-center justify-center gap-2 whitespace-nowrap shrink-0 transition-colors ${
              addedFeedback
                ? 'bg-emerald-700 text-white'
                : 'bg-blue-700 hover:bg-blue-800 text-white'
            }`}
          >
            {addedFeedback ? (
              <>
                <Check className="w-4 h-4" />
                <span>তালিকায় যোগ হয়েছে</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4" />
                <span>BOQ-তে যোগ করুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
