import React, { useEffect, useState } from 'react';
import {
  BrickWall,
  Calculator,
  ClipboardList,
  Columns3,
  Cylinder,
  Droplets,
  Grid2x2,
  Layers,
  Menu,
  PaintBucket,
  Ruler,
  Settings2,
  SlidersHorizontal,
  Sparkles,
  SquareStack,
  X,
  Zap,
} from 'lucide-react';
import { BoqSummaryView } from './components/calculators/BoqSummaryView';
import { FinishingCalculators } from './components/calculators/FinishingCalculators';
import { MepCalculators } from './components/calculators/MepCalculators';
import { StructuralCalculators } from './components/calculators/StructuralCalculators';
import { UnitRatesView } from './components/calculators/UnitRatesView';
import { DEFAULT_UNIT_RATES, formatBDT } from './data/rates';
import {
  BoqEntry,
  CalculationResult,
  CalculatorModuleId,
  UnitRates,
} from './types/calculator';

interface NavItem {
  id: CalculatorModuleId;
  label: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  group: 'structure' | 'finishing' | 'mep' | 'project';
}

const NAV_ITEMS: NavItem[] = [
  {
    id: 'footing',
    label: 'ফুটিং (Footing)',
    subtitle: 'ফুটিংয়ের কংক্রিট, সলিং, সিসি ও জালির রডের পূর্ণাঙ্গ হিসাব',
    icon: SquareStack,
    group: 'structure',
  },
  {
    id: 'piling',
    label: 'পাইলিং (Piling)',
    subtitle: 'বোরড পাইল কংক্রিট, মেইন রড এবং স্পাইরাল রিংয়ের হিসাব',
    icon: Cylinder,
    group: 'structure',
  },
  {
    id: 'column',
    label: 'কলাম (Column)',
    subtitle: 'কলামের সিমেন্ট, বালি, পাথর/খোয়া এবং খাড়া ও টাই রডের হিসাব',
    icon: Columns3,
    group: 'structure',
  },
  {
    id: 'beam',
    label: 'বীম (Beam)',
    subtitle: 'গ্রেড বীম বা ফ্লোর বীমের কংক্রিট ও টপ-বটম-স্টিরাপ রডের হিসাব',
    icon: SlidersHorizontal,
    group: 'structure',
  },
  {
    id: 'slab',
    label: 'ছাদ (Slab)',
    subtitle: 'ছাদের ক্ষেত্রফল অনুযায়ী সিমেন্ট, বালি, খোয়া ও রডের হিসাব',
    icon: Layers,
    group: 'structure',
  },
  {
    id: 'rod',
    label: 'রডের ওজন ক্যালকুলেটর',
    subtitle: 'যেকোনো ডায়া (8mm–25mm) ও দৈর্ঘ্যের রডের ওজন ও মূল্য',
    icon: Ruler,
    group: 'structure',
  },
  {
    id: 'brickwork',
    label: 'ইটের গাঁথুনি (Brick)',
    subtitle: '৫ ইঞ্চি ও ১০ ইঞ্চি দেয়ালের ইট, সিমেন্ট ও বালির হিসাব',
    icon: BrickWall,
    group: 'finishing',
  },
  {
    id: 'plaster',
    label: 'প্লাস্টার (Plaster)',
    subtitle: 'ভেতরের, বাইরের দেয়াল ও সিলিং প্লাস্টারের সিমেন্ট ও বালি',
    icon: Sparkles,
    group: 'finishing',
  },
  {
    id: 'painting',
    label: 'রং (Painting)',
    subtitle: 'প্লাস্টিক পেইন্ট, ওয়েদারকোট, প্রাইমার ও ওয়াল পুট্টির হিসাব',
    icon: PaintBucket,
    group: 'finishing',
  },
  {
    id: 'tiles',
    label: 'টাইলস (Tiles)',
    subtitle: 'ফ্লোর ও ওয়াল টাইলসের পিস, বক্স, সিমেন্ট, বালি ও গ্রাউটিং',
    icon: Grid2x2,
    group: 'finishing',
  },
  {
    id: 'plumbing',
    label: 'প্লাম্বিং ও স্যানিটারি',
    subtitle: 'পাইপ, ফিটিংস, কমোড, বেসিন, ট্যাংক ও পাম্প খরচের এস্টিমেট',
    icon: Droplets,
    group: 'mep',
  },
  {
    id: 'electrical',
    label: 'ইলেকট্রিক্যাল (Wiring)',
    subtitle: 'তারের কয়েল, কনডুইট পাইপ, সুইচ-সকেট, MCB ও লাইট-ফ্যান বাজেট',
    icon: Zap,
    group: 'mep',
  },
  {
    id: 'boq',
    label: 'মোট BOQ ও এস্টিমেট',
    subtitle: 'যোগ করা সব কাজের সমন্বিত মালামাল, মোট খরচ ও প্রিন্ট রিপোর্ট',
    icon: ClipboardList,
    group: 'project',
  },
  {
    id: 'rates',
    label: 'বাজারদর সেটিংস',
    subtitle: 'সিমেন্ট, রড, ইট, বালি, খোয়া ও মিস্ত্রি রেট পরিবর্তন করুন',
    icon: Settings2,
    group: 'project',
  },
];

