import { MdTrendingUp, MdTrendingDown, MdInventory, MdAssignmentInd, MdPersonAdd, MdSettings } from 'react-icons/md';
import moment from 'moment';
import T from '../../i18n/T';

const RecentActivity = ({ activities = [], onPageChange }) => {
    
    const getActionConfig = (type) => {
        switch (type) {
            case 'ASSIGNMENT':
                return { 
                    label: 'Imli Assigned', 
                    icon: MdAssignmentInd, 
                    color: 'purple',
                    bg: 'bg-purple-100',
                    text: 'text-purple-700',
                    border: 'border-purple-200'
                };
            case 'RETURN':
                return { 
                    label: 'Imli Returned', 
                    icon: MdTrendingUp, 
                    color: 'green',
                    bg: 'bg-green-100',
                    text: 'text-green-700',
                    border: 'border-green-200'
                };
            case 'RESTOCK':
                return { 
                    label: 'Stock Added', 
                    icon: MdInventory, 
                    color: 'orange',
                    bg: 'bg-orange-100',
                    text: 'text-orange-700',
                    border: 'border-orange-200'
                };
            case 'REGISTRATION':
                return { 
                    label: 'New Local', 
                    icon: MdPersonAdd, 
                    color: 'blue',
                    bg: 'bg-blue-100',
                    text: 'text-blue-700',
                    border: 'border-blue-200'
                };
            default:
                return { 
                    label: 'System Action', 
                    icon: MdSettings, 
                    color: 'gray',
                    bg: 'bg-gray-100',
                    text: 'text-gray-700',
                    border: 'border-gray-200'
                };
        }
    };

    return (
        <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 flex flex-col h-[400px] md:h-[420px]">
            <div className="flex items-center justify-between mb-8 border-b border-gray-50 pb-4">
                <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1 h-4 bg-orange-500 rounded-full" />
                    <T k="System Activity" />
                </h3>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">
                        Live
                    </span>
                </div>
            </div>

            <div className="flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar flex-1">
                {activities.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center py-10">
                        <div className="bg-gray-50 p-4 rounded-full mb-4">
                            <MdInventory className="text-4xl text-gray-200" />
                        </div>
                        <p className="text-gray-400 text-sm font-medium italic">No recent activities found.</p>
                    </div>
                ) : (
                    activities.map((activity) => {
                        const config = getActionConfig(activity.type);
                        const Icon = config.icon;
                        
                        return (
                            <div key={activity._id} className="flex items-center gap-4 group hover:bg-gray-50/50 p-2 -m-2 rounded-xl transition-colors">
                                <div className={`${config.bg} ${config.text} p-3 rounded-xl shrink-0 group-hover:scale-110 transition-all duration-300 shadow-sm border ${config.border}`}>
                                    <Icon className="text-xl" />
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <div className="flex flex-col">
                                        {/* Simple and direct Headline */}
                                        <h4 className={`text-sm md:text-[15px] font-bold text-gray-900 leading-tight mb-0.5`}>
                                            {activity.type === 'RESTOCK' ? config.label : (activity.localName || config.label)}
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            {activity.type !== 'RESTOCK' && activity.localName && (
                                                <span className={`text-[10px] font-bold ${config.text} uppercase tracking-wider`}>
                                                    {config.label}
                                                </span>
                                            )}
                                            <span className="text-[10px] text-gray-400 font-medium">
                                                {moment(activity.createdAt).fromNow()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right-most Quantity */}
                                {activity.quantity > 0 && (
                                    <div className="text-right flex flex-col items-end shrink-0 pl-2">
                                        <div className="flex items-baseline gap-1">
                                            <span className="text-lg md:text-xl font-bold text-gray-900 tracking-tighter">
                                                {activity.quantity}
                                            </span>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase">
                                                {activity.unit}
                                            </span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })
                )}
            </div>
            
            <button 
                onClick={() => onPageChange && onPageChange('auditLogs')}
                className="mt-8 pt-4 border-t border-gray-50 text-[11px] font-bold text-gray-400 uppercase tracking-widest hover:text-orange-500 transition-colors flex items-center justify-center gap-2"
            >
                <span>View Full Audit Log</span>
                <MdTrendingUp className="text-sm" />
            </button>
        </div>
    );
};

export default RecentActivity;
