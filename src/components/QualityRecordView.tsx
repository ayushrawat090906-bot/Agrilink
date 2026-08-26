import React, { useState } from 'react';
import { QualityRecord } from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Calendar, 
  QrCode, 
  Sparkles, 
  Scale, 
  ThermometerSnowflake, 
  Award, 
  UserCheck, 
  Lock, 
  Download, 
  Share2,
  FileCheck,
  Building2
} from 'lucide-react';

interface QualityRecordViewProps {
  qualityRecord: QualityRecord | null;
}

export const QualityRecordView: React.FC<QualityRecordViewProps> = ({
  qualityRecord,
}) => {
  const [buyerSigned, setBuyerSigned] = useState(true);
  const [fpoSigned, setFpoSigned] = useState(true);
  const [showCertificateModal, setShowCertificateModal] = useState(false);

  // Fallback default sample quality record if none active
  const record: QualityRecord = qualityRecord || {
    id: 'qc_sample_8821',
    orderId: 'AGL-ORD-8821',
    batchCode: 'AGL-QC-NSK-9014-2026',
    cropName: 'Tomato',
    variety: 'Abhinav Hybrid Red (Export & Premium Table Grade)',
    inspectedWeightKg: 2000,
    qualityGrade: 'Grade A (Premium)',
    moisturePercentage: 89.2,
    brixSweetness: 4.8,
    defectRatePercent: 0.8,
    averageDiameterMm: 58,
    photoUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=700&auto=format&fit=crop&q=80',
    inspectorName: 'Dr. Anand Joshi (QCI Certified Agri-Assessor #441)',
    inspectionLocation: 'Nashik Pimpalgaon Agro-Logistics & Cold Hub (Bay 3)',
    inspectionTimestamp: '25 Aug 2026, 14:45 IST',
    gpsCoordinates: '20.1744° N, 73.9852° E',
    digitalSealHash: '0x7F9B88E234A9C10D4881FB',
    buyerApproved: true,
    farmerApproved: true,
    remarks: 'Produce meets Grade A retail standards. Firmness, color homogeneity (88%+ red), and moisture level verified within optimal limits.',
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              Verified Digital Quality & Trust Record
            </span>
            <span className="text-xs text-slate-500 font-mono">
              Batch: <strong>{record.batchCode}</strong>
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">
            Pre-Dispatch Inspection & Multi-Party Digital Signoff
          </h2>
          <p className="text-xs text-slate-500">
            Immutable inspection record capturing physical produce photo, sensor telemetry, weight, grade, and GPS geotag to eliminate delivery disputes.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => alert(`Digital Certificate ${record.batchCode} exported as verifiable PDF.`)}
            className="flex items-center gap-1.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Certificate</span>
          </button>
        </div>
      </div>

      {/* Main Certificate Card */}
      <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-sm space-y-6 relative overflow-hidden">
        {/* Decorative Stamp */}
        <div className="absolute right-6 top-6 opacity-10 pointer-events-none">
          <Award className="w-48 h-48 text-emerald-800" />
        </div>

        {/* Certificate Title */}
        <div className="border-b border-slate-200 pb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
              <Award className="w-7 h-7 text-amber-300" />
            </div>
            <div>
              <div className="text-[10px] uppercase font-bold text-emerald-700 tracking-wider">
                National Quality Assurance Standard
              </div>
              <h3 className="text-lg font-bold text-slate-900">
                Grade A Quality Verification Certificate
              </h3>
              <p className="text-xs text-slate-500">AgriLink Trust Protocol • Order #{record.orderId}</p>
            </div>
          </div>

          <div className="text-right">
            <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-300 rounded-full text-xs font-extrabold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Passed Quality Audit
            </span>
            <div className="text-[10px] text-slate-400 font-mono mt-1">Hash: {record.digitalSealHash}</div>
          </div>
        </div>

        {/* Inspection Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Photo Preview */}
          <div className="md:col-span-5 space-y-3">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 group">
              <img
                src={record.photoUrl}
                alt={record.cropName}
                className="w-full h-56 object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-1 rounded">
                📷 Field Camera • {record.inspectionLocation.split('(')[0]}
              </div>
              <div className="absolute top-2 right-2 bg-emerald-600 text-white text-xs font-bold px-2 py-0.5 rounded shadow-xs">
                {record.qualityGrade}
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1 text-xs">
              <div className="text-[10px] font-bold uppercase text-slate-400">Auditor Remarks</div>
              <p className="text-slate-700 italic text-[11px]">"{record.remarks}"</p>
            </div>
          </div>

          {/* Telemetry Metrics & Lab Findings */}
          <div className="md:col-span-7 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Inspected Weight</span>
                <div className="text-lg font-black text-slate-900 font-mono">
                  {record.inspectedWeightKg.toLocaleString('en-IN')}{' '}
                  <span className="text-xs font-normal text-slate-500">kg</span>
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">100% Target Met</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Moisture Content</span>
                <div className="text-lg font-black text-emerald-800 font-mono">
                  {record.moisturePercentage}%
                </div>
                <span className="text-[10px] text-slate-500">Optimal (85-92%)</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Defect Rate</span>
                <div className="text-lg font-black text-emerald-700 font-mono">
                  {record.defectRatePercent}%
                </div>
                <span className="text-[10px] text-emerald-700 font-medium">Below 2% threshold</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Brix Sweetness</span>
                <div className="text-lg font-black text-slate-900 font-mono">
                  {record.brixSweetness || 4.8}° Bx
                </div>
                <span className="text-[10px] text-slate-500">Table Grade Sugar</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Avg Diameter</span>
                <div className="text-lg font-black text-slate-900 font-mono">
                  {record.averageDiameterMm || 58} mm
                </div>
                <span className="text-[10px] text-slate-500">Uniform Calibration</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400">Cold Chain Status</span>
                <div className="text-lg font-black text-blue-700 font-mono">
                  4.2°C
                </div>
                <span className="text-[10px] text-blue-700 font-medium">Pre-Cooled</span>
              </div>
            </div>

            {/* Geotag & Assessor Credentials */}
            <div className="bg-emerald-50/70 p-3.5 rounded-xl border border-emerald-200 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                  <UserCheck className="w-4 h-4 text-emerald-700" />
                  <span>Lead Assessor: {record.inspectorName}</span>
                </span>
                <span className="text-[10px] font-mono text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                  QCI Certified
                </span>
              </div>
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>{record.inspectionLocation} ({record.gpsCoordinates})</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Timestamp: {record.inspectionTimestamp}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Dual Signoff Section */}
        <div className="border-t border-slate-200 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Supplier / FPO Consent</span>
              <div className="text-xs font-bold text-slate-900">Sahyadri FPO & Farmer Cluster</div>
              <span className="text-[10px] text-emerald-700 font-medium">Digitally Signed via OTP</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              ✓
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-slate-400">Buyer Acceptance</span>
              <div className="text-xs font-bold text-slate-900">Metro Fresh APMC Quality Desk</div>
              <span className="text-[10px] text-emerald-700 font-medium">Pre-Approved for Dispatch</span>
            </div>
            <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center text-xs font-bold">
              ✓
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
