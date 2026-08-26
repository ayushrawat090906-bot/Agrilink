import React, { useState } from 'react';
import { UserRole, CropListing, BulkMatchingResult, LogisticsPlan, QualityRecord, NotificationItem, AggregationCenter } from './types';
import { INITIAL_CROP_LISTINGS, INITIAL_NOTIFICATIONS, AGGREGATION_HUBS } from './data/mockData';
import { generateLogisticsPlanForMatch, generateSampleQualityRecord, runBulkMatchingEngine } from './utils/matchingEngine';
import { Navbar } from './components/Navbar';
import { BuyerMarketplace } from './components/BuyerMarketplace';
import { LogisticsView } from './components/LogisticsView';
import { DemandForecastingView } from './components/DemandForecastingView';
import { QualityRecordView } from './components/QualityRecordView';
import { FarmerDashboard } from './components/FarmerDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { SihDemoTourModal } from './components/SihDemoTourModal';
import { NewListingModal } from './components/NewListingModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';

export default function App() {
  const [currentRole, setCurrentRole] = useState<UserRole>('buyer');
  const [activeTab, setActiveTab] = useState<string>('marketplace');
  const [listings, setListings] = useState<CropListing[]>(INITIAL_CROP_LISTINGS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Initialize with the standard demo order (2,000kg Tomato match)
  const initialMatch = runBulkMatchingEngine('Tomato', 2000, INITIAL_CROP_LISTINGS, 'balanced', AGGREGATION_HUBS[0]);
  const initialLogistics = generateLogisticsPlanForMatch('AGL-ORD-8821', initialMatch, AGGREGATION_HUBS[0]);
  const initialQc = generateSampleQualityRecord('AGL-ORD-8821', 'Tomato', 2000);

  const [activeLogisticsPlan, setActiveLogisticsPlan] = useState<LogisticsPlan | null>(initialLogistics);
  const [activeQualityRecord, setActiveQualityRecord] = useState<QualityRecord | null>(initialQc);
  const [selectedForecastCrop, setSelectedForecastCrop] = useState<string>('Tomato');

  // Modals state
  const [isDemoTourOpen, setIsDemoTourOpen] = useState(false);
  const [isNewListingModalOpen, setIsNewListingModalOpen] = useState(false);
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);

  // Unread notifications count
  const unreadNotifsCount = notifications.filter((n) => !n.read).length;

  const handleRoleChange = (newRole: UserRole) => {
    setCurrentRole(newRole);
    // Suggest relevant view on role change
    if (newRole === 'farmer' || newRole === 'fpo') {
      setActiveTab('farmer_portal');
    } else if (newRole === 'admin') {
      setActiveTab('admin');
    } else if (newRole === 'buyer') {
      setActiveTab('marketplace');
    }
  };

  const handleConfirmOrder = (matchResult: BulkMatchingResult, hub: AggregationCenter) => {
    const orderId = `AGL-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    // 1. Generate new logistics plan and QC record
    const newLogistics = generateLogisticsPlanForMatch(orderId, matchResult, hub);
    const newQc = generateSampleQualityRecord(orderId, matchResult.cropName, matchResult.totalMatchedKg);

    setActiveLogisticsPlan(newLogistics);
    setActiveQualityRecord(newQc);

    // 2. Mark allocated quantities in listings
    setListings((prevListings) =>
      prevListings.map((listing) => {
        const matchedItem = matchResult.matchedItems.find((m) => m.listing.id === listing.id);
        if (matchedItem) {
          const newAllocated = (listing.allocatedKg || 0) + matchedItem.allocatedKg;
          return {
            ...listing,
            allocatedKg: newAllocated,
            status: newAllocated >= listing.quantityKg ? 'fully_matched' : 'partially_matched',
          };
        }
        return listing;
      })
    );

    // 3. Add notification
    const newNotif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: '🎉 Bulk Order Confirmed!',
      message: `Order #${orderId} for ${matchResult.totalMatchedKg}kg ${matchResult.cropName} confirmed. Logistics route active.`,
      type: 'match',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    // 4. Smoothly switch to Logistics view
    setActiveTab('logistics');
  };

  const handleAddListing = (newListing: CropListing) => {
    setListings((prev) => [newListing, ...prev]);

    const notif: NotificationItem = {
      id: `notif_${Date.now()}`,
      title: '🌾 New Harvest Batch Listed',
      message: `${newListing.farmerName} listed ${newListing.quantityKg}kg ${newListing.cropName} @ ₹${newListing.pricePerKg}/kg.`,
      type: 'match',
      timestamp: 'Just now',
      read: false,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const handleSelectCropForForecast = (cropName: string) => {
    setSelectedForecastCrop(cropName);
    setActiveTab('forecast');
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleSelectNotification = (notif: NotificationItem) => {
    if (notif.type === 'demand_surge') {
      setActiveTab('forecast');
    } else if (notif.type === 'match' || notif.type === 'logistics') {
      setActiveTab('logistics');
    } else if (notif.type === 'qc') {
      setActiveTab('quality');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-emerald-200">
      {/* Global Navigation Bar */}
      <Navbar
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onStartDemoTour={() => setIsDemoTourOpen(true)}
        unreadNotifsCount={unreadNotifsCount}
        onOpenNotifs={() => setIsNotifsOpen(true)}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'marketplace' && (
          <BuyerMarketplace
            listings={listings}
            onConfirmOrder={handleConfirmOrder}
            onSelectCropForForecast={handleSelectCropForForecast}
          />
        )}

        {activeTab === 'logistics' && (
          <LogisticsView
            logisticsPlan={activeLogisticsPlan}
            onUpdateStatus={(newStatus) => {
              if (activeLogisticsPlan) {
                setActiveLogisticsPlan({ ...activeLogisticsPlan, trackingStatus: newStatus });
              }
            }}
            onViewQualityRecord={() => setActiveTab('quality')}
          />
        )}

        {activeTab === 'forecast' && (
          <DemandForecastingView initialCropName={selectedForecastCrop} />
        )}

        {activeTab === 'quality' && (
          <QualityRecordView qualityRecord={activeQualityRecord} />
        )}

        {activeTab === 'farmer_portal' && (
          <FarmerDashboard
            currentRole={currentRole}
            listings={listings}
            onOpenNewListingModal={() => setIsNewListingModalOpen(true)}
            onSelectCropForForecast={handleSelectCropForForecast}
          />
        )}

        {activeTab === 'admin' && <AdminDashboard />}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-900">AgriLink</span>
            <span>•</span>
            <span>SIH Problem Statement 26033 (AI-Powered Agricultural Supply-Chain)</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsDemoTourOpen(true)}
              className="text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer transition-colors"
            >
              ⚡ 60s Demo Presentation Pitch Tour
            </button>
            <span>•</span>
            <span>e-NAM & FPO Federation Compatible</span>
          </div>
        </div>
      </footer>

      {/* Guided 60s SIH Demo Walkthrough Tour Modal */}
      <SihDemoTourModal
        isOpen={isDemoTourOpen}
        onClose={() => setIsDemoTourOpen(false)}
        onJumpToView={(viewId, role) => {
          if (role) setCurrentRole(role);
          setActiveTab(viewId);
        }}
      />

      {/* New Produce Listing Modal for Farmers/FPOs */}
      <NewListingModal
        isOpen={isNewListingModalOpen}
        onClose={() => setIsNewListingModalOpen(false)}
        currentRole={currentRole}
        onAddListing={handleAddListing}
      />

      {/* Notifications Drawer */}
      <NotificationsDrawer
        isOpen={isNotifsOpen}
        onClose={() => setIsNotifsOpen(false)}
        notifications={notifications}
        onMarkAllRead={handleMarkAllRead}
        onSelectNotification={handleSelectNotification}
      />
    </div>
  );
}
