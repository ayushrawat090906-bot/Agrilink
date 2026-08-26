export type UserRole = 'farmer' | 'fpo' | 'buyer' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  entityName?: string;
  phone: string;
  location: string;
  state: string;
  lat: number;
  lng: number;
  fpoMembersCount?: number;
  rating: number;
  avatarUrl?: string;
}

export interface CropListing {
  id: string;
  farmerId: string;
  farmerName: string;
  farmerType: 'individual' | 'fpo';
  fpoMembersCount?: number;
  cropName: string;
  variety: string;
  quantityKg: number;
  allocatedKg: number; // For active orders
  pricePerKg: number;
  locationName: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  harvestDate: string;
  qualityGrade: 'Grade A (Premium)' | 'Grade B (Standard)' | 'Export Quality';
  moisturePercent: number;
  minOrderKg: number;
  certifications: string[];
  photoUrl: string;
  status: 'available' | 'partially_matched' | 'fully_matched';
  createdAt: string;
}

export type MatchingStrategy = 'balanced' | 'distance' | 'price' | 'freshness';

export interface MatchedListingItem {
  listing: CropListing;
  allocatedKg: number;
  pricePerKg: number;
  subtotalInr: number;
  distanceToHubKm: number;
  farmerProfitShareInr: number;
}

export interface BulkMatchingResult {
  cropName: string;
  requestedQuantityKg: number;
  totalMatchedKg: number;
  fulfillmentPercent: number;
  shortfallKg: number;
  isFullyMatched: boolean;
  strategyUsed: MatchingStrategy;
  matchedItems: MatchedListingItem[];
  breakdownFormula: string; // e.g. "500 + 600 + 400 + 500 = 2,000 kg"
  weightedAveragePricePerKg: number;
  totalProduceCostInr: number;
  traditionalMandiCostInr: number;
  buyerSavingsInr: number;
  buyerSavingsPercent: number;
  farmerBonusIncomePercent: number;
  timestamp: string;
}

export interface PickupPoint {
  id: string;
  farmerName: string;
  farmerType: 'individual' | 'fpo';
  location: string;
  lat: number;
  lng: number;
  quantityKg: number;
  pickupSequence: number;
  eta: string;
  status: 'pending' | 'collected' | 'at_hub';
}

export interface AggregationCenter {
  id: string;
  name: string;
  hubCode: string;
  location: string;
  district: string;
  state: string;
  lat: number;
  lng: number;
  capacityTonnes: number;
  coldStorageAvailable: boolean;
  managerContact: string;
}

export interface LogisticsPlan {
  orderId: string;
  cropName: string;
  totalQuantityKg: number;
  aggregationHub: AggregationCenter;
  pickupPoints: PickupPoint[];
  buyerDestination: {
    name: string;
    address: string;
    city: string;
    lat: number;
    lng: number;
    requestedDeliveryDate: string;
  };
  totalDistanceKm: number;
  estimatedTransitHours: number;
  freightCostInr: number;
  vehicleType: 'Tata 407 (2.5T)' | 'Eicher 14ft (4T)' | 'Reefer Cold Van (5T)' | 'Heavy Multi-Axle (10T)';
  carbonEmissionsSavedKg: number;
  intermediaryLayersSaved: number;
  trackingStatus: 'order_confirmed' | 'pickup_in_progress' | 'consolidating_at_hub' | 'quality_inspected' | 'dispatched_to_buyer' | 'delivered';
}

export interface QualityRecord {
  id: string;
  orderId: string;
  batchCode: string;
  cropName: string;
  variety: string;
  inspectedWeightKg: number;
  qualityGrade: 'Grade A (Premium)' | 'Grade B (Standard)' | 'Grade C';
  moisturePercentage: number;
  brixSweetness?: number; // for fruits/tomatoes
  defectRatePercent: number;
  averageDiameterMm?: number;
  photoUrl: string;
  inspectorName: string;
  inspectionLocation: string;
  inspectionTimestamp: string;
  gpsCoordinates: string;
  digitalSealHash: string;
  buyerApproved: boolean;
  farmerApproved: boolean;
  remarks: string;
}

export interface DemandForecastItem {
  cropName: string;
  category: 'Vegetables' | 'Fruits' | 'Grains' | 'Spices';
  region: string;
  currentDemandTonnes: number;
  expectedDemandTonnes: number;
  percentChange: number; // e.g. +29
  trend: 'surge' | 'rising' | 'stable' | 'declining';
  currentMandiAvgPrice: number;
  predictedMandiPrice: number;
  priceTrendPercent: number;
  confidenceScorePercent: number;
  recommendation: string;
  supplyDrivers: string[];
  historicalMonthlyData: {
    month: string;
    actualDemand: number;
    forecastDemand: number;
    avgPrice: number;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'match' | 'price_alert' | 'demand_surge' | 'logistics' | 'qc';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface BulkOrder {
  id: string;
  buyerId: string;
  buyerName: string;
  cropName: string;
  quantityKg: number;
  maxBudgetPerKg: number;
  deliveryCity: string;
  status: 'matched' | 'logistics_scheduled' | 'in_transit' | 'delivered';
  matchingResult: BulkMatchingResult;
  logisticsPlan: LogisticsPlan;
  qualityRecord?: QualityRecord;
  createdAt: string;
}
