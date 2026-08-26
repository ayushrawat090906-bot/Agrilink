import { CropListing, MatchingStrategy, BulkMatchingResult, MatchedListingItem, LogisticsPlan, AggregationCenter, PickupPoint, QualityRecord } from '../types';
import { AGGREGATION_HUBS } from '../data/mockData';

// Haversine formula to calculate distance in km between two GPS coordinates
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10; // Round to 1 decimal place
}

export function runBulkMatchingEngine(
  cropName: string,
  requestedKg: number,
  allListings: CropListing[],
  strategy: MatchingStrategy = 'balanced',
  targetHub: AggregationCenter = AGGREGATION_HUBS[0],
  buyerLocation = { name: 'Metro Fresh APMC', city: 'Mumbai', lat: 19.076, lng: 72.877 }
): BulkMatchingResult {
  // 1. Filter listings matching crop and with available capacity
  const eligibleListings = allListings.filter(
    (item) =>
      item.cropName.toLowerCase() === cropName.toLowerCase() &&
      item.quantityKg - (item.allocatedKg || 0) > 0
  );

  // 2. Compute sorting metrics
  const scoredListings = eligibleListings.map((listing) => {
    const availableKg = listing.quantityKg - (listing.allocatedKg || 0);
    const distanceToHub = calculateDistanceKm(listing.lat, listing.lng, targetHub.lat, targetHub.lng);
    const harvestAgeDays = Math.max(
      0,
      Math.floor((new Date().getTime() - new Date(listing.harvestDate).getTime()) / (1000 * 3600 * 24))
    );

    // Scoring weights
    let score = 0;
    if (strategy === 'price') {
      // Lower price is higher priority
      score = 1000 - listing.pricePerKg * 20;
    } else if (strategy === 'distance') {
      // Shorter distance is higher priority
      score = 1000 - distanceToHub * 15;
    } else if (strategy === 'freshness') {
      // Fresher harvest is higher priority
      score = 1000 - harvestAgeDays * 100;
    } else {
      // Balanced Smart AI blend: price (40%) + distance (30%) + grade/fpo reliability (30%)
      const gradeBonus = listing.qualityGrade.includes('Grade A') ? 150 : listing.qualityGrade.includes('Export') ? 200 : 50;
      const fpoBonus = listing.farmerType === 'fpo' ? 50 : 0;
      score = 500 - listing.pricePerKg * 10 - distanceToHub * 4 + gradeBonus + fpoBonus;
    }

    return {
      listing,
      availableKg,
      distanceToHub,
      score,
    };
  });

  // Sort descending by score
  scoredListings.sort((a, b) => b.score - a.score);

  // 3. Allocate greedy subset
  let remainingNeededKg = requestedKg;
  const matchedItems: MatchedListingItem[] = [];

  for (const candidate of scoredListings) {
    if (remainingNeededKg <= 0) break;

    const allocation = Math.min(candidate.availableKg, remainingNeededKg);
    if (allocation > 0) {
      const subtotal = allocation * candidate.listing.pricePerKg;
      // In AgriLink direct supply, farmers earn ~92% of the wholesale value directly
      // vs 55% in traditional 5-middlemen chain
      const farmerProfitShareInr = Math.round(subtotal * 0.92);

      matchedItems.push({
        listing: candidate.listing,
        allocatedKg: allocation,
        pricePerKg: candidate.listing.pricePerKg,
        subtotalInr: Math.round(subtotal),
        distanceToHubKm: candidate.distanceToHub,
        farmerProfitShareInr,
      });

      remainingNeededKg -= allocation;
    }
  }

  const totalMatchedKg = matchedItems.reduce((acc, curr) => acc + curr.allocatedKg, 0);
  const shortfallKg = Math.max(0, requestedKg - totalMatchedKg);
  const isFullyMatched = shortfallKg === 0;
  const fulfillmentPercent = Math.min(100, Math.round((totalMatchedKg / requestedKg) * 100));

  // Build the demoable formula string: "500kg (Farmer A) + 600kg (FPO B) + 400kg (Farmer C) + 500kg (Farmer D) = 2,000 kg"
  const formulaParts = matchedItems.map((item) => `${item.allocatedKg} kg (${item.listing.farmerName.split(' ')[0]})`);
  const breakdownFormula =
    formulaParts.length > 0
      ? `${formulaParts.join(' + ')} = ${totalMatchedKg.toLocaleString('en-IN')} kg ${isFullyMatched ? '✅ (100% Matched)' : `⚠️ (Shortfall: ${shortfallKg} kg)`}`
      : 'No matching supply found';

  const totalProduceCostInr = matchedItems.reduce((acc, curr) => acc + curr.subtotalInr, 0);
  const weightedAveragePricePerKg =
    totalMatchedKg > 0 ? Math.round((totalProduceCostInr / totalMatchedKg) * 10) / 10 : 0;

  // Traditional Mandi Benchmark:
  // Farmer gets ₹20-22/kg, but through 5 intermediary hops (Trader + Mandi Commission + Secondary Wholesaler + Distributor + Wastage),
  // Buyer pays ~₹36-40/kg. With AgriLink, Buyer pays ~₹28-30/kg (saving ~20-25%) and farmer gets ₹28/kg (+35% more!).
  const traditionalMandiAvgPricePerKg = weightedAveragePricePerKg * 1.28; // ~28% markup in multi-tier mandi
  const traditionalMandiCostInr = Math.round(totalMatchedKg * traditionalMandiAvgPricePerKg);
  const buyerSavingsInr = Math.max(0, traditionalMandiCostInr - totalProduceCostInr);
  const buyerSavingsPercent = traditionalMandiCostInr > 0 ? Math.round((buyerSavingsInr / traditionalMandiCostInr) * 100) : 0;

  return {
    cropName,
    requestedQuantityKg: requestedKg,
    totalMatchedKg,
    fulfillmentPercent,
    shortfallKg,
    isFullyMatched,
    strategyUsed: strategy,
    matchedItems,
    breakdownFormula,
    weightedAveragePricePerKg,
    totalProduceCostInr,
    traditionalMandiCostInr,
    buyerSavingsInr,
    buyerSavingsPercent,
    farmerBonusIncomePercent: 32, // Farmers earn ~32% more net realization
    timestamp: new Date().toISOString(),
  };
}

