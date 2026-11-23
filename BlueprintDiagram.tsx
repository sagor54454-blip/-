import React from 'react';
import { CalculatorModuleId } from '../types/calculator';

interface BlueprintDiagramProps {
  moduleId: CalculatorModuleId;
  dims: Record<string, string | number>;
}

export const BlueprintDiagram: React.FC<BlueprintDiagramProps> = ({ moduleId, dims }) => {
  const strokeMain = '#1d4ed8';
  const strokeMuted = '#64748b';
  const fillLight = '#eff6ff';

  const renderGraphic = () => {
    switch (moduleId) {
      case 'footing':
        return (
          <svg viewBox="0 0 320 135" className="w-full h-32" aria-label="ফুটিং ক্রস-সেকশন">
            {/* Soling + CC Base */}
            <rect x="45" y="102" width="230" height="10" fill="#e2e8f0" stroke={strokeMuted} strokeWidth="1" />
            <rect x="52" y="92" width="216" height="10" fill="#cbd5e1" stroke={strokeMuted} strokeWidth="1" />
            {/* Footing Pad */}
            <rect x="60" y="58" width="200" height="34" fill={fillLight} stroke={strokeMain} strokeWidth="1.5" />
            {/* Rebar Mesh inside Footing */}
            <path d="M 68 68 L 68 85 L 252 85 L 252 68" fill="none" stroke="#b91c1c" strokeWidth="1.75" />
            {/* Column Stub */}
            <rect x="142" y="18" width="36" height="40" fill="#f8fafc" stroke={strokeMain} strokeWidth="1.5" />
            <line x1="150" y1="20" x2="150" y2="85" stroke="#b91c1c" strokeWidth="1.5" />
            <line x1="170" y1="20" x2="170" y2="85" stroke="#b91c1c" strokeWidth="1.5" />
            {/* Dimension Lines */}
            <line x1="60" y1="124" x2="260" y2="124" stroke={strokeMuted} strokeWidth="1" />
            <text x="160" y="132" textAnchor="middle" className="fill-slate-700 text-[10px] font-mono">
              {dims.l}' × {dims.w}' (পুরুত্ব {dims.t}")
            </text>
          </svg>
        );
      case 'piling':
        return (
          <svg viewBox="0 0 320 135" className="w-full h-32" aria-label="পাইলিং সেকশন">
            {/* Pile Shaft */}
            <rect x="130" y="18" width="60" height="102" fill={fillLight} stroke={strokeMain} strokeWidth="1.5" />
            {/* Vertical Main Bars */}
            <line x1="140" y1="10" x2="140" y2="116" stroke="#b91c1c" strokeWidth="1.5" />
            <line x1="160" y1="10" x2="160" y2="116" stroke="#b91c1c" strokeWidth="1.5" />
            <line x1="180" y1="10" x2="180" y2="116" stroke="#b91c1c" strokeWidth="1.5" />
            {/* Spiral Rings */}
            {[28, 42, 56, 70, 84, 98, 112].map((y) => (
              <line key={y} x1="138" y1={y} x2="182" y2={y + 4} stroke="#0f172a" strokeWidth="1.2" />
            ))}
            {/* Dimension Labels */}
            <text x="210" y="65" className="fill-slate-700 text-[10px] font-mono">
              দৈর্ঘ্য: {dims.l}'
            </text>
            <text x="210" y="80" className="fill-slate-700 text-[10px] font-mono">
              ব্যাস: {dims.d}"
            </text>
            <text x="40" y="68" className="fill-slate-700 text-[10px] font-mono">
              রিং @ {dims.s}" c/c
            </text>
          </svg>
        );
      case 'column':
        return (
          <svg viewBox="0 0 320 135" className="w-full h-32" aria-label="কলাম ক্রস-সেকশন ও এলিভেশন">
            {/* Cross section on left */}
            <rect x="55" y="28" width="76" height="76" fill={fillLight} stroke={strokeMain} strokeWidth="1.5" />
            <rect x="65" y="38" width="56" height="56" fill="none" stroke="#0f172a" strokeWidth="1.2" />
            {[
              [65, 38],
              [93, 38],
              [121, 38],
              [65, 94],
              [93, 94],
              [121, 94],
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r="3" fill="#b91c1c" />
            ))}
            <text x="93" y="122" textAnchor="middle" className="fill-slate-700 text-[10px] font-mono">
              {dims.w}" × {dims.d}"
            </text>
            {/* Elevation on right */}
            <rect x="200" y="18" width="38" height="96" fill={fillLight} stroke={strokeMain} strokeWidth="1.5" />
            <line x1="208" y1="10" x2="208" y2="112" stroke="#b91c1c" strokeWidth="1.5" />
            <line x1="230" y1="10" x2="230" y2="112" stroke="#b91c1c" strokeWidth="1.5" />
            {[28, 44, 60, 76, 92, 106].map((y) => (
              <line key={y} x1="206" y1={y} x2="232" y2={y} stroke="#0f172a" strokeWidth="1.2" />
            ))}
            <text x="252" y="68" className="fill-slate-700 text-[10px] font-mono">
              H = {dims.h}'
            </text>
          </svg>
        );
      case 'beam':
        return (
          <svg viewBox="0 0 320 135" className="w-full h-32" aria-label="বীম সেকশন">
            {/* Longitudinal Beam */}
            <rect x="35" y="38" width="170" height="54" fill={fillLight} stroke={strokeMain} strokeWidth="1.5" />
            <line x1="40" y1="47" x2="200" y2="47" stroke="#b91c1c" strokeWidth="1.8" />
            <line x1="40" y1="83" x2="200" y2="83" stroke="#b91c1c" strokeWidth="1.8" />
            {[55, 75, 95, 115, 135, 155, 175].map((x) => (
              <line key={x} x1={x} y1="45" x2={x} y2="85" stroke="#0f172a" strokeWidth="1.2" />
            ))}
            <text x="120" y="110" textAnchor="middle" className="fill-slate-700 text-[10px] font-mono">
              দৈর্ঘ্য: {dims.l}'
            </text>
            {/* Cross section */}
            <rect x="235" y="34" width="48" height="64" fill={fillLight} stroke={strokeMain} strokeWidth="1.5" />
            <rect x="242" y="41" width="34" height="50" fill="none" stroke="#0f172a" strokeWidth="1.2" />
            <circle cx="244" cy="43" r="2.5" fill="#b91c1c" />
            <circle cx="274" cy="43" r="2.5" fill="#b91c1c" />
            <circle cx="244" cy="89" r="2.5" fill="#b91c1c" />
            <circle cx="274" cy="89" r="2.5" fill="#b91c1c" />
            <text x="259" y="115" textAnchor="middle" className="fill-slate-700 text-[10px] font-mono">
              {dims.w}"×{dims.d}"
            </text>
          </svg>
        );
      case 'slab':
        return (
          <svg viewBox="0 0 320 135" className="w-full h-32" aria-label="ছাদের সেকশন">
            <polygon points="45,45 215,25 280,55 110,75" fill={fillLight} stroke={strokeMain} strokeWidth="1.5" />
            <polygon points="45,45 110,75 110,95 45,65" fill="#dbeafe" stroke={strokeMain} strokeWidth="1.5" />
            <polygon points="110,75 280,55 280,75 110,95" fill="#bfdbfe" stroke={strokeMain} strokeWidth="1.5" />
            {/* Grid rebar lines */}
            <line x1="80" y1="41" x2="145" y2="71" stroke="#b91c1c" strokeWidth="1" strokeDasharray="3,2" />
            <line x1="125" y1="36" x2="190" y2="66" stroke="#b91c1c" strokeWidth="1" strokeDasharray="3,2" />
            <line x1="170" y1="31" x2="235" y2="61" stroke="#b91c1c" strokeWidth="1" strokeDasharray="3,2" />
            <text x="162" y="118" textAnchor="middle" className="fill-slate-700 text-[10px] font-mono">
              {dims.l}' × {dims.w}' · পুরুত্ব {dims.t}"
            </text>
          </svg>
        );
      case 'brickwork':
        return (
          <svg viewBox="0 0 320 135" className="w-full h-32" aria-label="ইটের গাঁথুনি">
            <rect x="65" y="22" width="190" height="82" fill="#fff7ed" stroke="#c2410c" strokeWidth="1.5" />
            {[36, 50, 64, 78, 92].map((y, row) => (
              <g key={y}>
                <line x1="65" y1={y} x2="255" y2={y} stroke="#ea580c" strokeWidth="1" />
                {[90, 130, 170, 210].map((x) => (
                  <line
                    key={x}
                    x1={x + (row % 2 === 0 ? 0 : 18)}
                    y1={y - 14}
                    x2={x + (row % 2 === 0 ? 0 : 18)}
                    y2={y}
                    stroke="#ea580c"
                    strokeWidth="1"
                  />
                ))}
              </g>
            ))}
            <text x="160" y="122" textAnchor="middle" className="fill-slate-700 text-[10px] font-mono">
              দৈর্ঘ্য {dims.l}' × উচ্চতা {dims.h}' ({dims.t})
            </text>
          </svg>
        );
      default:
        return null;
    }
  };

  const graphic = renderGraphic();
  if (!graphic) return null;

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-5">
      <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
        <span>ডাইমেনশন ডায়াগ্রাম</span>
        <span className="font-mono-num">Scale: Schematic</span>
      </div>
      {graphic}
    </div>
  );
};
