import React, { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Wheat, 
  Store, 
  Truck, 
  TrendingUp, 
  ShieldCheck, 
  X, 
  Play,
  RotateCcw
} from 'lucide-react';
import { UserRole } from '../types';

interface SihDemoTourModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJumpToView: (viewId: string, role?: UserRole) => void;
}

export const SihDemoTourModal: React.FC<SihDemoTourModalProps> = ({
  isOpen,
  onClose,
  onJumpToView,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  if (!isOpen) return null;

  const steps = [
    {
      step: 1,
      title: 'Farmer / FPO Lists Fragmented Produce',
      persona: '👨‍🌾 Farmer: Ramesh Patil (Dindori, Nashik)',
      viewId: 'farmer_portal',
      role: 'farmer' as UserRole,
      icon: Wheat,
      color: 'emerald',
      narrative: 'Small farmers produce high quality crops (e.g., 500 kg of Grade-A Tomato @ ₹28/kg) but lack the volume to sell directly to large institutional buyers, leaving them vulnerable to local mandi distress pricing.',
      keyDemoPoint: 'Farmer Ramesh creates a transparent listing with harvest date, moisture %, and price without middlemen.',
      badgeText: 'Step 1/5: Supply Fragmentation'
    },
    {
      step: 2,
      title: 'Bulk Buyer Submits Large Order Request',
      persona: '🛒 Bulk Buyer: Metro Fresh Retail (Mumbai)',
      viewId: 'marketplace',
      role: 'buyer' as UserRole,
      icon: Store,
      color: 'blue',
      narrative: 'Institutional buyers like supermarket chains, hotels, and food processors require 2,000 kg+ bulk shipments delivered on schedule with strict grade compliance.',
      keyDemoPoint: 'Buyer searches "Tomato", enters 2,000 kg demand, and selects optimization strategy (Balanced / Nearest-First / Price-Optimized).',
      badgeText: 'Step 2/5: Buyer Demand'
    },
    {
      step: 3,
      title: 'AI Bulk Matching Engine Combines Supplies ⭐',
      persona: '⚡ AgriLink Core AI Matching Engine',
      viewId: 'marketplace',
      role: 'buyer' as UserRole,
      icon: Sparkles,
      color: 'amber',
      narrative: 'The core differentiator! AgriLink automatically aggregates fragmented supply across multiple nearby farmers & FPOs into a single 2,000 kg fulfilled order.',
      keyDemoPoint: 'Live mathematical breakdown: 500 kg (Patil Farms) + 600 kg (Sahyadri FPO) + 400 kg (GreenFields) + 500 kg (Godavari FPO) = 2,000 kg ✅ (100% Matched).',
      badgeText: 'Step 3/5: AI Aggregation (Core X-Factor)'
    },
    {
      step: 4,
      title: 'Smart Logistics: Farm ➔ Hub ➔ Buyer Delivery',
      persona: '🚚 AgriLink Agro-Logistics Coordinator',
      viewId: 'logistics',
      role: 'buyer' as UserRole,
      icon: Truck,
      color: 'indigo',
      narrative: 'Eliminates 4 redundant mandi intermediary stops. Generates an optimal consolidated milk-run route from farms to the Pimpalgaon Cold Hub, then directly to Mumbai APMC in a single refrigerated trip.',
      keyDemoPoint: 'Displays distance (184 km), ETA (5.2 hrs), freight cost breakdown (₹6,370), and 125 kg CO₂ reduction.',
      badgeText: 'Step 4/5: Disintermediation'
    },
    {
      step: 5,
      title: 'AI Demand Forecast & Digital Quality Trust Seal',
      persona: '📈 AI Agri-Forecaster & QCI Inspection',
      viewId: 'forecast',
      role: 'farmer' as UserRole,
      icon: TrendingUp,
      color: 'teal',
      narrative: 'Empowers FPOs with predictive intelligence (Tomato demand forecasted ↑28.9% in Western India due to southern rain disruptions) and guarantees dispute-free deliveries via a tamper-proof digital Quality Certificate.',
      keyDemoPoint: 'Live Gemini-powered Smart Market Advisor + Grade A digital QC inspection seal.',
      badgeText: 'Step 5/5: Predictive Intelligence & Trust'
    }
  ];

  const currentStepData = steps[currentStep - 1];
  const StepIcon = currentStepData.icon;

  const handleApplyStep = () => {
    onJumpToView(currentStepData.viewId, currentStepData.role);
    if (currentStep === steps.length) {
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-stone-200 max-w-2xl w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-black text-sm">
              60s
            </div>
            <div>
              <h3 className="font-bold text-base text-white">AgriLink SIH 60-Second Demo Pitch Tour</h3>
              <p className="text-xs text-emerald-200 font-medium">SIH Problem Statement 26033: Agricultural Supply-Chain Optimization</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="bg-stone-50 px-6 py-3 border-b border-stone-200 flex items-center justify-between gap-2">
          {steps.map((s) => (
            <button
              key={s.step}
              onClick={() => setCurrentStep(s.step)}
              className={`flex-1 flex items-center gap-1.5 py-1 px-2 rounded-lg text-left text-xs font-semibold transition-all cursor-pointer ${
                currentStep === s.step
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : currentStep > s.step
                  ? 'bg-emerald-100 text-emerald-900'
                  : 'bg-stone-200/70 text-stone-600 hover:bg-stone-200'
              }`}
            >
              <span className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold">
                {currentStep > s.step ? '✓' : s.step}
              </span>
              <span className="hidden sm:inline truncate">{s.title.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
              {currentStepData.badgeText}
            </span>
            <span className="text-xs font-medium text-stone-500">{currentStepData.persona}</span>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 shadow-xs">
              <StepIcon className="w-6 h-6 text-emerald-700" />
            </div>
            <div className="space-y-1.5">
              <h4 className="text-lg font-bold text-stone-900">{currentStepData.title}</h4>
              <p className="text-sm text-stone-600 leading-relaxed">{currentStepData.narrative}</p>
            </div>
          </div>

          {/* Key Demo Highlight Card */}
          <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-emerald-900">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>Live Demonstration Action:</span>
            </div>
            <p className="text-xs font-semibold text-emerald-950">{currentStepData.keyDemoPoint}</p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="bg-stone-50 px-6 py-4 border-t border-stone-200 flex items-center justify-between">
          <button
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-2 rounded-lg border border-stone-300 text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onJumpToView(currentStepData.viewId, currentStepData.role);
                onClose();
              }}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-2 rounded-lg hover:bg-stone-200 cursor-pointer"
            >
              Open View Directly
            </button>
            <button
              onClick={handleApplyStep}
              className="flex items-center gap-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              <span>{currentStep === steps.length ? 'Finish Tour & Explore' : 'Demonstrate This Step'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
