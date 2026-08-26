import React, { useState } from 'react';
import { LogisticsPlan, PickupPoint } from '../types';
import { 
  Truck, 
  MapPin, 
  Clock, 
  DollarSign, 
  Leaf, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ShieldCheck, 
  Building2, 
  AlertCircle, 
  RotateCcw,
  Navigation,
  Sparkles,
  ThermometerSnowflake,
  PackageCheck
} from 'lucide-react';

interface LogisticsViewProps {
  logisticsPlan: LogisticsPlan | null;
  onUpdateStatus?: (newStatus: LogisticsPlan['trackingStatus']) => void;
  onViewQualityRecord: () => void;
}

export const LogisticsView: React.FC<LogisticsViewProps> = ({
  logisticsPlan,
  onUpdateStatus,
  onViewQualityRecord,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState(1);
  const [selectedVehicle, setSelectedVehicle] = useState<string>(
    logisticsPlan?.vehicleType || 'Eicher 14ft (4T)'
  );

  if (!logisticsPlan) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto">
          <Truck className="w-8 h-8" />
        </div>
        <div className="max-w-md mx-auto space-y-2">
          <h3 className="text-lg font-bold text-slate-900">No Active Shipment Route Generated</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Run an AI Bulk Match from the Marketplace to automatically generate an optimized farm-to-hub aggregation route and freight schedule.
          </p>
        </div>
      </div>
    );
  }

  const steps = [
    { key: 'order_confirmed', title: 'Order Confirmed & Route Scheduled', desc: '4 Farm pickup waypoints assigned to local tempo milk-run' },
    { key: 'pickup_in_progress', title: 'Milk-Run Farm Pickups Active', desc: 'Collecting produce directly from farmer farm gates & FPO collection centers' },
    { key: 'consolidating_at_hub', title: 'Consolidation at Cold Hub', desc: `${logisticsPlan.aggregationHub.name} (Bay 3) - Pre-cooling & Weighment` },
    { key: 'quality_inspected', title: 'Digital QC & Seal Approval', desc: 'Grade A verified, moisture 89%, defect rate 0.8% with tamper-proof seal' },
    { key: 'dispatched_to_buyer', title: 'In-Transit to Buyer APMC', desc: 'Direct refrigerated dispatch via Mumbai-Nashik Expressway' },
    { key: 'delivered', title: 'Delivered & Accepted at Destination', desc: `${logisticsPlan.buyerDestination.name}, ${logisticsPlan.buyerDestination.city}` }
  ];

  const handleNextStep = () => {
    const nextIdx = Math.min(steps.length - 1, activeStepIndex + 1);
    setActiveStepIndex(nextIdx);
    if (onUpdateStatus) {
      onUpdateStatus(steps[nextIdx].key as LogisticsPlan['trackingStatus']);
    }
  };

  const handleResetStep = () => {
    setActiveStepIndex(0);
    if (onUpdateStatus) {
      onUpdateStatus(steps[0].key as LogisticsPlan['trackingStatus']);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              Live Logistics Plan: #{logisticsPlan.orderId}
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Crop: <strong className="text-slate-900">{logisticsPlan.cropName} ({logisticsPlan.totalQuantityKg.toLocaleString('en-IN')} kg)</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Farms ➔ Aggregation Center ➔ Buyer Destination Routing
          </h2>
          <p className="text-xs text-slate-500">
            Algorithmic milk-run pickup combining multiple smallholders into a single climate-controlled linehaul trip.
          </p>
        </div>

        {/* Action button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onViewQualityRecord}
            className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>View Digital Quality Record</span>
          </button>
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Total Consolidated Distance</span>
            <Navigation className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {logisticsPlan.totalDistanceKm} <span className="text-xs font-normal text-slate-500">km</span>
          </div>
          <p className="text-[11px] text-slate-500">Includes milk-run + linehaul leg</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Estimated Total Transit Time</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {logisticsPlan.estimatedTransitHours} <span className="text-xs font-normal text-slate-500">hrs</span>
          </div>
          <p className="text-[11px] text-slate-500">Arrival {logisticsPlan.buyerDestination.requestedDeliveryDate}</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Aggregated Freight Cost</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            ₹{logisticsPlan.freightCostInr.toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">Only ₹{(logisticsPlan.freightCostInr / logisticsPlan.totalQuantityKg).toFixed(2)}/kg freight overhead</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 text-xs font-semibold">
            <span>Carbon & Wastage Saved</span>
            <Leaf className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-600 font-mono">
            {logisticsPlan.carbonEmissionsSavedKg} <span className="text-xs font-normal text-slate-500">kg CO₂</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">Saves 4 redundant mandi loading hops</p>
        </div>
      </div>

      {/* Interactive Visual Route Map & Waypoint Sequence */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Visual Route Diagram (SVG & Graph Canvas) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>Multi-Point Transit Route Simulation</span>
            </h3>
            <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              Cold Chain Preserved
            </span>
          </div>

          {/* Graphical Route Canvas Representation */}
          <div className="bg-slate-900 rounded-xl p-5 text-white relative overflow-hidden space-y-4">
            <div className="text-[11px] text-emerald-300 font-mono uppercase tracking-wider flex items-center justify-between">
              <span>Route Graph: Maharashtra Agricultural Corridor</span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                Live GPS Active
              </span>
            </div>

            {/* Visual Node Diagram */}
            <div className="py-4 space-y-4">
              {/* Pickup Waypoints */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  Leg 1: Farm Milk-Run Pickups (Nashik Belt)
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {logisticsPlan.pickupPoints.map((pk, idx) => (
                    <div
                      key={pk.id}
                      className="bg-slate-800/90 border border-slate-700 rounded-lg p-2.5 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="w-4 h-4 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <span className="text-[10px] font-mono text-emerald-300 font-bold">{pk.quantityKg} kg</span>
                      </div>
                      <div className="text-xs font-bold truncate text-white">{pk.farmerName.split(' ')[0]}</div>
                      <div className="text-[10px] text-slate-400 truncate">{pk.location.split(',')[0]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connecting Conduit Indicator */}
              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs py-1">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500"></div>
                <span className="text-[11px] font-mono text-amber-300 font-semibold px-2 bg-slate-800 rounded">
                  Consolidated Milk-Run: ~42 km
                </span>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500"></div>
              </div>

              {/* Central Hub Node */}
              <div className="bg-emerald-950 border-2 border-emerald-500 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                    <Building2 className="w-6 h-6 text-emerald-300" />
                  </div>
                  <div>
                    <div className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider">
                      Regional Aggregation Hub
                    </div>
                    <div className="text-sm font-bold text-white">{logisticsPlan.aggregationHub.name}</div>
                    <div className="text-[11px] text-slate-300">
                      Weighment • Grade-A Digital QC • Pre-Cooling Chamber (4°C)
                    </div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="px-2 py-1 bg-emerald-800 text-emerald-200 rounded text-xs font-bold">
                    Hub Code: {logisticsPlan.aggregationHub.hubCode}
                  </span>
                </div>
              </div>

              {/* Final Linehaul Leg */}
              <div className="flex items-center justify-center gap-2 text-slate-400 text-xs py-1">
                <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
                <span className="text-[11px] font-mono text-blue-300 font-semibold px-2 bg-slate-800 rounded">
                  Express Linehaul: ~142 km (NH-160)
                </span>
                <div className="h-0.5 flex-1 bg-gradient-to-r from-emerald-500 to-blue-500"></div>
              </div>

              {/* Buyer Destination Node */}
              <div className="bg-blue-950 border border-blue-600 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-800 text-white flex items-center justify-center">
                    <PackageCheck className="w-6 h-6 text-blue-200" />
                  </div>
                  <div>
                    <div className="text-[10px] text-blue-300 font-bold uppercase tracking-wider">
                      Buyer Delivery Point
                    </div>
                    <div className="text-sm font-bold text-white">{logisticsPlan.buyerDestination.name}</div>
                    <div className="text-[11px] text-slate-300">{logisticsPlan.buyerDestination.address}</div>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-mono text-blue-300 font-bold">
                    {logisticsPlan.totalQuantityKg.toLocaleString('en-IN')} kg Fulfilled
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Intermediary Layer Comparison (Crucial for SIH Problem Statement 26033) */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-800" />
              <span>Supply Chain Architecture Comparison (Problem Statement 26033)</span>
            </h4>

            <div className="space-y-2 text-xs">
              {/* Traditional */}
              <div className="p-2.5 rounded-lg bg-red-50/80 border border-red-200 text-red-950 space-y-1">
                <div className="font-bold flex items-center justify-between text-red-900">
                  <span>❌ Traditional Indian Supply Chain (5 Intermediary Layers):</span>
                  <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.2 rounded font-bold">14-18% Spoilage</span>
                </div>
                <p className="text-[11px] text-red-800 leading-tight">
                  Farmer ➔ Village Broker (8%) ➔ APMC Mandi Wholesaler (10%) ➔ Secondary Broker (6%) ➔ Regional Distributor (12%) ➔ Retail Buyer.
                </p>
              </div>

              {/* AgriLink */}
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-300 text-emerald-950 space-y-1">
                <div className="font-bold flex items-center justify-between text-emerald-900">
                  <span>✅ AgriLink Direct Aggregation Model (1 Single Consolidated Hub):</span>
                  <span className="text-[10px] bg-emerald-200 text-emerald-950 px-1.5 py-0.2 rounded font-bold">&lt; 1.5% Spoilage</span>
                </div>
                <p className="text-[11px] text-emerald-800 leading-tight">
                  Farmers ➔ AgriLink Regional Cold Aggregation Center (Weighment & QC) ➔ Direct Buyer Delivery.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Live Tracking Milestones & Shipment Simulator */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200 p-6 space-y-6 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-emerald-700" />
              <span>Live Shipment Milestone Tracker</span>
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Step {activeStepIndex + 1} of {steps.length}
            </span>
          </div>

          {/* Stepper Timeline */}
          <div className="space-y-4">
            {steps.map((step, idx) => {
              const isCompleted = idx < activeStepIndex;
              const isCurrent = idx === activeStepIndex;
              return (
                <div key={step.key} className="flex items-start gap-3 relative">
                  {/* Vertical Line */}
                  {idx !== steps.length - 1 && (
                    <div
                      className={`absolute left-3.5 top-7 bottom-0 w-0.5 ${
                        idx < activeStepIndex ? 'bg-emerald-600' : 'bg-slate-200'
                      }`}
                    ></div>
                  )}

                  {/* Node Circle */}
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors z-10 ${
                      isCompleted
                        ? 'bg-emerald-700 text-white shadow-xs'
                        : isCurrent
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-100 font-black animate-pulse'
                        : 'bg-slate-200 text-slate-500'
                    }`}
                  >
                    {isCompleted ? '✓' : idx + 1}
                  </div>

                  <div className="space-y-0.5 pt-0.5">
                    <div
                      className={`text-xs font-bold leading-tight ${
                        isCurrent ? 'text-slate-900 text-sm' : isCompleted ? 'text-emerald-950' : 'text-slate-400'
                      }`}
                    >
                      {step.title}
                    </div>
                    <p className="text-[11px] text-slate-500 leading-tight">{step.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Vehicle Fleet Selector */}
          <div className="space-y-2 pt-2 border-t border-slate-100">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Assigned Fleet Vehicle:</span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { name: 'Tata 407 (2.5T)', cap: '2,500 kg', rate: '₹24/km' },
                { name: 'Eicher 14ft (4T)', cap: '4,000 kg', rate: '₹30/km' },
                { name: 'Reefer Cold Van (5T)', cap: '5,000 kg (Cold)', rate: '₹36/km' },
                { name: 'Heavy Multi-Axle (10T)', cap: '10,000 kg', rate: '₹48/km' },
              ].map((v) => (
                <button
                  key={v.name}
                  onClick={() => setSelectedVehicle(v.name)}
                  className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                    selectedVehicle === v.name
                      ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-600'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold truncate">{v.name}</div>
                  <div className="text-[10px] text-slate-500">{v.cap} • {v.rate}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Simulation Controls */}
          <div className="pt-2 flex items-center justify-between gap-2">
            <button
              onClick={handleResetStep}
              className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>

            <button
              onClick={handleNextStep}
              disabled={activeStepIndex === steps.length - 1}
              className="flex-1 flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-transform active:scale-95 cursor-pointer"
            >
              <span>{activeStepIndex === steps.length - 1 ? 'Shipment Fully Delivered' : 'Simulate Next Milestone'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
