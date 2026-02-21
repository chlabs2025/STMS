import { useState, useEffect } from 'react';
import {
  MdEco,
  MdCleaningServices,
  MdAssignment,
  MdPendingActions,
  MdAdd,
  MdSettings,
  MdInventory
} from 'react-icons/md';
import api from "../../api/axios";
import SackEntry from './SackEntry';
import { t } from '../../i18n/translations';
import { useLang } from '../../context/LanguageContext';
import T from '../../i18n/T';

const Dashboard = ({ navigateToAssignImli, onPageChange }) => {
  const { lang } = useLang();
  const [dashboardStats, setDashboardStats] = useState({
    distributed: 0,
    cleaned: 0,
    pending: 0
  });

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/return_local");
      if (response.data && response.data.data) {
        const locals = response.data.data;

        const distributed = locals.reduce((acc, local) => acc + (local.totalAssignedQuantity || 0), 0);
        const cleaned = locals.reduce((acc, local) => acc + (local.totalReturnedQuantity || 0), 0);
        const pending = distributed - cleaned;

        setDashboardStats({
          distributed,
          cleaned,
          pending
        });
      }
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
    {
      id: 1,
      title: "Raw Imli",
      titleUrdu: "خام املی",
      value: "78045 KG", // Static as per backend limitation
      borderColor: "border-orange-500",
      iconColor: "text-orange-600",
      iconBg: "bg-orange-50",
      icon: MdEco,
    },
    {
      id: 2,
      title: "Cleaned Imli",
      titleUrdu: "صاف املی",
      value: `${dashboardStats.cleaned} KG`,
      borderColor: "border-green-500",
      iconColor: "text-green-600",
      iconBg: "bg-green-50",
      icon: MdCleaningServices,
    },
    {
      id: 3,
      title: "Distributed Imli to Locals",
      titleUrdu: "تقسیم شدہ املی",
      value: `${dashboardStats.distributed} KG`,
      borderColor: "border-blue-500",
      iconColor: "text-blue-600",
      iconBg: "bg-blue-50",
      icon: MdAssignment,
    },
    {
      id: 4,
      title: "Pending Imli to be returned",
      titleUrdu: "واپس آنے والی املی",
      value: `${dashboardStats.pending} KG`,
      borderColor: "border-purple-500",
      iconColor: "text-purple-600",
      iconBg: "bg-purple-50",
      icon: MdPendingActions,
    },
  ];


  return (
    <div className="p-6 lg:p-8 bg-gray-50 min-h-screen overflow-x-hidden">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div
              key={stat.id}
              className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100 border-l-4 ${stat.borderColor} hover:shadow-md transition-shadow duration-300`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-gray-500 font-medium text-sm mb-1">
                    {stat.title}
                  </p>
                </div>
                <div className={`${stat.iconBg} p-2.5 rounded-lg`}>
                  <IconComponent className={`text-xl ${stat.iconColor}`} />
                </div>
              </div>

              <div className="flex items-end justify-between">
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </h3>
                </div>
                <div className="text-right">
                  <p className="urdu-ui text-xl font-bold text-gray-900 -mb-1">
                    {stat.titleUrdu}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Sack Entry - Replaces 'Recent Activities' */}
        <div className="lg:col-span-2">
          <SackEntry />
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            <T k="Quick Actions" />
          </h3>

          <div className="space-y-3">
            <button
              onClick={() => onPageChange && onPageChange('addRawImli')}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg p-4 flex items-center justify-center gap-3 transition-colors shadow-sm"
            >
              <MdAdd className="text-xl" />
              <span className="font-semibold text-sm"><T k="Add Raw Imli Stock" /></span>
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onPageChange && onPageChange('assignImli')}
                className="bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all shadow-sm group"
              >
                <div className="bg-purple-50 p-2 rounded-lg group-hover:bg-purple-100 transition-colors">
                  <MdSettings className="text-purple-600 text-lg" />
                </div>
                <span className="text-xs font-semibold"><T k="Assign Imli" /></span>
              </button>

              <button
                onClick={() => onPageChange && onPageChange('imliReturned')}
                className="bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 text-gray-700 rounded-lg p-4 flex flex-col items-center justify-center gap-2 transition-all shadow-sm group"
              >
                <div className="bg-green-50 p-2 rounded-lg group-hover:bg-green-100 transition-colors">
                  <MdInventory className="text-green-600 text-lg" />
                </div>
                <span className="text-xs font-semibold"><T k="Imli Cleaned" /></span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
