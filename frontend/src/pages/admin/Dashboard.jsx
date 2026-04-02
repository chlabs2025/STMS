import { useState, useEffect, useCallback } from 'react';
import {
  MdAdd,
  MdSettings,
  MdInventory,
  MdTrendingUp,
  MdDownload,
  MdAutoAwesome
} from 'react-icons/md';
import api from "../../api/axios";
import API from "../../api/endpoints";
import { useLang } from '../../context/LanguageContext';
import T from '../../i18n/T';
import ExcelExport from './ExcelExport';
import { CardSkeleton } from '../../components/Skeletons';
import TrendChart from '../../components/dashboard/TrendChart';
import DistributionChart from '../../components/dashboard/DistributionChart';
import RecentActivity from '../../components/dashboard/RecentActivity';

const Dashboard = ({ onPageChange }) => {
  const { lang } = useLang();
  const [dashboardStats, setDashboardStats] = useState({
    rawImli: 0,
    cleaned: 0,
  });
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [localsRes, rawImliRes] = await Promise.all([
        api.get(API.GET_LOCALS),
        api.get(API.GET_RAW_IMLI)
      ]);

      let inProgressCleaned = 0;
      if (localsRes.data && localsRes.data.data) {
        const locals = localsRes.data.data;
        inProgressCleaned = locals.reduce((acc, local) => acc + (local.totalReturnedQuantity || 0), 0);
      }

      const rawImli = rawImliRes.data?.data?.rawImliQuantity || 0;
      const historicalCleaned = rawImliRes.data?.data?.totalCleanedImli || 0;

      setDashboardStats({
        rawImli,
        cleaned: historicalCleaned + inProgressCleaned,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      if (isInitial) setLoading(false);
    }
  }, []);

  const fetchActivities = useCallback(async () => {
    try {
      const response = await api.get(API.RECENT_ACTIVITY);
      if (response.data && response.data.data) {
        setActivities(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData(true);
    fetchActivities();
    const intervalId = setInterval(() => {
      fetchDashboardData(false);
      fetchActivities();
    }, 10000); // Poll every 10 seconds for real-time updates
    return () => clearInterval(intervalId);
  }, [fetchDashboardData, fetchActivities]);

  const stats = [
    { id: 1, title: "Raw Imli", value: dashboardStats.rawImli, unit: "KG", icon: MdInventory, color: "orange" },
    { id: 2, title: "Cleaned Imli", value: dashboardStats.cleaned, unit: "KG", icon: MdAutoAwesome, color: "green" },
  ];

  const colorMap = {
    orange: { bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-100" },
    green:  { bg: "bg-green-50",  text: "text-green-500",  border: "border-green-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-500", border: "border-purple-100" },
    amber:  { bg: "bg-amber-50",  text: "text-amber-500",  border: "border-amber-100" },
  };

  const actions = [
    { key: 'addRawImli', label: "Add Raw Imli Stock", icon: MdAdd, color: "orange" },
    { key: 'assignImli', label: "Assign Imli", icon: MdSettings, color: "purple" },
    { key: 'imliReturned', label: "Imli Cleaned", icon: MdInventory, color: "green" },
  ];



  return (
    <div className="min-h-full bg-gray-50 py-6 px-4 md:p-8 overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        
        {/* ── Top Section (Stats row + Quick Actions row) ── */}
        <div className="flex flex-col gap-6 md:gap-8">

          {/* Stats Row — 2 cards side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {loading ? (
              Array.from({ length: 2 }).map((_, i) => <CardSkeleton key={`skeleton-${i}`} />)
            ) : (
              stats.map((stat, idx) => {
                const c = colorMap[stat.color];
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.id}
                    className={`bg-white rounded-2xl py-6 px-5 md:py-10 md:px-8 border ${c.border} flex flex-col justify-between transition-all duration-200 hover:shadow-md relative overflow-hidden animate-card-enter animate-delay-${idx + 1}`}
                  >
                    {/* Subtle aesthetic background accent */}
                    <div className={`absolute -right-4 -top-4 w-24 h-24 ${c.bg} opacity-20 rounded-full blur-2xl`} />

                    <div className={`${c.bg} p-2 rounded-lg shrink-0 absolute top-4 md:top-6 ${lang === 'ur' ? 'left-4 md:left-6' : 'right-4 md:right-6'} z-10`}>
                      <Icon className={`${c.text} text-lg md:text-xl`} />
                    </div>

                    <p className={`text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider leading-snug mb-auto z-10 ${lang === 'ur' ? 'urdu-ui text-right pl-10' : 'pr-10'}`}>
                      <T k={stat.title} />
                    </p>

                    <p className={`text-4xl md:text-7xl font-extrabold ${c.text} tracking-tight leading-none mt-4 md:mt-6 z-10 ${lang === 'ur' ? 'text-right' : ''}`}>
                      <span className="text-[110%] inline-block align-middle">{stat.value}</span>
                      <span className={`text-[9px] md:text-base font-sans font-normal text-gray-400 align-baseline ${lang === 'ur' ? 'mr-1' : 'ml-1'}`}>{stat.unit}</span>
                    </p>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Actions — full width, buttons horizontal on desktop */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm">
            <h3 className={`text-xs md:text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 ${lang === 'ur' ? 'urdu-ui text-right' : ''}`}>
              <T k="Quick Actions" />
            </h3>

            <div className="flex flex-col lg:flex-row gap-3">
              {actions.map((action) => {
                const c = colorMap[action.color];
                const Icon = action.icon;
                return (
                  <button
                    key={action.key}
                    onClick={() => onPageChange && onPageChange(action.key)}
                    className={`group flex items-center gap-4 lg:flex-1 p-3.5 md:p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all outline-none active:scale-[0.98] ${lang === 'ur' ? 'flex-row-reverse text-right' : 'text-left'}`}
                  >
                    <div className={`${c.bg} p-2.5 rounded-lg shrink-0 group-hover:scale-110 transition-transform`}>
                      <Icon className={`${c.text} text-xl`} />
                    </div>
                    <span className={`font-semibold text-gray-700 text-sm md:text-[15px] ${lang === 'ur' ? 'urdu-ui text-right flex-1' : ''}`}>
                      <T k={action.label} />
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-100">
              <ExcelExport />
            </div>
          </div>
        </div>

        {/* ── Middle Row (Trend Chart) ── */}
        <div className="grid grid-cols-1 gap-6">
          <TrendChart />
        </div>

        {/* ── Bottom Row (Distribution + Activity) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          <DistributionChart stats={dashboardStats} />
          <RecentActivity activities={activities} onPageChange={onPageChange} />
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