export function generateLogisticsPlanForMatch(
  orderId: string,
  matchResult: BulkMatchingResult,
  targetHub: AggregationCenter = AGGREGATION_HUBS[0],
  buyerLocation = {
    name: 'Metro Fresh APMC Hub',
    address: 'Sector 19, Vashi Mandi Road, Navi Mumbai',
    city: 'Mumbai',
    lat: 19.076,
    lng: 72.877,
    requestedDeliveryDate: 'Tomorrow by 06:00 AM',
  }
): LogisticsPlan {
  // 1. Build pickup points
  const pickupPoints: PickupPoint[] = matchResult.matchedItems.map((item, idx) => {
    const estimatedMin = 30 + idx * 25;
    const hours = Math.floor(estimatedMin / 60);
    const mins = estimatedMin % 60;
    const timeStr = `Today, ${String(14 + hours).padStart(2, '0')}:${String(mins).padStart(2, '0')} hrs`;

    return {
      id: `pk_${item.listing.id}`,
      farmerName: item.listing.farmerName,
      farmerType: item.listing.farmerType,
      location: `${item.listing.locationName}, ${item.listing.district}`,
      lat: item.listing.lat,
      lng: item.listing.lng,
      quantityKg: item.allocatedKg,
      pickupSequence: idx + 1,
      eta: timeStr,
      status: idx === 0 ? 'collected' : 'pending',
    };
  });

  // Calculate distances:
  // Phase 1: Local milk-run pickup between farms to hub
  let farmToHubDistance = 0;
  matchResult.matchedItems.forEach((item) => {
    farmToHubDistance += item.distanceToHubKm;
  });
  // Average consolidation route distance is ~0.6 * sum of individual spokes
  const milkRunDistanceKm = Math.max(15, Math.round(farmToHubDistance * 0.65));

  // Phase 2: Hub to Buyer distance
  const hubToBuyerDistanceKm = calculateDistanceKm(targetHub.lat, targetHub.lng, buyerLocation.lat, buyerLocation.lng);
  const totalDistanceKm = milkRunDistanceKm + hubToBuyerDistanceKm;

  // Transit time estimation: ~35 km/h average commercial vehicle speed including loading
  const estimatedTransitHours = Math.round((totalDistanceKm / 35 + 1.5) * 10) / 10;

  // Vehicle payload selector
  let vehicleType: 'Tata 407 (2.5T)' | 'Eicher 14ft (4T)' | 'Reefer Cold Van (5T)' | 'Heavy Multi-Axle (10T)' = 'Tata 407 (2.5T)';
  let baseRatePerKm = 24;
  if (matchResult.totalMatchedKg > 4000) {
    vehicleType = 'Heavy Multi-Axle (10T)';
    baseRatePerKm = 48;
  } else if (matchResult.totalMatchedKg > 2200) {
    vehicleType = 'Reefer Cold Van (5T)';
    baseRatePerKm = 36;
  } else if (matchResult.totalMatchedKg > 1500) {
    vehicleType = 'Eicher 14ft (4T)';
    baseRatePerKm = 30;
  }

  const freightCostInr = Math.round(totalDistanceKm * baseRatePerKm + 850); // Base toll + loading

  // Environmental carbon savings: 1 consolidated trip vs 4 separate small diesel tempos + 3 mandi loading hops
  const carbonEmissionsSavedKg = Math.round(totalDistanceKm * 0.42 * (matchResult.matchedItems.length - 1) + 45);

  return {
    orderId,
    cropName: matchResult.cropName,
    totalQuantityKg: matchResult.totalMatchedKg,
    aggregationHub: targetHub,
    pickupPoints,
    buyerDestination: buyerLocation,
    totalDistanceKm,
    estimatedTransitHours,
    freightCostInr,
    vehicleType,
    carbonEmissionsSavedKg,
    intermediaryLayersSaved: 4, // Bypasses Local Village Agent, APMC Primary Wholesaler, Secondary Broker, Regional Distributor
    trackingStatus: 'pickup_in_progress',
  };
}

