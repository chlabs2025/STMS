import { useState, useEffect, useCallback } from 'react';
import {
  MdAdd,
  MdSettings,
  MdInventory,
  MdTrendingUp,
  MdDownload,
  MdAutoAwesome,
  MdAccountBalanceWallet,
  MdChevronRight,
  MdAssignmentInd
} from 'react-icons/md';
import api from "../../api/axios";
import API from "../../api/endpoints";
import { useLang } from '../../context/LanguageContext';
import T from '../../i18n/T';
import ExcelExport from './ExcelExport';
import { CardSkeleton } from '../../components/Skeletons';


const Dashboard = ({ onPageChange }) => {
  const { lang } = useLang();
  const [dashboardStats, setDashboardStats] = useState({
    rawImli: 0,
    cleaned: 0,
    paymentDue: 0,
    distributedImli: 0,
  });
  const [activities, setActivities] = useState([]);
  const [localsData, setLocalsData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async (isInitial = false) => {
    if (isInitial) setLoading(true);
    try {
      const [rawImliRes, vendorsRes, localsRes] = await Promise.all([
        api.get(API.GET_RAW_IMLI),
        api.get(API.GET_VENDORS),
        api.post(API.GET_LOCALS)
      ]);

      const rawImli = rawImliRes.data?.data?.rawImliQuantity || 0;
      const totalCleaned = Math.max(0, rawImliRes.data?.data?.totalCleanedImli || 0);

      const vendors = vendorsRes.data?.data || [];
      const paymentDue = vendors.reduce((acc, vendor) => {
        const balance = (vendor.totalDebt || 0) - (vendor.totalPaid || 0);
        return acc + (balance > 0 ? balance : 0);
      }, 0);

      const locals = localsRes.data?.data || [];
      setLocalsData(locals);
      const distributedImli = locals.reduce((acc, local) => acc + Math.max(0, local.totalAssignedQuantity || 0), 0);

      setDashboardStats({
        rawImli,
        cleaned: totalCleaned,
        paymentDue,
        distributedImli,
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
    { id: 1, title: "Raw Imli", value: dashboardStats.rawImli, unit: "KG", icon: MdInventory, color: "orange", page: "addRawImli" },
    { id: 2, title: "Distributed Imli", value: dashboardStats.distributedImli, unit: "KG", icon: MdTrendingUp, color: "purple", page: "assignImli" },
    { id: 3, title: "Cleaned Imli", value: dashboardStats.cleaned, unit: "KG", icon: MdAutoAwesome, color: "green", page: "addCleanedImli" },
    { id: 4, title: "Vendor Payment Due", value: dashboardStats.paymentDue ? dashboardStats.paymentDue.toLocaleString() : 0, unit: "₹", icon: MdAccountBalanceWallet, color: "red", page: "vendors" },
  ];

  const colorMap = {
    orange: { bg: "bg-orange-50", text: "text-orange-500", border: "border-orange-100" },
    green: { bg: "bg-green-50", text: "text-green-500", border: "border-green-100" },
    purple: { bg: "bg-purple-50", text: "text-purple-500", border: "border-purple-100" },
    amber: { bg: "bg-amber-50", text: "text-amber-500", border: "border-amber-100" },
    red: { bg: "bg-red-50", text: "text-red-500", border: "border-red-100" },
  };

  const actions = [
    { key: 'addRawImli', label: "Add Raw Imli", desc: "Add new stock from vendors", icon: MdAdd, color: "orange" },
    { key: 'assignImli', label: "Assign Imli", desc: "Distribute raw imli to locals", icon: MdSettings, color: "purple" },
    { key: 'imliReturned', label: "Imli Cleaned", desc: "Receive cleaned imli back", icon: MdInventory, color: "green" },
    { key: 'payment', label: "Payments", desc: "Manage system payments", icon: MdAccountBalanceWallet, color: "amber" },
  ];



  const recentLocals = Array.from(new Map(
    activities
      .filter(a => a.localName)
      .map(a => {
        const local = localsData.find(l => l.LocalName === a.localName);
        return [a.localName, local];
      })
  ).values()).filter(Boolean).slice(0, 5);

  return (
    <div className="bg-gray-50 p-3 md:p-6">
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-6 md:gap-8">

        {/* ── Top Section (Stats row + Quick Actions row) ── */}
        <div className="flex flex-col gap-6 md:gap-8">

          {/* Stats Row — 2 cards per row on mobile, 4 on desktop */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, idx) => {
              const c = colorMap[stat.color];
              return (
                <div
                  key={stat.id}
                  className={`bg-white rounded-xl p-4 md:p-6 border border-gray-100 flex flex-col justify-center transition-all duration-200 hover:shadow-sm`}
                >
                  <p className={`text-xs md:text-sm text-gray-500 font-medium mb-2 md:mb-3 ${lang === 'ur' ? 'urdu-ui text-right' : ''}`}>
                    <T k={stat.title} />
                  </p>

                  <div className={`${lang === 'ur' ? 'text-right' : ''}`}>
                    {loading ? (
                      <div className="h-8 md:h-10 w-16 bg-gray-200 rounded animate-pulse inline-block"></div>
                    ) : (
                      <p className={`text-2xl md:text-3xl font-bold ${c.text} tracking-tight`}>
                        {stat.unit === '₹' && '₹'}
                        {stat.value}
                        {stat.unit !== '₹' && <span className="text-xs md:text-sm ml-1 font-normal text-gray-500">{stat.unit}</span>}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Quick Actions — directly on background */}
          <div className="mt-2 md:mt-4">
            <div className="flex justify-between items-center mb-4 md:mb-5 px-1">
              <h3 className={`text-lg md:text-xl font-bold text-gray-800 ${lang === 'ur' ? 'urdu-ui text-right' : ''}`}>
                <T k="Quick Actions" />
              </h3>
              <ExcelExport />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {actions.map((action) => {
                const c = colorMap[action.color];
                const Icon = action.icon;
                return (
                  <button
                    key={action.key}
                    onClick={() => onPageChange && onPageChange(action.key)}
                    className="group flex flex-col p-4 bg-white border border-gray-100 rounded-xl hover:border-gray-200 hover:shadow-sm transition-all outline-none active:scale-[0.98] text-left"
                  >
                    <div className="w-full flex justify-between items-start mb-4">
                      <div className={`${c.bg} p-2 rounded-lg shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`${c.text} text-lg md:text-xl`} />
                      </div>
                      <MdChevronRight className="text-gray-300 text-lg group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="w-full">
                      <h4 className="font-semibold text-gray-800 text-xs md:text-sm mb-1 line-clamp-1">
                        <T k={action.label} />
                      </h4>
                      <p className="text-[10px] md:text-xs text-gray-500 leading-tight line-clamp-2">
                        <T k={action.desc} />
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>



        {/* ── Bottom Row (System Logs & History) ── */}
        <div>
          <h3 className={`text-lg md:text-xl font-bold text-gray-800 px-1 mb-4 md:mb-5 ${lang === 'ur' ? 'urdu-ui text-right' : ''}`}>
            <T k="System Logs & History" />
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {/* Raw Imli Log */}
            <button
              onClick={() => onPageChange && onPageChange('addRawImli')}
              className="group flex items-center justify-between p-4 md:p-5 bg-white border border-gray-100 rounded-xl hover:border-orange-300 hover:shadow-sm transition-all active:scale-[0.98] outline-none h-full w-full"
            >
              <div className="flex items-center gap-3 md:gap-4">
                <div className="p-2.5 md:p-3 bg-orange-50 rounded-lg group-hover:scale-110 transition-transform">
                  <MdInventory className="text-orange-600 text-lg md:text-xl" />
                </div>
                <div className="text-left">
                  <h4 className="font-semibold text-gray-800 text-sm md:text-base mb-0.5"><T k="Raw Imli Logs" /></h4>
                  <p className="text-[10px] md:text-xs text-gray-500"><T k="View incoming raw imli history" /></p>
                </div>
              </div>
              <MdChevronRight className="text-gray-300 text-xl group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Recent Local Activity */}
            <div className="flex flex-row items-center justify-between p-4 md:p-5 bg-white border border-gray-100 rounded-xl hover:border-purple-300 transition-all h-full w-full">
              {/* Left Side: Title */}
              <div className="flex flex-col flex-shrink-0 mr-2 md:mr-6">
                 <h4 className="font-semibold text-gray-800 text-sm md:text-base mb-0.5 whitespace-nowrap"><T k="Recent Activity" /></h4>
                 <p className="text-[10px] md:text-xs text-gray-500 whitespace-nowrap"><T k="Active locals" /></p>
              </div>

              {/* Middle: Circles (Scrollable) */}
              <div className="flex flex-row items-center gap-3 md:gap-4 overflow-x-auto flex-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden px-2">
                 {recentLocals.map(local => (
                    <button
                      key={local._id}
                      onClick={() => onPageChange && onPageChange('localsProfile', { prefilledLocalId: local.LocalID })}
                      className="group flex flex-col items-center gap-1 outline-none flex-shrink-0"
                    >
                      <div className="w-10 h-10 md:w-11 md:h-11 rounded-full border border-purple-100 bg-purple-50 flex items-center justify-center text-purple-600 font-semibold text-sm md:text-base group-hover:border-purple-300 group-hover:bg-purple-100 transition-all shadow-sm">
                         {(local.LocalName || "U").charAt(0).toUpperCase()}
                      </div>
                      <span className="text-[9px] md:text-[10px] font-medium text-gray-500 max-w-[48px] truncate text-center">
                         {local.LocalName.split(' ')[0]}
                      </span>
                    </button>
                 ))}
                 {recentLocals.length === 0 && !loading && (
                   <p className="text-[10px] md:text-xs text-gray-400 italic">No recent activity</p>
                 )}
                 {loading && recentLocals.length === 0 && (
                   <div className="flex flex-row gap-3 md:gap-4">
                      {[1, 2, 3].map(i => (
                         <div key={i} className="flex flex-col items-center gap-1">
                            <div className="w-10 h-10 md:w-11 md:h-11 rounded-full bg-gray-200 animate-pulse"></div>
                            <div className="h-1.5 w-8 bg-gray-200 rounded animate-pulse"></div>
                         </div>
                      ))}
                   </div>
                 )}
              </div>

              {/* Right: View All Button */}
              <button onClick={() => onPageChange && onPageChange('auditLogs')} className="text-purple-600 text-[10px] md:text-xs font-semibold hover:underline whitespace-nowrap ml-2 md:ml-4 flex-shrink-0">
                <span className="hidden md:inline">View All Logs</span>
                <span className="md:hidden">View All</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

