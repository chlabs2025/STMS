import { MdEco, MdCleaningServices, MdAssignment, MdPendingActions, MdAdd, MdSettings, MdInventory } from 'react-icons/md';

const Dashboard = ({ navigateToAssignImli, onPageChange }) => {
  const stats = [
    {
      id: 1,
      title: "Raw Imli",
      titleUrdu: "اِمّی الا",
      value: "78045 KG",
      color: "border-l-4 border-orange-500",
      bgGradient: "bg-gradient-to-br from-orange-50 to-orange-100",
      textColor: "text-orange-600",
      iconBg: "bg-orange-500",
      icon: MdEco,
    },
    {
      id: 2,
      title: "Cleaned Imli",
      titleUrdu: "صاف الا",
      value: "78045 KG",
      color: "border-l-4 border-red-500",
      bgGradient: "bg-gradient-to-br from-red-50 to-red-100",
      textColor: "text-red-600",
      iconBg: "bg-red-500",
      icon: MdCleaningServices,
    },
    {
      id: 3,
      title: "Distributed Imli to Locals",
      titleUrdu: "مقسم شدہ الا",
      value: "78045 KG",
      color: "border-l-4 border-blue-500",
      bgGradient: "bg-gradient-to-br from-blue-50 to-blue-100",
      textColor: "text-blue-600",
      iconBg: "bg-blue-500",
      icon: MdAssignment,
    },
    {
      id: 4,
      title: "Pending Imli to be returned",
      titleUrdu: "اِمّی الا",
      value: "78045 KG",
      color: "border-l-4 border-purple-500",
      bgGradient: "bg-gradient-to-br from-purple-50 to-purple-100",
      textColor: "text-purple-600",
      iconBg: "bg-purple-500",
      icon: MdPendingActions,
    },
  ]

  const activities = [
    {
      title: "LATEST ENTRIES",
      items: [
        { description: "1500 KG RAW IMLI ADDED IN STOCK", date: "27th September 2025" },
        { description: "1200 KG RAW IMLI ADDED IN STOCK", date: "27th September 2025" },
        { description: "1200 KG RAW IMLI ADDED IN STOCK", date: "27th September 2025" },
      ],
    },
    {
      title: "RETURN CLEAN IMLI",
      items: [
        { description: "1500 KG CLEANED IMLI RETURNED BY CLEANER 343", date: "27th September 2025" },
        { description: "1900 KG CLEANED IMLI RETURNED BY CLEANER 313", date: "27th September 2025" },
        { description: "2000 KG CLEANED IMLI RETURNED BY CLEANER 313", date: "27th September 2025" },
      ],
    },
    {
      title: "ASSIGNMENT",
      items: [
        { description: "800 KG RAW IMLI ASSIGNED TO CLEANER 543", date: "27th September 2025" },
        { description: "800 KG RAW IMLI ASSIGNED TO CLEANER 543", date: "27th September 2025" },
        { description: "800 KG RAW IMLI ASSIGNED TO CLEANER 543", date: "27th September 2025" },
      ],
    },
  ]

  return (
    <div className="p-6 lg:p-8 bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 min-h-screen overflow-x-hidden">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const IconComponent = stat.icon;
          return (
            <div key={stat.id} className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${stat.color} ${stat.bgGradient} border border-white/50 backdrop-blur-sm`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <p className="text-gray-700 font-semibold text-sm mb-1">{stat.title}</p>
                  <p className="text-gray-500 text-xs">{stat.titleUrdu}</p>
                </div>
                <div className={`${stat.iconBg} p-3 rounded-xl shadow-md`}>
                  <IconComponent className="text-2xl text-white" />
                </div>
              </div>
              <p className={`text-4xl font-bold mb-3 ${stat.textColor}`}>
                {stat.value}
              </p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <p className="text-gray-600 text-xs font-medium">Last Updated on 24th October 2025</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Activities */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800">RECENT ACTIVITIES</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {activities.map((activity, idx) => (
              <div key={idx} className="bg-gradient-to-br from-gray-50 to-gray-100 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-300">
                <h4 className="font-bold text-sm mb-4 text-gray-800 pb-2 border-b border-gray-300">{activity.title}</h4>
                <div className="space-y-4">
                  {activity.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="bg-white p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                      <p className="text-gray-700 text-sm font-semibold mb-2 leading-relaxed">{item.description}</p>
                      <p className="text-gray-500 text-xs font-medium">{item.date}</p>
                    </div>
                  ))}
                </div>
                <button className="text-orange-600 font-bold text-xs mt-4 hover:text-orange-700 transition-colors flex items-center gap-1">
                  SEE ALL
                  <span className="text-xs">→</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-600 rounded-full"></div>
            <h3 className="text-2xl font-bold text-gray-800">QUICK ACTIONS</h3>
          </div>
          <div className="space-y-4">
            <button 
              onClick={() => onPageChange && onPageChange('addRawImli')}
              className="w-full bg-gradient-to-br from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 rounded-xl p-6 flex flex-col items-center justify-center text-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="bg-white/20 p-3 rounded-xl mb-3">
                <MdAdd className="text-3xl" />
              </div>
              <span className="text-sm font-semibold">Add Raw Imli in Stocks</span>
            </button>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => onPageChange && onPageChange('assignImli')}
                className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 rounded-xl p-5 flex flex-col items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-white/20 p-2 rounded-lg mb-2">
                  <MdSettings className="text-xl" />
                </div>
                <span className="text-xs font-semibold text-center leading-tight">Assign Imli</span>
              </button>
              <button 
                onClick={() => onPageChange && onPageChange('imliReturned')}
                className="bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 rounded-xl p-5 flex flex-col items-center justify-center text-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-white/20 p-2 rounded-lg mb-2">
                  <MdInventory className="text-xl" />
                </div>
                <span className="text-xs font-semibold text-center leading-tight">Imli Cleaned</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
