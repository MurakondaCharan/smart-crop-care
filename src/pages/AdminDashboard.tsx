import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Users,
  Camera,
  Activity,
  Handshake,
  Snowflake,
  Truck,
  TrendingUp,
  ShieldCheck,
  Clock,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAdminStats()
      .then((res) => {
        if (res.success) setStats(res.stats);
      })
      .catch((err) => console.warn(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-8 text-center text-stone-500">
        Loading agricultural administration metrics...
      </div>
    );
  }

  const statCards = [
    { title: 'Total Farmers', value: stats.totalFarmers.toLocaleString(), icon: Users, color: 'text-emerald-700 bg-emerald-100' },
    { title: 'Crop Diagnoses', value: stats.cropDiagnoses.toLocaleString(), icon: Camera, color: 'text-blue-700 bg-blue-100' },
    { title: 'Buyer Enquiries', value: stats.marketEnquiries.toLocaleString(), icon: Handshake, color: 'text-teal-700 bg-teal-100' },
    { title: 'Cold Storage Holds', value: stats.storageRequests.toLocaleString(), icon: Snowflake, color: 'text-cyan-700 bg-cyan-100' },
    { title: 'Logistics Bookings', value: stats.logisticsRequests.toLocaleString(), icon: Truck, color: 'text-lime-700 bg-lime-100' },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Title */}
      <div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider bg-stone-800 text-white px-2.5 py-0.5 rounded-full">
            Admin System Console
          </span>
          <span className="text-xs text-stone-500">Live Telemetry & Diagnostics</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-stone-900 mt-1">
          Smart Crop Care Administrative Overview
        </h1>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {statCards.map((card, i) => {
          const Icon = card.icon;
          return (
            <div key={i} className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
              <div className={`w-9 h-9 rounded-xl ${card.color} flex items-center justify-center mb-3`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs text-stone-500 font-medium block">{card.title}</span>
              <span className="text-2xl font-black text-stone-900 mt-0.5 block">{card.value}</span>
            </div>
          );
        })}
      </div>

      {/* Common Plant Pathology Diseases Breakdown */}
      <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
        <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
          <Activity className="w-5 h-5 text-emerald-700" />
          <span>Prevalent Crop Diseases in Region</span>
        </h3>

        <div className="space-y-3">
          {stats.commonDiseases.map((d: any, idx: number) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-stone-700">
                <span>{d.name}</span>
                <span>{d.count} cases ({d.percentage}%)</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-emerald-600 rounded-full"
                  style={{ width: `${d.percentage * 2}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Enquiries and Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
            <Handshake className="w-5 h-5 text-teal-700" />
            <span>Recent Market Enquiries</span>
          </h3>

          <div className="divide-y divide-stone-100 text-xs">
            {stats.recentEnquiries.map((enq: any) => (
              <div key={enq.id} className="py-2.5 flex justify-between items-start">
                <div>
                  <span className="font-bold text-stone-900 block">{enq.buyerName}</span>
                  <span className="text-stone-500">
                    Farmer: {enq.farmerName} • {enq.crop} ({enq.quantity})
                  </span>
                </div>
                <span className="bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                  {enq.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-extrabold text-stone-900 text-base flex items-center gap-2">
            <Truck className="w-5 h-5 text-lime-700" />
            <span>Recent Logistics Dispatches</span>
          </h3>

          <div className="divide-y divide-stone-100 text-xs">
            {stats.recentTransportRequests.map((tr: any) => (
              <div key={tr.id} className="py-2.5 flex justify-between items-start">
                <div>
                  <span className="font-bold text-stone-900 block">{tr.providerName} ({tr.vehicle})</span>
                  <span className="text-stone-500">
                    To: {tr.destination} • Fare: ₹{tr.estimatedCost}
                  </span>
                </div>
                <span className="bg-lime-100 text-lime-800 px-2 py-0.5 rounded-full font-bold text-[10px]">
                  {tr.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
