import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import T from '../../i18n/T';

const data = [
  { day: 'Mon', raw: 18500, cleaned: 3200 },
  { day: 'Tue', raw: 19200, cleaned: 3500 },
  { day: 'Wed', raw: 20100, cleaned: 3800 },
  { day: 'Thu', raw: 19800, cleaned: 4100 },
  { day: 'Fri', raw: 20500, cleaned: 4250 },
  { day: 'Sat', raw: 21200, cleaned: 4500 },
  { day: 'Sun', raw: 20361, cleaned: 4360 }, // Current stats
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 backdrop-blur-md border border-gray-100 p-3 rounded-xl shadow-xl">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter mb-2">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-xs font-semibold text-gray-700">{entry.name}:</span>
            <span className="text-xs font-bold text-gray-900">{entry.value} KG</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const TrendChart = () => {
  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-100 flex flex-col h-[400px] md:h-[420px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xs font-bold text-gray-800 uppercase tracking-widest">
          <T k="7-Day Inventory Trends" />
        </h3>
        <div className="flex gap-4">
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-orange-500" />
            <span className="text-[10px] text-gray-500 font-medium">Raw</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-[10px] text-gray-500 font-medium">Cleaned</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorRaw" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorCleaned" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis 
              dataKey="day" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 500 }}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey="raw" 
              name="Raw Imli"
              stroke="#f97316" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorRaw)" 
            />
            <Area 
              type="monotone" 
              dataKey="cleaned" 
              name="Cleaned Imli"
              stroke="#22c55e" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorCleaned)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TrendChart;
