import React, { useEffect, useState } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { MarketPrice } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Filter,
  ArrowRight,
  ShieldCheck,
  RefreshCw,
  Building,
} from 'lucide-react';

export const MarketPricesPage: React.FC = () => {
  const { t, setActiveTab, setServicesSubTab, updateJourney } = useApp();

  const [prices, setPrices] = useState<MarketPrice[]>([]);
  const [stats, setStats] = useState({ lowestPrice: 0, highestPrice: 0, averagePrice: 0 });
  const [selectedCrop, setSelectedCrop] = useState('all');
  const [selectedState, setSelectedState] = useState('all');
  const [selectedDistrict, setSelectedDistrict] = useState('all');
  const [selectedMarket, setSelectedMarket] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  const loadPrices = async () => {
    setIsLoading(true);
    try {
      const res = await api.getMarketPrices({
        crop: selectedCrop,
        state: selectedState,
        district: selectedDistrict,
        market: selectedMarket,
      });
      setPrices(res.data);
      setStats(res.stats);
    } catch (e) {
      console.warn('Failed to load market prices:', e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadPrices();
  }, [selectedCrop, selectedState, selectedDistrict, selectedMarket]);

  const handleProceedToBuyers = () => {
    updateJourney({ currentStep: 5 });
    setActiveTab('services');
    setServicesSubTab('buyers');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Title & APMC Verified Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black text-stone-900">
              {t('marketPageTitle')}
            </h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3.5 h-3.5" />
              Verified APMC Data
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Real-time daily mandi trading wholesale benchmarks for farmers
          </p>
        </div>

        <button
          id="sell-to-buyers-shortcut-btn"
          onClick={handleProceedToBuyers}
          className="flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-5 py-3 rounded-2xl shadow-md transition active:scale-95 text-xs sm:text-sm whitespace-nowrap self-start sm:self-auto"
        >
          <span>{t('sellToBuyers')}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* 3 KPI Stats Cards */}
      <div className="grid grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs text-center">
          <span className="text-[11px] sm:text-xs font-bold uppercase text-stone-500 block">
            {t('lowestPrice')}
          </span>
          <span className="text-lg sm:text-3xl font-black text-stone-800 mt-1 block">
            ₹{stats.lowestPrice}
          </span>
          <span className="text-[10px] text-stone-400">per Quintal / kg</span>
        </div>

        <div className="bg-emerald-50 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-emerald-200 shadow-xs text-center">
          <span className="text-[11px] sm:text-xs font-bold uppercase text-emerald-800 block">
            {t('averagePrice')}
          </span>
          <span className="text-lg sm:text-3xl font-black text-emerald-800 mt-1 block">
            ₹{stats.averagePrice}
          </span>
          <span className="text-[10px] text-emerald-600">Benchmark mean</span>
        </div>

        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs text-center">
          <span className="text-[11px] sm:text-xs font-bold uppercase text-stone-500 block">
            {t('highestPrice')}
          </span>
          <span className="text-lg sm:text-3xl font-black text-emerald-700 mt-1 block">
            ₹{stats.highestPrice}
          </span>
          <span className="text-[10px] text-stone-400">Peak mandi rate</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-stone-700">
          <Filter className="w-4 h-4 text-emerald-700" />
          <span>Filter Mandi Prices</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* Crop */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              {t('crop')}
            </label>
            <select
              value={selectedCrop}
              onChange={(e) => setSelectedCrop(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold bg-stone-50 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Crops (అన్ని పంటలు)</option>
              <option value="Tomato">Tomato (టమాట)</option>
              <option value="Chilli">Chilli (మిర్చి)</option>
              <option value="Paddy">Paddy / Rice (వరి)</option>
              <option value="Cotton">Cotton (ప్రత్తి)</option>
              <option value="Potato">Potato (ఆలూ)</option>
            </select>
          </div>

          {/* State */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              {t('state')}
            </label>
            <select
              value={selectedState}
              onChange={(e) => {
                setSelectedState(e.target.value);
                setSelectedDistrict('all');
              }}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold bg-stone-50 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">All States</option>
              <option value="Andhra Pradesh">Andhra Pradesh</option>
              <option value="Telangana">Telangana</option>
            </select>
          </div>

          {/* District */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              {t('district')}
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold bg-stone-50 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Districts</option>
              <option value="Guntur">Guntur</option>
              <option value="Krishna">Krishna</option>
              <option value="Chittoor">Chittoor</option>
              <option value="Kurnool">Kurnool</option>
              <option value="Warangal">Warangal</option>
              <option value="Khammam">Khammam</option>
              <option value="Rangareddy">Rangareddy</option>
            </select>
          </div>

          {/* Market */}
          <div>
            <label className="block text-[11px] font-bold text-stone-600 mb-1">
              {t('market')}
            </label>
            <select
              value={selectedMarket}
              onChange={(e) => setSelectedMarket(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm font-semibold bg-stone-50 focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            >
              <option value="all">All Mandis</option>
              <option value="Guntur">Guntur APMC</option>
              <option value="Madanapalle">Madanapalle Market</option>
              <option value="Vijayawada">Vijayawada Yard</option>
              <option value="Bowenpally">Bowenpally Yard</option>
              <option value="Warangal">Warangal Mandi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Prices List: Desktop Table + Mobile Cards */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-200 text-[11px] font-black uppercase tracking-wider text-stone-500">
                <th className="p-4">{t('crop')}</th>
                <th className="p-4">{t('market')}</th>
                <th className="p-4">{t('district')} / State</th>
                <th className="p-4">{t('price')}</th>
                <th className="p-4">{t('unit')}</th>
                <th className="p-4">{t('trend')}</th>
                <th className="p-4">{t('updated')}</th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 text-sm">
              {prices.map((item) => {
                const isUp = item.trend === 'up';
                const isDown = item.trend === 'down';
                return (
                  <tr key={item.id} className="hover:bg-emerald-50/40 transition">
                    <td className="p-4 font-bold text-stone-900">{item.crop}</td>
                    <td className="p-4 font-semibold text-stone-800 flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-emerald-700 shrink-0" />
                      <span>{item.market}</span>
                    </td>
                    <td className="p-4 text-stone-600 text-xs">
                      {item.district}, {item.state}
                    </td>
                    <td className="p-4 font-black text-emerald-800 text-base">
                      ₹{item.price}
                    </td>
                    <td className="p-4 text-stone-500 text-xs">{item.unit}</td>
                    <td className="p-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                          isUp
                            ? 'bg-emerald-100 text-emerald-800'
                            : isDown
                            ? 'bg-rose-100 text-rose-800'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {isUp && <TrendingUp className="w-3.5 h-3.5" />}
                        {isDown && <TrendingDown className="w-3.5 h-3.5" />}
                        {!isUp && !isDown && <Minus className="w-3.5 h-3.5" />}
                        <span>{item.trend}</span>
                      </span>
                    </td>
                    <td className="p-4 text-stone-500 text-xs">{item.updatedAt}</td>
                    <td className="p-4 text-right">
                      <button
                        onClick={handleProceedToBuyers}
                        className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-xs transition active:scale-95"
                      >
                        Sell Crop
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards View */}
        <div className="md:hidden divide-y divide-stone-100">
          {prices.map((item) => {
            const isUp = item.trend === 'up';
            const isDown = item.trend === 'down';
            return (
              <div key={item.id} className="p-4 space-y-2">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-sm">
                      {item.crop}
                    </span>
                    <h3 className="font-extrabold text-stone-900 text-base mt-1">
                      {item.market}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {item.district}, {item.state}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-xl font-black text-emerald-800 block">
                      ₹{item.price}
                    </span>
                    <span className="text-[11px] text-stone-500">{item.unit}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-stone-50 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isUp
                          ? 'bg-emerald-100 text-emerald-800'
                          : isDown
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-100 text-stone-700'
                      }`}
                    >
                      {isUp && <TrendingUp className="w-3 h-3" />}
                      {isDown && <TrendingDown className="w-3 h-3" />}
                      {!isUp && !isDown && <Minus className="w-3 h-3" />}
                      <span>{item.trend}</span>
                    </span>
                    <span className="text-stone-400">{item.updatedAt}</span>
                  </div>

                  <button
                    onClick={handleProceedToBuyers}
                    className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
                  >
                    Sell Crop
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
