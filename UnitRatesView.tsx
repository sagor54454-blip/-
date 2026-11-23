import React, { useState } from 'react';
import { RotateCcw, Check } from 'lucide-react';
import { RATE_METADATA } from '../../data/rates';
import { UnitRates } from '../../types/calculator';

interface UnitRatesViewProps {
  rates: UnitRates;
  onUpdateRate: (key: keyof UnitRates, value: number) => void;
  onResetDefaults: () => void;
}

export const UnitRatesView: React.FC<UnitRatesViewProps> = ({
  rates,
  onUpdateRate,
  onResetDefaults,
}) => {
  const [savedNotice, setSavedNotice] = useState(false);
  const categories = ['প্রধান উপকরণ', 'ফিনিশিং ও রং', 'মিস্ত্রি ও লেবার রেট'] as const;

  const handleReset = () => {
    onResetDefaults();
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 1800);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">বাজারদর ও মিস্ত্রি রেট সেটিংস</h2>
          <p className="text-sm text-slate-600 mt-1">
            আপনার এলাকার বর্তমান বাজারমূল্য অনুযায়ী দর পরিবর্তন করুন। পরিবর্তনগুলো স্বয়ংক্রিয়ভাবে সব ক্যালকুলেটরে যুক্ত হবে।
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="h-10 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-sm font-medium rounded-lg inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors"
        >
          {savedNotice ? (
            <>
              <Check className="w-4 h-4 text-emerald-700" />
              <span>ডিফল্ট দর সেট হয়েছে</span>
            </>
          ) : (
            <>
              <RotateCcw className="w-4 h-4" />
              <span>ডিফল্ট বাজারদরে ফিরুন</span>
            </>
          )}
        </button>
      </div>

      {categories.map((cat) => {
        const items = RATE_METADATA.filter((m) => m.category === cat);
        return (
          <div key={cat} className="bg-white border border-slate-200 rounded-xl p-5 sm:p-6">
            <h3 className="text-base font-semibold text-slate-900 pb-3 mb-4 border-b border-slate-200">
              {cat}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <label key={item.key} className="block">
                  <div className="flex items-baseline justify-between gap-2 mb-1.5">
                    <span className="text-sm font-medium text-slate-700">{item.label}</span>
                    <span className="text-xs text-slate-500">{item.unit}</span>
                  </div>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400 font-mono-num">
                      ৳
                    </span>
                    <input
                      type="number"
                      min={0}
                      step={0.5}
                      value={rates[item.key]}
                      onChange={(e) => {
                        const val = parseFloat(e.target.value);
                        onUpdateRate(item.key, Number.isNaN(val) ? 0 : val);
                      }}
                      className="w-full h-10 pl-7 pr-3 bg-white border border-slate-300 rounded-lg text-sm font-mono-num text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15"
                    />
                  </div>
                </label>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};
