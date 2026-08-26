import React, { useState, useMemo } from 'react';
import { CropListing, MatchingStrategy, BulkMatchingResult, AggregationCenter } from '../types';
import { AGGREGATION_HUBS } from '../data/mockData';
import { runBulkMatchingEngine } from '../utils/matchingEngine';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  Search, 
  Filter, 
  CheckCircle2, 
  AlertTriangle, 
  ArrowRight, 
  Truck, 
  ShieldCheck, 
  Building2, 
  User, 
  Scale, 
  TrendingUp, 
  RefreshCw, 
  Zap, 
  MapPin, 
  DollarSign, 
  Check, 
  Info,
  Calendar,
  Layers
} from 'lucide-react';

interface BuyerMarketplaceProps {
  listings: CropListing[];
  onConfirmOrder: (matchResult: BulkMatchingResult, hub: AggregationCenter) => void;
  onSelectCropForForecast: (cropName: string) => void;
}

export const BuyerMarketplace: React.FC<BuyerMarketplaceProps> = ({
  listings,
  onConfirmOrder,
  onSelectCropForForecast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCrop, setSelectedCrop] = useState('Tomato');
  const [requestedKg, setRequestedKg] = useState(2000);
  const [strategy, setStrategy] = useState<MatchingStrategy>('balanced');
  const [selectedHubId, setSelectedHubId] = useState('hub_nashik');
  const [isMatchingLoading, setIsMatchingLoading] = useState(false);
  const [lastMatchResult, setLastMatchResult] = useState<BulkMatchingResult | null>(null);

  const selectedHub = AGGREGATION_HUBS.find((h) => h.id === selectedHubId) || AGGREGATION_HUBS[0];

  // Distinct crop categories available
  const availableCrops = useMemo(() => {
    const map = new Map<string, { totalQty: number; minPrice: number; maxPrice: number; listingsCount: number; photo: string }>();
    listings.forEach((l) => {
      const avail = l.quantityKg - (l.allocatedKg || 0);
      if (avail <= 0) return;
      const existing = map.get(l.cropName) || {
        totalQty: 0,
        minPrice: l.pricePerKg,
        maxPrice: l.pricePerKg,
        listingsCount: 0,
        photo: l.photoUrl,
      };
      existing.totalQty += avail;
      existing.minPrice = Math.min(existing.minPrice, l.pricePerKg);
      existing.maxPrice = Math.max(existing.maxPrice, l.pricePerKg);
      existing.listingsCount += 1;
      map.set(l.cropName, existing);
    });
    return Array.from(map.entries()).map(([name, data]) => ({ name, ...data }));
  }, [listings]);

  // Execute matching algorithm
  const handleRunMatching = (crop = selectedCrop, qty = requestedKg, strat = strategy) => {
    setIsMatchingLoading(true);
    setTimeout(() => {
      const result = runBulkMatchingEngine(crop, qty, listings, strat, selectedHub);
      setLastMatchResult(result);
      setIsMatchingLoading(false);
    }, 350);
  };

  // Initial match run on component mount or crop change
  React.useEffect(() => {
    handleRunMatching(selectedCrop, requestedKg, strategy);
  }, [selectedCrop, requestedKg, strategy, selectedHubId]);

  const handleConfirmAndProceed = () => {
    if (!lastMatchResult || lastMatchResult.totalMatchedKg === 0) return;
    
    // Celebration confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#059669', '#10b981', '#34d399', '#f59e0b'],
    });

    onConfirmOrder(lastMatchResult, selectedHub);
  };

  const selectedCropStats = availableCrops.find((c) => c.name.toLowerCase() === selectedCrop.toLowerCase());

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Problem-Solving Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-emerald-950 to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="absolute -right-8 -top-8 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>SIH Core Innovation: Combinatorial AI Supply Aggregation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            AI Bulk Matching Engine & Direct B2B Marketplace
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Eliminating 5 layers of intermediate mandi commission agents. AgriLink pools fragmented small-farmer lots in real-time to satisfy multi-ton institutional buyer orders with verified quality and cold-chain routing.
          </p>
        </div>
      </div>

      {/* Crop Selector Chips & Quick Market Snapshot */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-emerald-600" />
            <span>Select Bulk Crop to Procure</span>
          </h2>
          <span className="text-xs text-slate-500">
            {availableCrops.length} agricultural commodities aggregated
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {availableCrops.map((crop) => {
            const isSelected = selectedCrop.toLowerCase() === crop.name.toLowerCase();
            return (
              <button
                key={crop.name}
                onClick={() => setSelectedCrop(crop.name)}
                className={`relative rounded-xl p-3.5 text-left transition-all border cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-900 text-white border-emerald-700 shadow-md ring-2 ring-emerald-600/40 scale-[1.02]'
                    : 'bg-white hover:bg-slate-50 text-slate-800 border-slate-200 shadow-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-sm">{crop.name}</span>
                  {crop.name === 'Tomato' && (
                    <span className="text-[10px] font-bold bg-amber-400 text-slate-900 px-1.5 py-0.2 rounded-full">
                      Demo Focus
                    </span>
                  )}
                </div>
                <div className="text-xs space-y-0.5">
                  <div className={isSelected ? 'text-emerald-200' : 'text-slate-500'}>
                    Available: <strong className={isSelected ? 'text-white' : 'text-slate-900'}>{crop.totalQty.toLocaleString('en-IN')} kg</strong>
                  </div>
                  <div className={isSelected ? 'text-emerald-200' : 'text-slate-500'}>
                    Price: <strong className={isSelected ? 'text-white' : 'text-emerald-700'}>₹{crop.minPrice} - ₹{crop.maxPrice}/kg</strong>
                  </div>
                  <div className={`text-[11px] pt-1 flex items-center justify-between ${isSelected ? 'text-emerald-300' : 'text-slate-400'}`}>
                    <span>{crop.listingsCount} farmer/FPO lots</span>
                    <span className="font-mono text-[10px]">{isSelected ? '● Active' : 'Select'}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Matching Control Console ⭐ (Core Demo Element) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-800 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              ⚡
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                AI Bulk Matching Simulator: <span className="text-emerald-700">{selectedCrop}</span>
              </h3>
              <p className="text-xs text-slate-500">
                Algorithm calculates optimal combination of farmer lots to fulfill bulk requirements
              </p>
            </div>
          </div>

          {/* Aggregation Hub Selector */}
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-600 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-slate-400" />
              <span>Target Hub:</span>
            </label>
            <select
              value={selectedHubId}
              onChange={(e) => setSelectedHubId(e.target.value)}
              className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden cursor-pointer"
            >
              {AGGREGATION_HUBS.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name} ({h.state})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Controls Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Required Quantity Input */}
            <div className="md:col-span-6 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <Scale className="w-4 h-4 text-emerald-700" />
                  <span>Required Bulk Quantity:</span>
                </label>
                <span className="text-lg font-black text-emerald-800 font-mono">
                  {requestedKg.toLocaleString('en-IN')} kg{' '}
                  <span className="text-xs font-normal text-slate-500">({(requestedKg / 1000).toFixed(1)} Tonnes)</span>
                </span>
              </div>

              {/* Slider */}
              <input
                type="range"
                min={200}
                max={5000}
                step={100}
                value={requestedKg}
                onChange={(e) => setRequestedKg(Number(e.target.value))}
                className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-emerald-700"
              />

              {/* Preset Quick Buttons */}
              <div className="flex items-center gap-2 pt-1">
                {[500, 1000, 2000, 3000, 4000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setRequestedKg(val)}
                    className={`px-2.5 py-1 rounded-md text-xs font-bold border transition-colors cursor-pointer ${
                      requestedKg === val
                        ? 'bg-emerald-800 text-white border-emerald-800 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200'
                    }`}
                  >
                    {val === 2000 ? '2,000 kg (SIH Demo ⭐)' : `${val.toLocaleString('en-IN')} kg`}
                  </button>
                ))}
              </div>
            </div>

            {/* Optimization Strategy Tabs */}
            <div className="md:col-span-6 space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>Optimization Strategy:</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {[
                  { id: 'balanced', label: '⚡ Smart AI Blend', desc: 'Price + Distance + Grade' },
                  { id: 'distance', label: '📍 Nearest-First', desc: 'Lowest transit & spoilage' },
                  { id: 'price', label: '💰 Lowest Price', desc: 'Cost-optimized' },
                  { id: 'freshness', label: '🌿 Fresh Harvest', desc: 'Recent harvest date' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStrategy(s.id as MatchingStrategy)}
                    className={`p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      strategy === s.id
                        ? 'bg-emerald-50 border-emerald-600 text-emerald-950 font-bold ring-1 ring-emerald-600'
                        : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="text-xs font-bold leading-tight">{s.label}</div>
                    <div className="text-[10px] text-slate-500 leading-tight mt-0.5">{s.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* AI Matching Result Showcase Box ⭐ */}
          {lastMatchResult && (
            <div className="space-y-4 pt-2 border-t border-slate-100">
              {/* Formula & Status Header */}
              <div
                className={`p-4 rounded-xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  lastMatchResult.isFullyMatched
                    ? 'bg-emerald-50/90 border-emerald-300 text-emerald-950'
                    : 'bg-amber-50 border-amber-300 text-amber-950'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-800 text-white flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-amber-300" />
                      Live AI Match Output
                    </span>
                    <span className="text-xs font-semibold text-slate-600">
                      Strategy: <strong className="capitalize">{lastMatchResult.strategyUsed}</strong>
                    </span>
                  </div>
                  {/* The exact demonstration formula */}
                  <div className="text-sm sm:text-base font-black font-mono tracking-tight text-emerald-950">
                    {lastMatchResult.breakdownFormula}
                  </div>
                </div>

                <div className="text-right sm:text-right shrink-0">
                  <div className="text-xs text-slate-500 font-medium">Fulfillment Status</div>
                  <div className="text-base font-extrabold text-emerald-900 flex items-center gap-1">
                    {lastMatchResult.isFullyMatched ? (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                        <span>100% Demand Fulfilled</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-5 h-5 text-amber-600" />
                        <span>{lastMatchResult.fulfillmentPercent}% Matched ({lastMatchResult.shortfallKg}kg shortfall)</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Matched Farmers & FPOs Breakdown Grid */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
                  <span>Aggregated Supplier Lots ({lastMatchResult.matchedItems.length} Matched Partners)</span>
                  <span>Weighted Avg: ₹{lastMatchResult.weightedAveragePricePerKg}/kg</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {lastMatchResult.matchedItems.map((item, idx) => (
                    <div
                      key={item.listing.id}
                      className="bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-xl p-3.5 space-y-2 transition-all shadow-2xs"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-800 text-white text-[10px] font-bold flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-bold text-xs text-slate-900 truncate max-w-[140px]">
                            {item.listing.farmerName}
                          </span>
                        </div>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 border border-slate-300">
                          {item.listing.farmerType === 'fpo' ? '🏢 FPO' : '👨‍🌾 Farmer'}
                        </span>
                      </div>

                      <div className="bg-white p-2.5 rounded-lg border border-slate-200 space-y-1 text-xs">
                        <div className="flex justify-between font-semibold">
                          <span className="text-slate-500">Allocated Supply:</span>
                          <strong className="text-emerald-800 font-mono text-sm">{item.allocatedKg} kg</strong>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Base Price:</span>
                          <span className="font-medium text-slate-800">₹{item.pricePerKg}/kg</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Distance to Hub:</span>
                          <span className="font-medium text-slate-800">{item.distanceToHubKm} km</span>
                        </div>
                        <div className="flex justify-between pt-1 border-t border-slate-100 text-[11px]">
                          <span className="text-emerald-700 font-medium">Direct Farmer Payout:</span>
                          <strong className="text-emerald-900 font-mono">₹{item.farmerProfitShareInr.toLocaleString('en-IN')}</strong>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 px-1">
                        <span>{item.listing.variety.split(' ')[0]}</span>
                        <span className="text-emerald-700 font-semibold">{item.listing.qualityGrade.split(' ')[0]}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Economic Impact & Financial Transparency Card */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-emerald-950 text-white rounded-xl p-4 sm:p-5 shadow-sm">
                <div className="space-y-1">
                  <div className="text-xs text-emerald-300 font-semibold">Total Direct Wholesale Value</div>
                  <div className="text-2xl font-black font-mono text-white">
                    ₹{lastMatchResult.totalProduceCostInr.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-emerald-200/70">
                    Paid directly to farmers with 0 broker deductions
                  </p>
                </div>

                <div className="space-y-1 border-y md:border-y-0 md:border-x border-emerald-800/80 py-2 md:py-0 md:px-4">
                  <div className="text-xs text-emerald-300 font-semibold">Traditional Mandi Benchmark</div>
                  <div className="text-xl font-bold font-mono text-slate-300 line-through">
                    ₹{lastMatchResult.traditionalMandiCostInr.toLocaleString('en-IN')}
                  </div>
                  <p className="text-[11px] text-emerald-200/70">
                    Cost if routed through 5 commission middlemen
                  </p>
                </div>

                <div className="space-y-1">
                  <div className="text-xs text-amber-300 font-bold flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Buyer Savings & Farmer Gain</span>
                  </div>
                  <div className="text-2xl font-black font-mono text-amber-400">
                    ₹{lastMatchResult.buyerSavingsInr.toLocaleString('en-IN')}{' '}
                    <span className="text-xs font-normal text-white">({lastMatchResult.buyerSavingsPercent}% saved)</span>
                  </div>
                  <p className="text-[11px] text-emerald-200/80">
                    Farmers earn +{lastMatchResult.farmerBonusIncomePercent}% higher net realization
                  </p>
                </div>
              </div>

              {/* Action Button to Proceed to Logistics */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                <button
                  onClick={() => onSelectCropForForecast(selectedCrop)}
                  className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>View 30-Day AI Demand & Price Forecast for {selectedCrop} ➔</span>
                </button>

                <button
                  onClick={handleConfirmAndProceed}
                  disabled={!lastMatchResult.isFullyMatched && lastMatchResult.totalMatchedKg === 0}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm px-6 py-3 rounded-xl shadow-md transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <Truck className="w-4 h-4 text-emerald-200" />
                  <span>Confirm Bulk Order & Generate Logistics Plan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Raw Available Produce Listings Directory */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              Live Fragmented Farmer & FPO Produce Pool
            </h3>
            <p className="text-xs text-slate-500">
              Individual supply lots currently registered and ready for algorithmic aggregation
            </p>
          </div>

          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by farmer, variety, mandi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-300 rounded-lg pl-9 pr-3 py-2 text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-600 w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-y border-slate-200">
              <tr>
                <th className="py-2.5 px-3">Produce & Variety</th>
                <th className="py-2.5 px-3">Farmer / FPO</th>
                <th className="py-2.5 px-3">Location & Mandi</th>
                <th className="py-2.5 px-3">Available Quantity</th>
                <th className="py-2.5 px-3">Expected Price</th>
                <th className="py-2.5 px-3">Quality Grade</th>
                <th className="py-2.5 px-3">Harvest Date</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {listings
                .filter((l) => {
                  if (searchTerm) {
                    return (
                      l.cropName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      l.farmerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      l.locationName.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                  }
                  return l.cropName.toLowerCase() === selectedCrop.toLowerCase();
                })
                .map((listing) => {
                  const availKg = listing.quantityKg - (listing.allocatedKg || 0);
                  return (
                    <tr key={listing.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <img
                            src={listing.photoUrl}
                            alt={listing.cropName}
                            className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                          />
                          <div>
                            <span className="font-bold text-slate-900 block">{listing.cropName}</span>
                            <span className="text-[11px] text-slate-500">{listing.variety}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{listing.farmerName}</div>
                        <span className="text-[10px] text-slate-500">
                          {listing.farmerType === 'fpo' ? `FPO (${listing.fpoMembersCount} farmers)` : 'Individual Grower'}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="text-slate-800">{listing.locationName}</div>
                        <span className="text-[10px] text-slate-400">{listing.district}, {listing.state}</span>
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-emerald-800 text-sm">
                        {availKg} kg
                      </td>
                      <td className="py-3 px-3 font-mono font-bold text-slate-900 text-sm">
                        ₹{listing.pricePerKg}/kg
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {listing.qualityGrade}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-600">
                        {listing.harvestDate}
                      </td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => {
                            setSelectedCrop(listing.cropName);
                            setRequestedKg(availKg);
                          }}
                          className="text-xs font-bold text-emerald-700 hover:text-emerald-900 px-2.5 py-1 rounded-md bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 cursor-pointer transition-colors"
                        >
                          Match
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
