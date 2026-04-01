import { useState, useEffect, useCallback } from 'react';
import {
  MdAdd,
  MdSettings,
  MdInventory,
  MdTrendingUp,
  MdRepeat,
  MdDownload,
  MdGroup,
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
    distributed: 0,
    cleaned: 0,
    pending: 0
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

      let distributed = 0, inProgressCleaned = 0;
      if (localsRes.data && localsRes.data.data) {
        const locals = localsRes.data.data;
        distributed = locals.reduce((acc, local) => acc + (local.totalAssignedQuantity || 0), 0);
        inProgressCleaned = locals.reduce((acc, local) => acc + (local.totalReturnedQuantity || 0), 0);
      }

      const rawImli = rawImliRes.data?.data?.rawImliQuantity || 0;
      const historicalCleaned = rawImliRes.data?.data?.totalCleanedImli || 0;

      setDashboardStats({
        rawImli,
        distributed,
        cleaned: historicalCleaned + inProgressCleaned,
        pending: distributed - inProgressCleaned
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
    { id: 3, title: "Distributed Imli to Locals", value: dashboardStats.distributed, unit: "KG", icon: MdGroup, color: "purple" },
    { id: 4, title: "Pending Imli to be returned", value: dashboardStats.pending, unit: "KG", icon: MdRepeat, color: "amber" },
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

  // Inventory summary data
  const totalStock = dashboardStats.rawImli + dashboardStats.distributed;
  const summaryItems = [
    { label: "Raw Stock", value: dashboardStats.rawImli, total: totalStock || 1, color: "#ea580c" },
    { label: "Cleaned", value: dashboardStats.cleaned, total: totalStock || 1, color: "#16a34a" },
    { label: "Distributed", value: dashboardStats.distributed, total: totalStock || 1, color: "#7c3aed" },
    { label: "Pending Return", value: dashboardStats.pending, total: totalStock || 1, color: "#d97706" },
  ];

  return (
    <div className="min-h-full bg-gray-50 py-6 px-4 md:p-8 overflow-y-auto">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">
        
        {/* ── Top Row (Stats + Quick Actions) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 xl:gap-10">
          
          {/* Stats Section (Left: 2 Columns) */}
          <div className="lg:col-span-2 flex flex-col">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6 h-full">
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => <CardSkeleton key={`skeleton-${i}`} />)
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
              }))}
            </div>
          </div>

          {/* Quick Actions (Right: 1 Column) */}
          <div className="bg-white border border-gray-150 rounded-2xl p-6 md:p-8 shadow-sm flex flex-col self-stretch">
            <h3 className={`text-xs md:text-sm font-bold text-gray-800 uppercase tracking-widest mb-6 ${lang === 'ur' ? 'urdu-ui text-right' : ''}`}>
              <T k="Quick Actions" />
            </h3>
            
            <div className="flex flex-col gap-3 flex-1 justify-start">
              {actions.map((action) => {
                const c = colorMap[action.color];
                const Icon = action.icon;
                return (
                  <button
                    key={action.key}
                    onClick={() => onPageChange && onPageChange(action.key)}
                    className={`group flex items-center gap-4 w-full p-3.5 md:p-4 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all outline-none active:scale-[0.98] ${lang === 'ur' ? 'flex-row-reverse text-right' : 'text-left'}`}
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

            <div className="mt-6 pt-6 border-t border-gray-100 shrink-0">
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
