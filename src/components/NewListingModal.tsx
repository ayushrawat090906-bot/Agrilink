import React, { useState } from 'react';
import { CropListing, UserRole } from '../types';
import { CURRENT_USERS } from '../data/mockData';
import { 
  X, 
  Wheat, 
  Sparkles, 
  CheckCircle2, 
  Calendar, 
  DollarSign, 
  Scale, 
  MapPin, 
  ShieldCheck,
  Building2
} from 'lucide-react';

interface NewListingModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentRole: UserRole;
  onAddListing: (listing: CropListing) => void;
}

export const NewListingModal: React.FC<NewListingModalProps> = ({
  isOpen,
  onClose,
  currentRole,
  onAddListing,
}) => {
  const currentUser = CURRENT_USERS[currentRole] || CURRENT_USERS.farmer;

  const [cropName, setCropName] = useState('Tomato');
  const [variety, setVariety] = useState('Abhinav Hybrid Red');
  const [quantityKg, setQuantityKg] = useState(500);
  const [pricePerKg, setPricePerKg] = useState(28.0);
  const [locationName, setLocationName] = useState(currentUser.location || 'Dindori Mandi Belt');
  const [district, setDistrict] = useState('Nashik');
  const [state, setState] = useState('Maharashtra');
  const [harvestDate, setHarvestDate] = useState('2026-08-26');
  const [qualityGrade, setQualityGrade] = useState<'Grade A (Premium)' | 'Grade B (Standard)' | 'Export Quality'>('Grade A (Premium)');
  const [moisturePercent, setMoisturePercent] = useState(89);

  if (!isOpen) return null;

  const handlePreFillDemo = () => {
    setCropName('Tomato');
    setVariety('Abhinav Hybrid (Semi-determinate)');
    setQuantityKg(500);
    setPricePerKg(28.0);
    setLocationName('Dindori Mandi Belt');
    setDistrict('Nashik');
    setState('Maharashtra');
    setHarvestDate('2026-08-26');
    setQualityGrade('Grade A (Premium)');
    setMoisturePercent(89);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newListing: CropListing = {
      id: `lst_custom_${Date.now()}`,
      farmerId: currentUser.id,
      farmerName: currentUser.name,
      farmerType: currentRole === 'fpo' ? 'fpo' : 'individual',
      fpoMembersCount: currentRole === 'fpo' ? currentUser.fpoMembersCount : undefined,
      cropName,
      variety,
      quantityKg: Number(quantityKg),
      allocatedKg: 0,
      pricePerKg: Number(pricePerKg),
      locationName,
      district,
      state,
      lat: currentUser.lat || 20.201,
      lng: currentUser.lng || 73.834,
      harvestDate,
      qualityGrade,
      moisturePercent: Number(moisturePercent),
      minOrderKg: 100,
      certifications: ['Good Agricultural Practices (GAP)', 'Traceable Batch'],
      photoUrl:
        cropName === 'Tomato'
          ? 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=500&auto=format&fit=crop&q=80'
          : cropName === 'Red Onion'
          ? 'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=500&auto=format&fit=crop&q=80'
          : cropName === 'Potato'
          ? 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=500&auto=format&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=500&auto=format&fit=crop&q=80',
      status: 'available',
      createdAt: new Date().toISOString(),
    };

    onAddListing(newListing);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Wheat className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">
                {currentRole === 'fpo' ? 'Add Collective FPO Produce Batch' : 'List New Crop Harvest'}
              </h3>
              <p className="text-xs text-emerald-200">
                Direct to Institutional Bulk Buyers • 0 Brokerage
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-emerald-300 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Demo Pre-fill banner */}
        <div className="bg-emerald-50 px-6 py-2.5 border-b border-emerald-200 flex items-center justify-between">
          <span className="text-xs text-emerald-900 font-semibold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>SIH Demo Pitch Script Preset:</span>
          </span>
          <button
            type="button"
            onClick={handlePreFillDemo}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 bg-white border border-emerald-300 px-2.5 py-1 rounded-lg shadow-2xs hover:bg-emerald-100/50 cursor-pointer"
          >
            Autofill: 500kg Tomato @ ₹28/kg
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Crop Commodity</label>
              <select
                value={cropName}
                onChange={(e) => setCropName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Tomato">Tomato (टमाटर)</option>
                <option value="Red Onion">Red Onion (प्याज)</option>
                <option value="Potato">Potato (आलू)</option>
                <option value="Green Chilli">Green Chilli (हरी मिर्च)</option>
                <option value="Basmati Rice">Basmati Rice (चावल)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Variety / Cultivar</label>
              <input
                type="text"
                value={variety}
                onChange={(e) => setVariety(e.target.value)}
                placeholder="e.g. Abhinav Hybrid"
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Scale className="w-3.5 h-3.5 text-emerald-700" />
                <span>Quantity (kg)</span>
              </label>
              <input
                type="number"
                min={50}
                step={50}
                value={quantityKg}
                onChange={(e) => setQuantityKg(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" />
                <span>Expected Price (₹/kg)</span>
              </label>
              <input
                type="number"
                min={5}
                step={0.5}
                value={pricePerKg}
                onChange={(e) => setPricePerKg(Number(e.target.value))}
                className="w-full text-xs font-mono font-bold bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>Location / Village</span>
              </label>
              <input
                type="text"
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                required
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
                <span>Harvest Date</span>
              </label>
              <input
                type="date"
                value={harvestDate}
                onChange={(e) => setHarvestDate(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Quality Grade</label>
              <select
                value={qualityGrade}
                onChange={(e) => setQualityGrade(e.target.value as any)}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              >
                <option value="Grade A (Premium)">Grade A (Premium Table)</option>
                <option value="Grade B (Standard)">Grade B (Standard)</option>
                <option value="Export Quality">Export Quality (Strict Spec)</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700">Moisture Content (%)</label>
              <input
                type="number"
                min={5}
                max={99}
                value={moisturePercent}
                onChange={(e) => setMoisturePercent(Number(e.target.value))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-slate-800 focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-4 py-2 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-emerald-800 hover:bg-emerald-700 text-white font-bold text-xs px-5 py-2.5 rounded-lg shadow-sm transition-transform active:scale-95 cursor-pointer"
            >
              Publish to Aggregation Pool
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
