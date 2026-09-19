import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import {
  Buyer,
  ColdStorage,
  FPO,
  LogisticsProvider,
} from '../types';
import { cleanPhoneForTel, isMobileDevice } from '../utils/phoneUtils';
import { ServiceCallModal, ServiceContactInfo } from '../components/ServiceCallModal';
import {
  Handshake,
  Building2,
  Snowflake,
  Truck,
  PhoneCall,
  Send,
  MapPin,
  CheckCircle2,
  Filter,
  ShieldCheck,
  Calendar,
  Users,
  Clock,
  ArrowRight,
} from 'lucide-react';

export const ServicesPage: React.FC = () => {
  const {
    servicesSubTab,
    setServicesSubTab,
    t,
    profile,
    journey,
    updateJourney,
    completeJourney,
    showToast,
    openPaymentModal,
  } = useApp();

  // Data states
  const [buyers, setBuyers] = useState<Buyer[]>([]);
  const [fpos, setFPOs] = useState<FPO[]>([]);
  const [storages, setStorages] = useState<ColdStorage[]>([]);
  const [logistics, setLogistics] = useState<LogisticsProvider[]>([]);

  // Filter states
  const [buyerCropFilter, setBuyerCropFilter] = useState('all');
  const [buyerTypeFilter, setBuyerTypeFilter] = useState('all');
  const [fpoDistrictFilter, setFpoDistrictFilter] = useState('all');
  const [storageCropFilter, setStorageCropFilter] = useState('all');
  const [logisticsDistrictFilter, setLogisticsDistrictFilter] = useState('all');

  // Modals
  const [enquiryBuyer, setEnquiryBuyer] = useState<Buyer | null>(null);
  const [enquiryQuantity, setEnquiryQuantity] = useState('2 MT');
  const [enquiryPrice, setEnquiryPrice] = useState('₹28 / kg');
  const [enquiryMsg, setEnquiryMsg] = useState('Farm harvested Grade A stock available for immediate dispatch.');

  const [storageFacility, setStorageFacility] = useState<ColdStorage | null>(null);
  const [storageQty, setStorageQty] = useState('3');
  const [storageMonths, setStorageMonths] = useState('2');
  const [storageDate, setStorageDate] = useState('2026-09-22');

  const [logisticsProvider, setLogisticsProvider] = useState<LogisticsProvider | null>(null);
  const [pickupLoc, setPickupLoc] = useState(`${profile.village}, ${profile.district}`);
  const [destLoc, setDestLoc] = useState('Guntur APMC Yard');
  const [transportCrop, setTransportCrop] = useState(journey.cropSelected || 'Tomato');
  const [transportQty, setTransportQty] = useState('2 MT');
  const [transportDist, setTransportDist] = useState('35');

  // Service call dialog for desktop fallback
  const [activeCallModal, setActiveCallModal] = useState<ServiceContactInfo | null>(null);

  const handleServiceCallClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    info: ServiceContactInfo
  ) => {
    if (isMobileDevice()) {
      // On mobile devices and webviews: allow native tel: navigation directly to phone dialer
      return;
    }
    // On desktop browsers: prevent empty/broken tel handling and show fallback modal with Copy & WhatsApp
    e.preventDefault();
    setActiveCallModal(info);
  };

  useEffect(() => {
    loadData();
  }, [buyerCropFilter, buyerTypeFilter, fpoDistrictFilter, storageCropFilter, logisticsDistrictFilter]);

  const loadData = async () => {
    try {
      const [bList, fList, cList, lList] = await Promise.all([
        api.getBuyers({ crop: buyerCropFilter, buyerType: buyerTypeFilter }),
        api.getFPOs({ district: fpoDistrictFilter }),
        api.getColdStorage({ crop: storageCropFilter }),
        api.getLogistics({ district: logisticsDistrictFilter }),
      ]);
      setBuyers(bList);
      setFPOs(fList);
      setStorages(cList);
      setLogistics(lList);
    } catch (err) {
      console.warn('Failed loading service data:', err);
    }
  };

  // Submit Enquiry
  const handleSubmitEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryBuyer) return;

    try {
      const enq = await api.sendBuyerEnquiry({
        buyerId: enquiryBuyer.id,
        buyerName: enquiryBuyer.name,
        crop: enquiryBuyer.cropRequired,
        quantity: enquiryQuantity,
        offeredPrice: enquiryPrice,
        message: enquiryMsg,
      });
      updateJourney({ buyerSelected: enquiryBuyer, enquirySent: enq, currentStep: 6 });
      showToast(t('enquirySentSuccess'));
      setEnquiryBuyer(null);
      setServicesSubTab('coldStorage');
    } catch (err: any) {
      showToast('Enquiry saved offline');
      setEnquiryBuyer(null);
    }
  };

  // Submit Cold Storage Request
  const handleSubmitStorage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storageFacility) return;

    try {
      const req = await api.requestColdStorage({
        facilityId: storageFacility.id,
        facilityName: storageFacility.name,
        crop: storageFacility.suitableFor[0] || 'Tomato',
        quantityMT: Number(storageQty) || 2,
        durationMonths: Number(storageMonths) || 1,
        preferredDate: storageDate,
      });
      updateJourney({ storageSelected: storageFacility, storageRequest: req, currentStep: 7 });
      showToast(t('storageRequestSuccess'));
      setStorageFacility(null);
      setServicesSubTab('logistics');
    } catch {
      showToast('Storage request saved offline');
      setStorageFacility(null);
    }
  };

  // Submit Transport Request
  const handleSubmitTransport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!logisticsProvider) return;

    try {
      const req = await api.requestLogistics({
        providerId: logisticsProvider.id,
        providerName: logisticsProvider.provider,
        pickupLocation: pickupLoc,
        destination: destLoc,
        crop: transportCrop,
        quantity: transportQty,
        vehicle: logisticsProvider.vehicle,
        distanceKm: Number(transportDist) || 35,
      });
      updateJourney({ logisticsSelected: logisticsProvider, transportRequest: req });
      showToast(t('transportBookedSuccess'));
      setLogisticsProvider(null);
      completeJourney();
    } catch {
      showToast('Transport request saved offline');
      setLogisticsProvider(null);
      completeJourney();
    }
  };

  const tabs = [
    { id: 'buyers', label: t('tabBuyers'), icon: Handshake, badge: `${buyers.length}` },
    { id: 'fpos', label: t('tabFPOs'), icon: Building2, badge: `${fpos.length}` },
    { id: 'coldStorage', label: t('tabColdStorage'), icon: Snowflake, badge: `${storages.length}` },
    { id: 'logistics', label: t('tabLogistics'), icon: Truck, badge: `${logistics.length}` },
  ] as const;

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
            {t('servicesTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Direct buyers, farmer producer cooperatives, cold storage & mini-truck booking
          </p>
        </div>
      </div>

      {/* Sub-Tabs Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = servicesSubTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`service-tab-${tab.id}`}
              onClick={() => setServicesSubTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-extrabold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-white/60'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-emerald-900 text-emerald-100' : 'bg-stone-200 text-stone-700'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ---------------- 1. BUYERS TAB ---------------- */}
      {servicesSubTab === 'buyers' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-bold text-stone-700 uppercase">
              <Filter className="w-3.5 h-3.5 text-emerald-700" />
              <span>Filter Buyers:</span>
            </div>

            <select
              value={buyerCropFilter}
              onChange={(e) => setBuyerCropFilter(e.target.value)}
              className="p-2 rounded-xl border border-stone-300 text-xs font-semibold bg-stone-50"
            >
              <option value="all">All Crops</option>
              <option value="Tomato">Tomato</option>
              <option value="Chilli">Chilli</option>
              <option value="Paddy">Paddy</option>
              <option value="Cotton">Cotton</option>
            </select>

            <select
              value={buyerTypeFilter}
              onChange={(e) => setBuyerTypeFilter(e.target.value)}
              className="p-2 rounded-xl border border-stone-300 text-xs font-semibold bg-stone-50"
            >
              <option value="all">All Buyer Types</option>
              <option value="Wholesaler">Wholesaler</option>
              <option value="Processor">Processor</option>
              <option value="Exporter">Exporter</option>
              <option value="Retailer">Retailer</option>
            </select>
          </div>

          {/* Buyers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {buyers.map((b) => (
              <div
                key={b.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-emerald-400 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                          {b.buyerType}
                        </span>
                        {b.verified && (
                          <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            Verified
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-black text-stone-900 mt-1">
                        {b.name}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {b.location} ({b.distanceKm} km away)
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">Offer Price</span>
                      <span className="text-base font-black text-emerald-800">
                        {b.expectedPrice}
                      </span>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-2xl text-xs space-y-1 text-stone-700 border border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Crop Needed:</span>
                      <span className="font-bold text-stone-900">{b.cropRequired}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Required Quantity:</span>
                      <span className="font-semibold text-stone-900">{b.requiredQuantity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Minimum Order:</span>
                      <span className="font-semibold text-emerald-700">{b.minOrder}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${cleanPhoneForTel(b.contact)}`}
                    id={`call-buyer-${b.id}`}
                    onClick={(e) =>
                      handleServiceCallClick(e, {
                        title: 'Verified Buyer',
                        organization: b.name,
                        subtitle: `${b.location}, ${b.district} • Needs ${b.cropRequired}`,
                        contact: b.contact,
                        category: 'buyer',
                      })
                    }
                    className="call-btn flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold transition cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Call Buyer ({b.contact})</span>
                  </a>

                  <button
                    onClick={() => {
                      setEnquiryBuyer(b);
                      setEnquiryPrice(b.expectedPrice);
                    }}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs transition active:scale-95"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send Enquiry</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 2. FPOs TAB ---------------- */}
      {servicesSubTab === 'fpos' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
            <span className="text-xs font-bold text-stone-700 uppercase">District Filter:</span>
            <select
              value={fpoDistrictFilter}
              onChange={(e) => setFpoDistrictFilter(e.target.value)}
              className="p-2 rounded-xl border border-stone-300 text-xs font-semibold bg-stone-50"
            >
              <option value="all">All Districts</option>
              <option value="Guntur">Guntur</option>
              <option value="Krishna">Krishna</option>
              <option value="Khammam">Khammam</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {fpos.map((fpo) => (
              <div
                key={fpo.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-blue-400 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-800 bg-blue-100 px-2 py-0.5 rounded-full">
                        Registered FPO
                      </span>
                      <h3 className="text-lg font-black text-stone-900 mt-1">{fpo.name}</h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {fpo.location}, {fpo.district}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-bold bg-stone-100 text-stone-800 px-2 py-1 rounded-xl">
                      <Users className="w-3.5 h-3.5 text-blue-700" />
                      <span>{fpo.memberCount} Members</span>
                    </div>
                  </div>

                  <div className="text-xs text-stone-600 space-y-1">
                    <p>
                      <strong>Crops Handled:</strong> {fpo.cropsHandled.join(', ')}
                    </p>
                    <p>
                      <strong>Services:</strong> {fpo.services.join(' • ')}
                    </p>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center gap-2">
                  <a
                    href={`tel:${cleanPhoneForTel(fpo.contact)}`}
                    id={`call-fpo-${fpo.id}`}
                    onClick={(e) =>
                      handleServiceCallClick(e, {
                        title: 'FPO Officer',
                        organization: fpo.name,
                        subtitle: `${fpo.location}, ${fpo.district} • ${fpo.memberCount} Members`,
                        contact: fpo.contact,
                        category: 'fpo',
                      })
                    }
                    className="call-btn w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold shadow-xs transition cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call FPO ({fpo.contact})</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 3. COLD STORAGE TAB ---------------- */}
      {servicesSubTab === 'coldStorage' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3">
            <span className="text-xs font-bold text-stone-700 uppercase">Suitable For:</span>
            <select
              value={storageCropFilter}
              onChange={(e) => setStorageCropFilter(e.target.value)}
              className="p-2 rounded-xl border border-stone-300 text-xs font-semibold bg-stone-50"
            >
              <option value="all">All Crops</option>
              <option value="Tomato">Tomato</option>
              <option value="Chilli">Chilli</option>
              <option value="Potato">Potato</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {storages.map((cs) => (
              <div
                key={cs.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-cyan-400 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded-full">
                        Refrigerated Godown
                      </span>
                      <h3 className="text-lg font-black text-stone-900 mt-1">{cs.name}</h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        {cs.location}, {cs.district} ({cs.distanceKm} km)
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">Rental Rate</span>
                      <span className="text-sm font-black text-cyan-800">{cs.ratePerMonth}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-2xl text-xs border border-stone-100">
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">
                        Available Space
                      </span>
                      <span className="text-emerald-700 font-extrabold text-sm">
                        {cs.availableSpaceMT} MT Free
                      </span>
                    </div>
                    <div>
                      <span className="text-stone-400 block text-[10px] uppercase font-bold">
                        Total Capacity
                      </span>
                      <span className="text-stone-800 font-bold text-sm">
                        {cs.capacityMT} MT
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600">
                    <strong>Suitable For:</strong> {cs.suitableFor.join(', ')}
                  </p>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${cleanPhoneForTel(cs.contact)}`}
                    id={`call-storage-${cs.id}`}
                    onClick={(e) =>
                      handleServiceCallClick(e, {
                        title: 'Cold Storage Facility',
                        organization: cs.name,
                        subtitle: `${cs.location}, ${cs.district} • ${cs.availableSpaceMT} MT Available`,
                        contact: cs.contact,
                        category: 'storage',
                      })
                    }
                    className="call-btn flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold transition cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-cyan-700" />
                    <span>Call Facility ({cs.contact})</span>
                  </a>

                  <button
                    onClick={() => setStorageFacility(cs)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold shadow-xs transition active:scale-95"
                  >
                    <Snowflake className="w-3.5 h-3.5" />
                    <span>Request Storage</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- 4. LOGISTICS TAB ---------------- */}
      {servicesSubTab === 'logistics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {logistics.map((log) => (
              <div
                key={log.id}
                className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:border-lime-500 hover:shadow-md transition flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-lime-800 bg-lime-100 px-2 py-0.5 rounded-full">
                        {log.vehicle}
                      </span>
                      <h3 className="text-lg font-black text-stone-900 mt-1">
                        {log.provider}
                      </h3>
                      <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        Base: {log.location}, {log.district}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs text-stone-400 block">Per Km Rate</span>
                      <span className="text-base font-black text-lime-800">
                        ₹{log.perKmRate}/km
                      </span>
                    </div>
                  </div>

                  <div className="bg-stone-50 p-3 rounded-2xl text-xs space-y-1 text-stone-700 border border-stone-100">
                    <div className="flex justify-between">
                      <span className="text-stone-500">Payload Capacity:</span>
                      <span className="font-bold text-stone-900">{log.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Base Fare:</span>
                      <span className="font-bold text-stone-900">₹{log.estimatedCostBase}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-stone-500">Est. Trip Cost (40km):</span>
                      <span className="font-black text-emerald-800">
                        ₹{log.estimatedCostBase + 40 * log.perKmRate}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
                  <a
                    href={`tel:${cleanPhoneForTel(log.contact)}`}
                    id={`call-logistics-${log.id}`}
                    onClick={(e) =>
                      handleServiceCallClick(e, {
                        title: 'Transport Driver',
                        organization: log.provider,
                        subtitle: `${log.vehicle} (${log.capacity}) • Base: ${log.location}`,
                        contact: log.contact,
                        category: 'logistics',
                      })
                    }
                    className="call-btn flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-800 text-xs font-bold transition cursor-pointer"
                  >
                    <PhoneCall className="w-3.5 h-3.5 text-lime-700" />
                    <span>Call Driver ({log.contact})</span>
                  </a>

                  <button
                    onClick={() => setLogisticsProvider(log)}
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-lime-700 hover:bg-lime-800 text-white text-xs font-bold shadow-xs transition active:scale-95"
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>Book Truck</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------- MODALS ---------------- */}

      {/* 1. Buyer Enquiry Modal */}
      {enquiryBuyer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200">
            <h3 className="text-xl font-bold text-stone-900 mb-1">
              Send Trade Enquiry
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              To: {enquiryBuyer.name} ({enquiryBuyer.location})
            </p>

            <form onSubmit={handleSubmitEnquiry} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Crop Name
                </label>
                <input
                  type="text"
                  readOnly
                  value={enquiryBuyer.cropRequired}
                  className="w-full p-2.5 rounded-xl bg-stone-100 border border-stone-200 text-sm font-semibold text-stone-800"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Your Quantity
                  </label>
                  <input
                    type="text"
                    value={enquiryQuantity}
                    onChange={(e) => setEnquiryQuantity(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Offered Price
                  </label>
                  <input
                    type="text"
                    value={enquiryPrice}
                    onChange={(e) => setEnquiryPrice(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Message / Quality Note
                </label>
                <textarea
                  rows={2}
                  value={enquiryMsg}
                  onChange={(e) => setEnquiryMsg(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEnquiryBuyer(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-stone-300 text-sm font-bold text-stone-700"
                >
                  {t('cancel')}
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-sm font-bold shadow-sm"
                >
                  Confirm Enquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. Cold Storage Reservation Modal */}
      {storageFacility && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200">
            <h3 className="text-xl font-bold text-stone-900 mb-1">
              Reserve Cold Storage
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Facility: {storageFacility.name}
            </p>

            <form onSubmit={handleSubmitStorage} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Quantity (Metric Tonnes)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={storageQty}
                    onChange={(e) => setStorageQty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Duration (Months)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="12"
                    value={storageMonths}
                    onChange={(e) => setStorageMonths(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Preferred Inward Date
                </label>
                <input
                  type="date"
                  value={storageDate}
                  onChange={(e) => setStorageDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-sm font-semibold"
                />
              </div>

              <div className="p-3 bg-cyan-50 rounded-xl text-xs text-cyan-900 border border-cyan-200">
                Rate: {storageFacility.ratePerMonth} • Free insurance inspection included
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  id="pay-storage-deposit-btn"
                  onClick={() => {
                    openPaymentModal({
                      title: `Cold Storage Deposit: ${storageFacility.name}`,
                      description: `Reservation Token for ${storageQty} MT space (${storageMonths} Months)`,
                      amount: 500,
                      category: 'cold_storage_deposit',
                      relatedEntityId: storageFacility.id,
                      itemDetails: {
                        facility: storageFacility.name,
                        quantity: `${storageQty} MT`,
                        months: storageMonths,
                      },
                      onSuccess: () => {
                        handleSubmitStorage({ preventDefault: () => {} } as any);
                      },
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Reserve Slot & Pay ₹500 Token Deposit (Agri-Pay)</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setStorageFacility(null)}
                    className="w-1/2 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 rounded-xl bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold shadow-sm"
                  >
                    Request Without Advance
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 3. Transport Booking Modal */}
      {logisticsProvider && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-stone-200">
            <h3 className="text-xl font-bold text-stone-900 mb-1">
              Book Farm-Gate Vehicle
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Vehicle: {logisticsProvider.vehicle} • {logisticsProvider.provider}
            </p>

            <form onSubmit={handleSubmitTransport} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Farm Pickup Location
                </label>
                <input
                  type="text"
                  value={pickupLoc}
                  onChange={(e) => setPickupLoc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Destination Mandi / Hub
                </label>
                <input
                  type="text"
                  value={destLoc}
                  onChange={(e) => setDestLoc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Crop & Quantity
                  </label>
                  <input
                    type="text"
                    value={transportQty}
                    onChange={(e) => setTransportQty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Distance (Km)
                  </label>
                  <input
                    type="number"
                    value={transportDist}
                    onChange={(e) => setTransportDist(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 text-xs font-semibold"
                  />
                </div>
              </div>

              <div className="p-3 bg-lime-50 rounded-xl text-xs text-lime-900 border border-lime-200 flex justify-between items-center">
                <span>Estimated Trip Fare:</span>
                <span className="text-base font-extrabold text-lime-950">
                  ₹{logisticsProvider.estimatedCostBase + Number(transportDist) * logisticsProvider.perKmRate}
                </span>
              </div>

              <div className="flex flex-col gap-2 pt-2">
                <button
                  type="button"
                  id="pay-transport-token-btn"
                  onClick={() => {
                    const estFare = logisticsProvider.estimatedCostBase + Number(transportDist) * logisticsProvider.perKmRate;
                    openPaymentModal({
                      title: `Transport Booking: ${logisticsProvider.provider}`,
                      description: `${logisticsProvider.vehicle} • ${transportCrop} (${transportQty}) • ${transportDist} km`,
                      amount: 600,
                      category: 'transport_booking',
                      relatedEntityId: logisticsProvider.id,
                      itemDetails: {
                        vehicle: logisticsProvider.vehicle,
                        distanceKm: transportDist,
                        estimatedTotal: estFare,
                      },
                      onSuccess: () => {
                        handleSubmitTransport({ preventDefault: () => {} } as any);
                      },
                    });
                  }}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Confirm & Pay ₹600 Driver Token Advance (Agri-Pay)</span>
                </button>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setLogisticsProvider(null)}
                    className="w-1/2 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
                  >
                    {t('cancel')}
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 py-2 rounded-xl bg-lime-700 hover:bg-lime-800 text-white text-xs font-bold shadow-sm"
                  >
                    Book with Cash on Delivery
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* 4. Desktop Fallback Call Modal */}
      <ServiceCallModal
        contactInfo={activeCallModal}
        onClose={() => setActiveCallModal(null)}
      />
    </div>
  );
};
