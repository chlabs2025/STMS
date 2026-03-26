import { useState, useEffect } from 'react';
import {
  MdAdd,
  MdSettings,
  MdInventory
} from 'react-icons/md';
import api from "../../api/axios";
import SackEntry from './SackEntry';
import { t } from '../../i18n/translations';
import { useLang } from '../../context/LanguageContext';
import T from '../../i18n/T';
import ExcelExport from './ExcelExport';

const Dashboard = ({ navigateToAssignImli, onPageChange }) => {
  const { lang } = useLang();
  const [dashboardStats, setDashboardStats] = useState({
    rawImli: 0,
    distributed: 0,
    cleaned: 0,
    pending: 0
  });

  const fetchDashboardData = async () => {
    try {
      const [localsRes, rawImliRes] = await Promise.all([
        api.get("/return_local"),
        api.get("/getRawImli")
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
    }
  };

  useEffect(() => {
    fetchDashboardData(); // Initial fetch

    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 1000); // Poll every 1 second

    return () => clearInterval(intervalId);
  }, []);

  const stats = [
    { id: 1, title: "Raw Imli", value: `${dashboardStats.rawImli} KG` },
    { id: 2, title: "Cleaned Imli", value: `${dashboardStats.cleaned} KG` },
    { id: 3, title: "Distributed Imli to Locals", value: `${dashboardStats.distributed} KG` },
    { id: 4, title: "Pending Imli to be returned", value: `${dashboardStats.pending} KG` },
  ];


  return (
    <div className="p-3 md:p-6 lg:p-8 bg-orange-50/40 md:bg-gray-50 min-h-full md:min-h-screen overflow-hidden md:overflow-x-hidden flex flex-col">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 md:gap-6 mb-4 md:mb-8 shrink-0">
        {stats.map((stat, index) => {
          return (
            <div
              key={stat.id}
              className={`stat-gradient-${index} md:bg-white rounded-2xl md:rounded-xl p-4 md:p-6 shadow-md md:shadow-sm border-0 md:border md:border-gray-100 hover:shadow-lg transition-all duration-300 animate-card-enter animate-delay-${index + 1} flex items-center justify-between md:flex-col md:items-start`}
            >
              <p className={`text-gray-600 md:text-gray-500 font-semibold md:font-medium text-sm md:text-sm leading-snug md:mb-3 ${lang === 'ur' ? 'urdu-ui text-right' : ''}`}>
                <T k={stat.title} />
              </p>
              <h3 className="text-2xl md:text-2xl font-extrabold text-gray-900 tracking-tight">
                {stat.value}
              </h3>
            </div>
          );
        })}
      </div>

      {/* Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 md:gap-6 flex-1 min-h-0 md:mb-8">
        {/* Sack Entry - Replaces 'Recent Activities' */}
        <div className="lg:col-span-2 min-h-0 flex flex-col">
          <SackEntry />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl md:rounded-xl p-3 md:p-6 shadow-md md:shadow-sm border-0 md:border md:border-gray-200 shrink-0">
          <h3 className="text-xs md:text-lg font-bold text-gray-900 mb-2.5 md:mb-6">
            <T k="Quick Actions" />
          </h3>

          <div className="space-y-2 md:space-y-3">
            <button
              onClick={() => onPageChange && onPageChange('addRawImli')}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-500 md:bg-none md:bg-orange-600 hover:from-orange-700 hover:to-orange-600 md:hover:bg-orange-700 text-white rounded-xl md:rounded-lg p-2.5 md:p-4 flex items-center justify-center gap-2 md:gap-3 transition-all shadow-lg md:shadow-sm active:scale-[0.98]"
            >
              <MdAdd className="text-base md:text-xl" />
              <span className="font-bold md:font-semibold text-xs md:text-sm"><T k="Add Raw Imli Stock" /></span>
            </button>

            <div className="grid grid-cols-2 gap-2 md:gap-3">
              <button
                onClick={() => onPageChange && onPageChange('assignImli')}
                className="bg-white md:bg-white border border-gray-100 md:border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-xl md:rounded-lg p-2.5 md:p-4 flex flex-col items-center justify-center gap-1.5 md:gap-2 transition-all shadow-sm md:shadow-sm group active:scale-[0.97]"
              >
                <div className="bg-purple-50 p-2 md:p-2 rounded-xl md:rounded-lg group-hover:bg-purple-100 transition-colors">
                  <MdSettings className="text-purple-600 text-sm md:text-lg" />
                </div>
                <span className="text-[10px] md:text-xs font-bold md:font-semibold"><T k="Assign Imli" /></span>
              </button>

              <button
                onClick={() => onPageChange && onPageChange('imliReturned')}
                className="bg-white md:bg-white border border-gray-100 md:border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-xl md:rounded-lg p-2.5 md:p-4 flex flex-col items-center justify-center gap-1.5 md:gap-2 transition-all shadow-sm md:shadow-sm group active:scale-[0.97]"
              >
                <div className="bg-green-50 p-2 md:p-2 rounded-xl md:rounded-lg group-hover:bg-green-100 transition-colors">
                  <MdInventory className="text-green-600 text-sm md:text-lg" />
                </div>
                <span className="text-[10px] md:text-xs font-bold md:font-semibold"><T k="Imli Cleaned" /></span>
              </button>
            </div>
            <ExcelExport />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
