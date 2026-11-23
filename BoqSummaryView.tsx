import React, { useMemo, useState } from 'react';
import { Download, Printer, Trash2, ArrowRight } from 'lucide-react';
import { formatBDT, formatNum } from '../../data/rates';
import { BoqEntry, CalculatorModuleId, RebarDia } from '../../types/calculator';

interface BoqSummaryViewProps {
  entries: BoqEntry[];
  onRemoveEntry: (id: string) => void;
  onClearAll: () => void;
  onNavigate: (moduleId: CalculatorModuleId) => void;
}

export const BoqSummaryView: React.FC<BoqSummaryViewProps> = ({
  entries,
  onRemoveEntry,
  onClearAll,
  onNavigate,
}) => {
  const [projectTitle, setProjectTitle] = useState('আমার বাড়ি নির্মাণ প্রজেক্ট');
  const [confirmClear, setConfirmClear] = useState(false);

  const aggregated = useMemo(() => {
    let totalCementBags = 0;
    let totalSandSylhetCft = 0;
    let totalSandLocalCft = 0;
    let totalKhoaCft = 0;
    let totalStoneCft = 0;
    let totalBricksPcs = 0;
    let totalRodKg = 0;
    let totalPaintLitres = 0;
    let totalPrimerLitres = 0;
    let totalPuttyKg = 0;
    let totalTilesSft = 0;
    let totalTilesBoxes = 0;
    let totalMaterialCost = 0;
    let totalLaborCost = 0;
    let grandTotal = 0;

    const rodByDia: Partial<Record<RebarDia, number>> = {};

    entries.forEach((entry) => {
      const m = entry.result.materials;
      totalCementBags += m.cementBags || 0;
      totalSandSylhetCft += m.sandSylhetCft || 0;
      totalSandLocalCft += m.sandLocalCft || 0;
      totalKhoaCft += m.khoaCft || 0;
      totalStoneCft += m.stoneCft || 0;
      totalBricksPcs += m.bricksPcs || 0;
      totalRodKg += m.rodKg || 0;
      totalPaintLitres += m.paintLitres || 0;
      totalPrimerLitres += m.primerLitres || 0;
      totalPuttyKg += m.puttyKg || 0;
      totalTilesSft += m.tilesSft || 0;
      totalTilesBoxes += m.tilesBoxes || 0;

      if (m.rodByDia) {
        (Object.entries(m.rodByDia) as [string, number][]).forEach(([diaStr, kg]) => {
          const dia = Number(diaStr) as RebarDia;
          rodByDia[dia] = (rodByDia[dia] || 0) + (kg || 0);
        });
      }

      totalMaterialCost += entry.result.materialCost;
      totalLaborCost += entry.result.laborCost;
      grandTotal += entry.result.totalCost;
    });

    return {
      totalCementBags,
      totalSandSylhetCft,
      totalSandLocalCft,
      totalKhoaCft,
      totalStoneCft,
      totalBricksPcs,
      totalRodKg,
      rodByDia,
      totalPaintLitres,
      totalPrimerLitres,
      totalPuttyKg,
      totalTilesSft,
      totalTilesBoxes,
      totalMaterialCost,
      totalLaborCost,
      grandTotal,
    };
  }, [entries]);

  const handleExportCsv = () => {
    const headers = ['ক্রমিক', 'কাজের ধরন', 'বিবরণ', 'মাপ', 'মালামাল খরচ (BDT)', 'মিস্ত্রি খরচ (BDT)', 'মোট খরচ (BDT)'];
    const rows = entries.map((e, i) => [
      i + 1,
      e.moduleLabel,
      `"${e.itemName.replace(/"/g, '""')}"`,
      `"${e.dimensionsText.replace(/"/g, '""')}"`,
      Math.round(e.result.materialCost),
      Math.round(e.result.laborCost),
      Math.round(e.result.totalCost),
    ]);

    const summaryRows = [
      [],
      ['মোট সিমেন্ট (ব্যাগ)', formatNum(aggregated.totalCementBags, 1)],
      ['মোট রড (কেজি)', formatNum(aggregated.totalRodKg, 1)],
      ['সিলেট বালি (CFT)', formatNum(aggregated.totalSandSylhetCft, 1)],
      ['চিকন বালি (CFT)', formatNum(aggregated.totalSandLocalCft, 1)],
      ['ইটের খোয়া (CFT)', formatNum(aggregated.totalKhoaCft, 1)],
      ['পাথর (CFT)', formatNum(aggregated.totalStoneCft, 1)],
      ['ইট (পিস)', Math.round(aggregated.totalBricksPcs)],
      ['সর্বমোট প্রজেক্ট খরচ (BDT)', Math.round(aggregated.grandTotal)],
    ];

    const csvContent =
      '\uFEFF' +
      [headers.join(','), ...rows.map((r) => r.join(',')), ...summaryRows.map((r) => r.join(','))].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `nirman-estimate-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (entries.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 sm:p-12 text-center max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-slate-900">আপনার প্রজেক্টের BOQ তালিকা এখনো খালি</h2>
        <p className="text-sm text-slate-600 mt-2 max-w-md mx-auto leading-relaxed">
          ফুটিং, পাইলিং, কলাম, বীম, ছাদ, ইটের গাঁথুনি, প্লাস্টার, রং, টাইলস, প্লাম্বিং অথবা ইলেকট্রিক ক্যালকুলেটরে হিসাব করে{' '}
          <strong className="text-slate-800">“BOQ-তে যোগ করুন”</strong> বাটনে ক্লিক করলে সব হিসাব এখানে একত্রিত হবে।
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => onNavigate('footing')}
            className="h-10 px-4 bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium rounded-lg inline-flex items-center gap-2 transition-colors"
          >
            <span>ফুটিং দিয়ে শুরু করুন</span>
            <ArrowRight className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onNavigate('slab')}
            className="h-10 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-medium rounded-lg transition-colors"
          >
            ছাদের হিসাব করুন
          </button>
        </div>
      </div>
    );
  }

  const rodByDiaEntries = (Object.entries(aggregated.rodByDia) as [string, number][]).sort(
    (a, b) => Number(a[0]) - Number(b[0])
  );

  return (
    <div className="space-y-6 print-full">
      {/* Header / Actions */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <label className="block text-xs text-slate-500 mb-1 no-print">প্রজেক্টের নাম (প্রিন্টে দেখাবে)</label>
          <input
            type="text"
            value={projectTitle}
            onChange={(e) => setProjectTitle(e.target.value)}
            className="w-full max-w-md text-xl font-bold text-slate-900 bg-transparent border-b border-transparent hover:border-slate-300 focus:border-blue-700 focus:outline-none pb-0.5"
          />
          <p className="text-xs text-slate-500 mt-1">
            মোট আইটেম: <span className="font-mono-num">{entries.length}টি</span> · তারিখ:{' '}
            {new Date().toLocaleDateString('bn-BD')}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 no-print shrink-0">
          <button
            type="button"
            onClick={handleExportCsv}
            className="h-9 px-3.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-medium rounded-lg inline-flex items-center gap-2 whitespace-nowrap transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>CSV ডাউনলোড</span>
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="h-9 px-4 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-lg inline-flex items-center gap-2 whitespace-nowrap transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>প্রিন্ট / PDF সেভ</span>
          </button>
        </div>
      </div>

      {/* Grand Total & Cost Split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">সর্বমোট প্রজেক্ট বাজেট</p>
          <p className="text-3xl font-bold font-mono-num text-slate-900 mt-1">
            {formatBDT(aggregated.grandTotal)}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">মোট মালামাল খরচ</p>
          <p className="text-2xl font-bold font-mono-num text-slate-900 mt-1">
            {formatBDT(aggregated.totalMaterialCost)}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-5">
          <p className="text-xs font-medium text-slate-500">মোট মিস্ত্রি / লেবার খরচ</p>
          <p className="text-2xl font-bold font-mono-num text-slate-900 mt-1">
            {formatBDT(aggregated.totalLaborCost)}
          </p>
        </div>
      </div>

      {/* Aggregated Material Summary */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
        <h3 className="text-base font-semibold text-slate-900 mb-4">সমন্বিত মোট মালামালের তালিকা</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {aggregated.totalCementBags > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <span className="text-xs text-slate-500">মোট সিমেন্ট</span>
              <div className="text-lg font-bold font-mono-num text-slate-900 mt-0.5">
                {formatNum(aggregated.totalCementBags, 1)} ব্যাগ
              </div>
            </div>
          )}
          {aggregated.totalRodKg > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <span className="text-xs text-slate-500">মোট রড</span>
              <div className="text-lg font-bold font-mono-num text-slate-900 mt-0.5">
                {formatNum(aggregated.totalRodKg, 1)} কেজি
              </div>
              <div className="text-[11px] font-mono-num text-slate-500">
                ({formatNum(aggregated.totalRodKg / 1000, 3)} টন)
              </div>
            </div>
          )}
          {aggregated.totalSandSylhetCft > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <span className="text-xs text-slate-500">সিলেট বালি (মোটা)</span>
              <div className="text-lg font-bold font-mono-num text-slate-900 mt-0.5">
                {formatNum(aggregated.totalSandSylhetCft, 1)} CFT
              </div>
            </div>
          )}
          {aggregated.totalSandLocalCft > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <span className="text-xs text-slate-500">চিকন বালি (লোকাল)</span>
              <div className="text-lg font-bold font-mono-num text-slate-900 mt-0.5">
                {formatNum(aggregated.totalSandLocalCft, 1)} CFT
              </div>
            </div>
          )}
          {aggregated.totalKhoaCft > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <span className="text-xs text-slate-500">ইটের খোয়া</span>
              <div className="text-lg font-bold font-mono-num text-slate-900 mt-0.5">
                {formatNum(aggregated.totalKhoaCft, 1)} CFT
              </div>
            </div>
          )}
          {aggregated.totalStoneCft > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <span className="text-xs text-slate-500">পাথর (Stone Chips)</span>
              <div className="text-lg font-bold font-mono-num text-slate-900 mt-0.5">
                {formatNum(aggregated.totalStoneCft, 1)} CFT
              </div>
            </div>
          )}
          {aggregated.totalBricksPcs > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <span className="text-xs text-slate-500">মোট ইট</span>
              <div className="text-lg font-bold font-mono-num text-slate-900 mt-0.5">
                {formatNum(aggregated.totalBricksPcs, 0)} পিস
              </div>
            </div>
          )}
          {aggregated.totalTilesSft > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <span className="text-xs text-slate-500">মোট টাইলস</span>
              <div className="text-lg font-bold font-mono-num text-slate-900 mt-0.5">
                {formatNum(aggregated.totalTilesSft, 0)} SFT ({aggregated.totalTilesBoxes} বক্স)
              </div>
            </div>
          )}
          {aggregated.totalPaintLitres > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-lg p-3">
              <span className="text-xs text-slate-500">রং · প্রাইমার · পুট্টি</span>
              <div className="text-sm font-bold font-mono-num text-slate-900 mt-0.5">
                {formatNum(aggregated.totalPaintLitres, 1)}L · {formatNum(aggregated.totalPrimerLitres, 1)}L · {formatNum(aggregated.totalPuttyKg, 0)}kg
              </div>
            </div>
          )}
        </div>

        {rodByDiaEntries.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <span className="font-medium text-slate-700">রডের সাইজ অনুযায়ী বিভাজন:</span>
            {rodByDiaEntries.map(([dia, kg]) => (
              <span key={dia} className="font-mono-num text-slate-800">
                {dia} mm: <strong>{formatNum(kg, 1)} কেজি</strong>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Itemized Project Entries Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="p-5 border-b border-slate-200 flex items-center justify-between gap-4">
          <h3 className="text-base font-semibold text-slate-900">ধাপ অনুযায়ী কাজের তালিকা</h3>
          <div className="no-print">
            {confirmClear ? (
              <div className="flex items-center gap-2 text-xs">
                <span className="text-red-700 font-medium">সব মুছে ফেলবেন?</span>
                <button
                  type="button"
                  onClick={() => {
                    onClearAll();
                    setConfirmClear(false);
                  }}
                  className="px-2.5 py-1 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                >
                  হ্যাঁ, মুছুন
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmClear(false)}
                  className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded hover:bg-slate-200"
                >
                  বাতিল
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                className="text-xs text-slate-500 hover:text-red-600 font-medium"
              >
                সব তালিকা খালি করুন
              </button>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs">
              <tr>
                <th className="text-left font-semibold py-3 px-4">#</th>
                <th className="text-left font-semibold py-3 px-4">অংশ / বিবরণ</th>
                <th className="text-left font-semibold py-3 px-4">মাপ ও পরিমাণ</th>
                <th className="text-right font-semibold py-3 px-4">মালামাল</th>
                <th className="text-right font-semibold py-3 px-4">মিস্ত্রি</th>
                <th className="text-right font-semibold py-3 px-4">মোট খরচ</th>
                <th className="py-3 px-3 no-print"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {entries.map((entry, idx) => (
                <tr key={entry.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono-num text-slate-500">{idx + 1}</td>
                  <td className="py-3 px-4">
                    <div className="font-medium text-slate-900">{entry.itemName}</div>
                    <div className="text-xs text-slate-500">{entry.moduleLabel}</div>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-600 font-mono-num">
                    {entry.dimensionsText}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-slate-700 whitespace-nowrap">
                    {formatBDT(entry.result.materialCost)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num text-slate-700 whitespace-nowrap">
                    {formatBDT(entry.result.laborCost)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono-num font-semibold text-slate-900 whitespace-nowrap">
                    {formatBDT(entry.result.totalCost)}
                  </td>
                  <td className="py-3 px-3 text-right no-print">
                    <button
                      type="button"
                      onClick={() => onRemoveEntry(entry.id)}
                      aria-label="আইটেম মুছুন"
                      className="p-1.5 text-slate-400 hover:text-red-600 rounded hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
