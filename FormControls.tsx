import React from 'react';

interface NumberFieldProps {
  label: string;
  unit?: string;
  value: number;
  onChange: (val: number) => void;
  min?: number;
  max?: number;
  step?: number;
  hint?: string;
}

export const NumberField: React.FC<NumberFieldProps> = ({
  label,
  unit,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  hint,
}) => {
  return (
    <label className="block">
      <div className="flex items-baseline justify-between gap-2 mb-1.5">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {unit && <span className="text-xs text-slate-500">{unit}</span>}
      </div>
      <input
        type="number"
        value={Number.isNaN(value) ? '' : value}
        min={min}
        max={max}
        step={step}
        onChange={(e) => {
          const parsed = parseFloat(e.target.value);
          onChange(Number.isNaN(parsed) ? 0 : parsed);
        }}
        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm font-mono-num text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors"
      />
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </label>
  );
};

interface SelectFieldProps<T extends string | number> {
  label: string;
  value: T;
  onChange: (val: T) => void;
  options: { value: T; label: string }[];
}

export function SelectField<T extends string | number>({
  label,
  value,
  onChange,
  options,
}: SelectFieldProps<T>) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>
      <select
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          const match = options.find((o) => String(o.value) === raw);
          if (match) onChange(match.value);
        }}
        className="w-full h-10 px-3 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-blue-700 focus:ring-2 focus:ring-blue-700/15 transition-colors"
      >
        {options.map((opt) => (
          <option key={String(opt.value)} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </label>
  );
}

interface SegmentedToggleProps<T extends string> {
  label: string;
  value: T;
  onChange: (val: T) => void;
  options: { value: T; label: string }[];
}

export function SegmentedToggle<T extends string>({
  label,
  value,
  onChange,
  options,
}: SegmentedToggleProps<T>) {
  return (
    <div>
      <span className="block text-sm font-medium text-slate-700 mb-1.5">{label}</span>
      <div className="inline-flex w-full p-1 bg-slate-100 rounded-lg border border-slate-200">
        {options.map((opt) => {
          const active = opt.value === value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(opt.value)}
              className={`flex-1 py-1.5 px-3 text-xs sm:text-sm font-medium rounded-md whitespace-nowrap transition-colors ${
                active
                  ? 'bg-white text-slate-900 shadow-xs border border-slate-200/80'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

interface CheckboxFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const CheckboxField: React.FC<CheckboxFieldProps> = ({
  label,
  description,
  checked,
  onChange,
}) => {
  return (
    <label className="flex items-start gap-3 py-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-700 focus:ring-blue-700"
      />
      <div className="min-w-0">
        <span className="block text-sm font-medium text-slate-800">{label}</span>
        {description && <span className="block text-xs text-slate-500 mt-0.5">{description}</span>}
      </div>
    </label>
  );
};
