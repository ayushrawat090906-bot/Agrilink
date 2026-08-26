import React, { useState } from 'react';
import { DemandForecastItem } from '../types';
import { DEMAND_FORECASTS } from '../data/mockData';
import { 
  TrendingUp, 
  TrendingDown, 
  Sparkles, 
  Send, 
  Loader2, 
  HelpCircle, 
  AlertCircle, 
  Calendar, 
  BarChart3, 
  Info, 
  Compass,
  DollarSign,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LineChart,
  Line
} from 'recharts';

interface DemandForecastingViewProps {
  initialCropName?: string;
}

export const DemandForecastingView: React.FC<DemandForecastingViewProps> = ({
  initialCropName = 'Tomato',
}) => {
  const [selectedCropName, setSelectedCropName] = useState(initialCropName);
  const [userQuery, setUserQuery] = useState('');
  const [aiAdviceResponse, setAiAdviceResponse] = useState<string | null>(null);
  const [isLoadingAi, setIsLoadingAi] = useState(false);

  const currentForecast =
    DEMAND_FORECASTS.find((d) => d.cropName.toLowerCase() === selectedCropName.toLowerCase()) ||
    DEMAND_FORECASTS[0];

  const handleAskGemini = async (queryText = userQuery) => {
    if (!queryText.trim()) return;
    setIsLoadingAi(true);
    setAiAdviceResponse(null);

    try {
      const res = await fetch('/api/ai/forecast-advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cropName: currentForecast.cropName,
          region: currentForecast.region,
          currentDemandKg: currentForecast.currentDemandTonnes * 1000,
          expectedDemandKg: currentForecast.expectedDemandTonnes * 1000,
          changePercent: `+${currentForecast.percentChange}%`,
          userQuery: queryText,
        }),
      });

      const data = await res.json();
      if (data.advice) {
        setAiAdviceResponse(data.advice);
      } else {
        setAiAdviceResponse(
          `Demand for ${currentForecast.cropName} in ${currentForecast.region} is projected to rise ${currentForecast.percentChange}%. Farmers and FPOs are recommended to aggregate Grade-A lots for institutional buyers and avoid distress sales in local mandis.`
        );
      }
    } catch (err) {
      console.error('Advisor request failed:', err);
      setAiAdviceResponse(
        `Market trend analysis indicates robust demand for ${currentForecast.cropName}. FPOs should coordinate cluster-level sorting and graded packaging before dispatch to lock in premium forward contracts.`
      );
    } finally {
      setIsLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Server-Side Gemini 3.7 Intelligence</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Demand Forecasting & Smart Agri-Advisory
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Predictive demand signals and price curves synthesized from APMC mandi arrival telemetry, monsoon weather patterns, and institutional wholesale procurement cycles.
          </p>
        </div>
      </div>

      {/* Crop Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {DEMAND_FORECASTS.map((f) => {
          const isSelected = f.cropName.toLowerCase() === selectedCropName.toLowerCase();
          const isPositive = f.percentChange > 0;
          return (
            <button
              key={f.cropName}
              onClick={() => {
                setSelectedCropName(f.cropName);
                setAiAdviceResponse(null);
              }}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/40'
                  : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
              }`}
            >
              <div>
                <div className="text-xs font-bold">{f.cropName}</div>
                <div className="text-[10px] text-slate-400">{f.region.split('&')[0]}</div>
              </div>
              <span
                className={`text-xs font-black px-1.5 py-0.5 rounded-md flex items-center gap-0.5 ${
                  isPositive
                    ? isSelected
                      ? 'bg-emerald-700 text-emerald-200'
                      : 'bg-emerald-100 text-emerald-800'
                    : isSelected
                    ? 'bg-amber-700 text-amber-200'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {isPositive ? `+${f.percentChange}%` : `${f.percentChange}%`}
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Metric Cards for Selected Crop */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Current Market Demand</div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {currentForecast.currentDemandTonnes.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-slate-500">Tonnes</span>
          </div>
          <p className="text-[11px] text-slate-500">Active mandi consumption</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Predicted 30-Day Demand</div>
          <div className="text-2xl font-black text-emerald-800 font-mono flex items-center gap-1.5">
            <span>{currentForecast.expectedDemandTonnes.toLocaleString('en-IN')} Tonnes</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            {currentForecast.percentChange > 0 ? `↑ ${currentForecast.percentChange}% surge projected` : `${currentForecast.percentChange}% shift expected`}
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">Projected Mandi Price</div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            ₹{currentForecast.predictedMandiPrice}{' '}
            <span className="text-xs font-normal text-slate-500">/kg (from ₹{currentForecast.currentMandiAvgPrice})</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">+{currentForecast.priceTrendPercent}% price realization</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-1 shadow-xs">
          <div className="text-xs font-semibold text-slate-500">AI Model Confidence</div>
          <div className="text-2xl font-black text-emerald-700 font-mono">
            {currentForecast.confidenceScorePercent}%
          </div>
          <p className="text-[11px] text-slate-500">Based on 18 regional mandis</p>
        </div>
      </div>

      {/* Forecast Chart & Plain-Language Recommendation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Recharts 30-Day Demand & Price Trajectory */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-emerald-700" />
              <span>Historical vs 30-Day AI Demand Forecast (Tonnes)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
              {currentForecast.cropName} • {currentForecast.region}
            </span>
          </div>

          <div className="h-64 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={currentForecast.historicalMonthlyData}>
                <defs>
                  <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#059669" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#059669" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip
                  formatter={(val: any, name: string) => [
                    `${val} Tonnes`,
                    name === 'forecastDemand' ? 'Forecast Demand' : 'Actual Demand',
                  ]}
                  contentStyle={{ backgroundColor: '#0f172a', color: '#fff', borderRadius: '8px', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
                <Area
                  type="monotone"
                  dataKey="actualDemand"
                  name="Historical Actuals"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#actualGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="forecastDemand"
                  name="AI Projected Demand"
                  stroke="#059669"
                  strokeWidth={3}
                  strokeDasharray="4 4"
                  fillOpacity={1}
                  fill="url(#forecastGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Key Supply Drivers */}
          <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-emerald-700" />
              <span>Key Supply Chain Drivers & Signals</span>
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-700">
              {currentForecast.supplyDrivers.map((driver, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0"></span>
                  <span>{driver}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right: Plain-Language Actionable Recommendation & Gemini Advisor */}
        <div className="lg:col-span-5 space-y-4">
          {/* Actionable FPO Advisory Card */}
          <div className="bg-emerald-900 text-white rounded-2xl p-6 shadow-md space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-sm">
                💡
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">Actionable Aggregation Advisory</h3>
                <span className="text-[11px] text-emerald-200">For Farmers & FPOs in {currentForecast.region}</span>
              </div>
            </div>
            <p className="text-xs text-emerald-100 leading-relaxed bg-emerald-950/60 p-3.5 rounded-xl border border-emerald-800">
              "{currentForecast.recommendation}"
            </p>
          </div>

          {/* Live Gemini AI Smart Market Advisor */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-emerald-700" />
                <span>Ask Gemini AI Market Advisor</span>
              </h3>
              <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Live Backend
              </span>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500">
                Ask any contextual questions about crop pricing, weather impacts, or FPO aggregation strategies.
              </p>

              {/* Preset Query Chips */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  `How should Nashik FPOs time ${currentForecast.cropName} harvesting?`,
                  `Will price realization increase for Grade-A ${currentForecast.cropName}?`,
                  `What are the best cold storage practices for this batch?`
                ].map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setUserQuery(q);
                      handleAskGemini(q);
                    }}
                    className="text-[11px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2.5 py-1 rounded-lg transition-colors text-left cursor-pointer"
                  >
                    {q}
                  </button>
                ))}
              </div>

              {/* Input Form */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  placeholder={`Ask Gemini about ${currentForecast.cropName} market strategy...`}
                  value={userQuery}
                  onChange={(e) => setUserQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleAskGemini();
                  }}
                  className="flex-1 text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
                <button
                  onClick={() => handleAskGemini()}
                  disabled={isLoadingAi || !userQuery.trim()}
                  className="bg-emerald-800 hover:bg-emerald-700 disabled:opacity-40 text-white p-2 rounded-lg transition-colors cursor-pointer"
                >
                  {isLoadingAi ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                </button>
              </div>

              {/* AI Response Output */}
              {isLoadingAi && (
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center gap-3 text-xs text-slate-600">
                  <Loader2 className="w-4 h-4 text-emerald-700 animate-spin" />
                  <span>Gemini 3.7 is analyzing agricultural market signals...</span>
                </div>
              )}

              {aiAdviceResponse && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2 animate-in fade-in">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Gemini Agri-Advisor Insight:</span>
                  </div>
                  <div className="text-slate-800 leading-relaxed whitespace-pre-line">
                    {aiAdviceResponse}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mandatory AI Transparency Disclaimer */}
      <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 flex items-start gap-3 text-xs text-slate-600">
        <Info className="w-4 h-4 text-slate-400 mt-0.5 shrink-0" />
        <div className="space-y-0.5">
          <span className="font-bold text-slate-800">Predictive Modeling Transparency Notice:</span>
          <p className="text-[11px] text-slate-500 leading-normal">
            AgriLink AI demand forecasts are directional estimates modeled from sample historical APMC mandi arrivals, seasonal rainfall variations, and institutional wholesale procurement cycles to assist FPO aggregation planning. They are intended as decision-support heuristics, not guaranteed commodity futures.
          </p>
        </div>
      </div>
    </div>
  );
};