export function generateSampleQualityRecord(
  orderId: string,
  cropName: string,
  totalWeightKg: number,
  photoUrl?: string
): QualityRecord {
  const timestamp = new Date().toISOString();
  const hash = `AGL-QC-${Math.random().toString(36).substring(2, 9).toUpperCase()}-${Date.now().toString().slice(-4)}`;

  return {
    id: `qc_${orderId}`,
    orderId,
    batchCode: hash,
    cropName,
    variety: 'Abhinav Hybrid Red (Export & Premium Table Grade)',
    inspectedWeightKg: totalWeightKg,
    qualityGrade: 'Grade A (Premium)',
    moisturePercentage: 89.2,
    brixSweetness: 4.8,
    defectRatePercent: 0.8,
    averageDiameterMm: 58,
    photoUrl:
      photoUrl ||
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
    inspectorName: 'Dr. Anand Joshi (Certified QCI Agri-Inspector)',
    inspectionLocation: 'Nashik Pimpalgaon Aggregation Hub (Bay 3)',
    inspectionTimestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
    gpsCoordinates: '20.1744° N, 73.9852° E (Pimpalgaon Cold Hub)',
    digitalSealHash: `0x7F${Math.random().toString(16).substring(2, 14).toUpperCase()}88E2`,
    buyerApproved: true,
    farmerApproved: true,
    remarks: 'Produce meets Grade A retail standards. Firmness, color homogeneity (85%+ red), and moisture level verified within optimal limits.',
  };
}