const GROUP_LABELS: Record<NavItem['group'], string> = {
  structure: 'আরসিসি কাঠামো ও রড',
  finishing: 'গাঁথুনি ও ফিনিশিং',
  mep: 'প্লাম্বিং ও ইলেকট্রিক',
  project: 'প্রজেক্ট ও বাজারদর',
};

const STORAGE_RATES_KEY = 'nirman_hisab_rates_v1';
const STORAGE_BOQ_KEY = 'nirman_hisab_boq_v1';

export default function App() {
  const [activeModule, setActiveModule] = useState<CalculatorModuleId>('footing');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [rates, setRates] = useState<UnitRates>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_RATES_KEY);
      if (saved) {
        return { ...DEFAULT_UNIT_RATES, ...JSON.parse(saved) };
      }
    } catch {
      // ignore storage errors
    }
    return DEFAULT_UNIT_RATES;
  });

  const [boqEntries, setBoqEntries] = useState<BoqEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_BOQ_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore storage errors
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_RATES_KEY, JSON.stringify(rates));
    } catch {
      // ignore
    }
  }, [rates]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_BOQ_KEY, JSON.stringify(boqEntries));
    } catch {
      // ignore
    }
  }, [boqEntries]);

  const handleAddToBoq = (
    moduleId: CalculatorModuleId,
    moduleLabel: string,
    itemName: string,
    dimensionsText: string,
    result: CalculationResult
  ) => {
    const newEntry: BoqEntry = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      moduleId,
      moduleLabel,
      itemName,
      dimensionsText,
      createdAt: Date.now(),
      result,
    };
    setBoqEntries((prev) => [...prev, newEntry]);
  };

  const handleRemoveBoq = (id: string) => {
    setBoqEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClearBoq = () => {
    setBoqEntries([]);
  };

  const handleUpdateRate = (key: keyof UnitRates, value: number) => {
    setRates((prev) => ({ ...prev, [key]: value }));
  };

  const handleResetRates = () => {
    setRates(DEFAULT_UNIT_RATES);
  };

  const selectModule = (id: CalculatorModuleId) => {
    setActiveModule(id);
    setMobileMenuOpen(false);
  };

  const currentNav = NAV_ITEMS.find((item) => item.id === activeModule) || NAV_ITEMS[0];
  const totalBoqBudget = boqEntries.reduce((sum, e) => sum + e.result.totalCost, 0);

  const renderModuleContent = () => {
    if (
      activeModule === 'footing' ||
      activeModule === 'piling' ||
      activeModule === 'column' ||
      activeModule === 'beam' ||
      activeModule === 'slab' ||
      activeModule === 'rod'
    ) {
      return (
        <StructuralCalculators
          activeModule={activeModule}
          rates={rates}
          onAddToBoq={handleAddToBoq}
        />
      );
    }

    if (
      activeModule === 'brickwork' ||
      activeModule === 'plaster' ||
      activeModule === 'painting' ||
      activeModule === 'tiles'
    ) {
      return (
        <FinishingCalculators
          activeModule={activeModule}
          rates={rates}
          onAddToBoq={handleAddToBoq}
        />
      );
    }

    if (activeModule === 'plumbing' || activeModule === 'electrical') {
      return (
        <MepCalculators
          activeModule={activeModule}
          rates={rates}
          onAddToBoq={handleAddToBoq}
        />
      );
    }

    if (activeModule === 'boq') {
      return (
        <BoqSummaryView
          entries={boqEntries}
          onRemoveEntry={handleRemoveBoq}
          onClearAll={handleClearBoq}
          onNavigate={selectModule}
        />
      );
    }

    return (
      <UnitRatesView
        rates={rates}
        onUpdateRate={handleUpdateRate}
        onResetDefaults={handleResetRates}
      />
    );
  };

  const sidebarContent = (
    <div className="py-4 px-3 space-y-6">
      {(['structure', 'finishing', 'mep', 'project'] as const).map((groupKey) => {
        const items = NAV_ITEMS.filter((i) => i.group === groupKey);
        return (
          <div key={groupKey}>
            <div className="px-3 mb-1.5 text-xs font-semibold text-slate-500">
              {GROUP_LABELS[groupKey]}
            </div>
            <div className="space-y-0.5">
              {items.map((item) => {
                const Icon = item.icon;
                const active = item.id === activeModule;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectModule(item.id)}
                    className={`w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                      active
                        ? 'bg-blue-50 text-blue-800'
                        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 min-w-0">
                      <Icon
                        className={`w-4 h-4 shrink-0 ${
                          active ? 'text-blue-700' : 'text-slate-400'
                        }`}
                      />
                      <span className="truncate">{item.label}</span>
                    </span>
                    {item.id === 'boq' && boqEntries.length > 0 && (
                      <span className="text-xs font-mono-num text-blue-700 font-semibold shrink-0">
                        {boqEntries.length}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* 3-Zone Top Header Bar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 px-4 sm:px-6 h-14 flex items-center justify-between gap-8 no-print">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="মেনু খুলুন"
            className="lg:hidden p-1.5 -ml-1.5 text-slate-700 hover:bg-slate-100 rounded-md"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <button
            type="button"
            onClick={() => selectModule('footing')}
            className="flex items-center gap-2 text-lg font-bold tracking-tight text-slate-900 whitespace-nowrap shrink-0"
          >
            <Calculator className="w-5 h-5 text-blue-700" />
            <span>নির্মাণ হিসাব</span>
          </button>
        </div>

        {/* Zone 2: Concise single-line navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
          <button
            type="button"
            onClick={() => selectModule('footing')}
            className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
          >
            কাঠামো (RCC)
          </button>
          <button
            type="button"
            onClick={() => selectModule('brickwork')}
            className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
          >
            গাঁথুনি ও ফিনিশিং
          </button>
          <button
            type="button"
            onClick={() => selectModule('plumbing')}
            className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
          >
            প্লাম্বিং ও ইলেকট্রিক
          </button>
          <button
            type="button"
            onClick={() => selectModule('rates')}
            className="hover:text-slate-900 hover:underline underline-offset-4 whitespace-nowrap shrink-0 transition-colors"
          >
            বাজারদর
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="shrink-0">
          <button
            type="button"
            onClick={() => selectModule('boq')}
            className="h-9 px-3.5 bg-blue-700 hover:bg-blue-800 text-white text-xs sm:text-sm font-medium rounded-lg inline-flex items-center gap-2 whitespace-nowrap shrink-0 transition-colors"
          >
            <span>মোট BOQ</span>
            <span className="font-mono-num">
              ({boqEntries.length}
              {boqEntries.length > 0 ? ` · ${formatBDT(totalBoqBudget)}` : ''})
            </span>
          </button>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex relative">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 bg-white border-r border-slate-200 no-print">
          <div className="sticky top-14 max-h-[calc(100vh-3.5rem)] overflow-y-auto">
            {sidebarContent}
          </div>
        </aside>

        {/* Mobile Drawer Sidebar */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 lg:hidden flex no-print">
            <div
              className="fixed inset-0 bg-slate-900/40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <aside className="relative w-72 max-w-[85vw] bg-white h-full overflow-y-auto border-r border-slate-200 z-50">
              <div className="h-14 px-4 flex items-center justify-between border-b border-slate-200">
                <span className="font-bold text-slate-900">ক্যালকুলেটর মডিউল</span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-slate-500 hover:text-slate-800 rounded-md"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </aside>
          </div>
        )}

        {/* Main Viewport */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full">
          {/* Quick Module Switcher Strip for Mobile / Tablet */}
          <div className="lg:hidden mb-4 overflow-x-auto pb-1 no-print">
            <div className="inline-flex gap-1.5">
              {NAV_ITEMS.map((item) => {
                const active = item.id === activeModule;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => selectModule(item.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap shrink-0 border transition-colors ${
                      active
                        ? 'bg-blue-700 text-white border-blue-700'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {item.label.split(' ')[0]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Module Title & Context */}
          <div className="mb-6 no-print">
            <div className="text-xs text-slate-500 mb-1">
              <span>{GROUP_LABELS[currentNav.group]}</span>
              <span className="mx-1.5" aria-hidden="true">·</span>
              <span>{currentNav.label}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight text-balance">
              {currentNav.label}
            </h1>
            <p className="text-sm text-slate-600 mt-1">{currentNav.subtitle}</p>
          </div>

          {renderModuleContent()}
        </main>
      </div>
    </div>
  );
}
