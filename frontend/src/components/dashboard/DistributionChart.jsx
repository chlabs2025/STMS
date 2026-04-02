import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import T from '../../i18n/T';

const COLORS = ['#f66713', '#16a34a'];

const DistributionChart = ({ stats }) => {
  const data = [
    { name: 'Raw Stock', value: stats.rawImli },
    { name: 'Cleaned', value: stats.cleaned },
  ].filter(d => d.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-gray-100 p-2 rounded-xl shadow-lg ring-1 ring-black/5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-1">{payload[0].name}</p>
          <p className="text-xs font-bold text-gray-900">{payload[0].value} KG</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 flex flex-col h-[420px]">
      <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest mb-6">
        <T k="Operational Distribution" />
      </h3>
      
      <div className="flex-1 w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        
        {/* Center Label */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">Total</p>
            <p className="text-xl font-bold text-gray-800">
                {data.reduce((acc, curr) => acc + curr.value, 0)}
            </p>
        </div>
      </div>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-4 gap-y-2 mt-4">
        {data.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
            <span className="text-[10px] text-gray-500 font-medium truncate">{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DistributionChart;
