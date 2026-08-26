import React, { useState } from 'react';
import { CropListing, UserRole } from '../types';
import { CURRENT_USERS } from '../data/mockData';
import { 
  Wheat, 
  Plus, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  MapPin, 
  Building2, 
  Sparkles, 
  ShieldCheck, 
  Truck, 
  AlertCircle,
  Calendar,
  Layers
} from 'lucide-react';

interface FarmerDashboardProps {
  currentRole: UserRole;
  listings: CropListing[];
  onOpenNewListingModal: () => void;
  onSelectCropForForecast: (cropName: string) => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  currentRole,
  listings,
  onOpenNewListingModal,
  onSelectCropForForecast,
}) => {
  const currentUser = CURRENT_USERS[currentRole] || CURRENT_USERS.farmer;
  const isFpo = currentRole === 'fpo';

  // Filter listings by current user or FPO
  const userListings = listings.filter((l) =>
    isFpo ? l.farmerType === 'fpo' : l.farmerId === currentUser.id || l.farmerName.includes('Ramesh')
  );

  const totalQuantityKg = userListings.reduce((acc, l) => acc + l.quantityKg, 0);
  const totalAllocatedKg = userListings.reduce((acc, l) => acc + (l.allocatedKg || 0), 0);
  const totalEarningsInr = userListings.reduce(
    (acc, l) => acc + (l.allocatedKg || 0) * l.pricePerKg * 0.92,
    0
  );

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-900 rounded-2xl p-6 sm:p-8 text-white shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {isFpo ? '🏢 FPO Aggregation Command' : '👨‍🌾 Farmer Direct Portal'}
            </span>
            <span className="text-xs text-slate-300">
              {currentUser.name} • {currentUser.location}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {isFpo
              ? `Sahyadri Cluster Produce Aggregation (${currentUser.fpoMembersCount} Member Farmers)`
              : 'Direct Farm-Gate Listing & Order Participation'}
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            List your harvest directly to institutional buyers at transparent prices. AgriLink combines your lot with nearby growers to fulfill multi-ton bulk purchase orders.
          </p>
        </div>

        <button
          onClick={onOpenNewListingModal}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isFpo ? 'Add Collective FPO Batch' : 'List New Crop Harvest'}</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Total Produce Listed</span>
            <Wheat className="w-4 h-4 text-emerald-700" />
          </div>
          <div className="text-2xl font-black text-slate-900 font-mono">
            {totalQuantityKg.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-slate-500">kg</span>
          </div>
          <p className="text-[11px] text-slate-500">Across {userListings.length} registered batches</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Bulk Orders Matched</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            {totalAllocatedKg.toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-slate-500">kg (Allocated)</span>
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">
            {totalQuantityKg > 0 ? Math.round((totalAllocatedKg / totalQuantityKg) * 100) : 0}% matched into buyer orders
          </p>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-1 shadow-xs">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Direct Payout Realization</span>
            <DollarSign className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-black text-emerald-800 font-mono">
            ₹{Math.round(totalEarningsInr).toLocaleString('en-IN')}
          </div>
          <p className="text-[11px] text-emerald-700 font-semibold">+32% higher vs local mandi broker</p>
        </div>
      </div>

      {/* Active Crop Listings Table */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-bold text-base text-slate-900">
              {isFpo ? 'Active FPO Farmer Member Batches' : 'Your Registered Crop Listings'}
            </h3>
            <p className="text-xs text-slate-500">
              Available for algorithmic bulk matching and direct dispatch
            </p>
          </div>

          <button
            onClick={onOpenNewListingModal}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Batch</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userListings.map((listing) => {
            const availKg = listing.quantityKg - (listing.allocatedKg || 0);
            return (
              <div
                key={listing.id}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-4 space-y-3 transition-all"
              >
                <div className="flex items-start gap-3">
                  <img
                    src={listing.photoUrl}
                    alt={listing.cropName}
                    className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                  />
                  <div className="space-y-0.5 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-slate-900">{listing.cropName}</h4>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                        {listing.qualityGrade}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{listing.variety}</p>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200/80 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Total Quantity:</span>
                    <strong className="text-slate-900 font-mono">{listing.quantityKg} kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expected Price:</span>
                    <strong className="text-emerald-800 font-mono">₹{listing.pricePerKg}/kg</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Location:</span>
                    <span className="text-slate-700">{listing.locationName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Harvest Date:</span>
                    <span className="text-slate-700">{listing.harvestDate}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onSelectCropForForecast(listing.cropName)}
                    className="text-[11px] font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 cursor-pointer"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    <span>Demand Forecast</span>
                  </button>

                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                    ● Ready for Aggregation
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* AI Price & Demand Alert Notification Card */}
      <div className="bg-emerald-950 text-white rounded-2xl p-6 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
              Regional Demand Advisory Alert
            </span>
          </div>
          <h3 className="font-bold text-base text-white">
            Tomato Demand in Western Hubs is +28.9% Above Average
          </h3>
          <p className="text-xs text-emerald-200/80 max-w-xl">
            Heavy rains in Southern mandis have restricted supply. Nashik & Pune FPOs are advised to aggregate Grade-A produce now to secure high-value institutional contracts.
          </p>
        </div>

        <button
          onClick={() => onSelectCropForForecast('Tomato')}
          className="bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-transform hover:scale-105 active:scale-95 cursor-pointer shrink-0"
        >
          View Full Forecast ➔
        </button>
      </div>
    </div>
  );
};
