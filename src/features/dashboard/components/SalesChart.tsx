import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Oct", revenue: 12000 },
  { month: "Nov", revenue: 15000 },
  { month: "Dec", revenue: 18000 },
  { month: "Jan", revenue: 22000 },
  { month: "Feb", revenue: 25000 },
  { month: "Mar", revenue: 28000 },
];

export default function SalesChart() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn" role="region" aria-labelledby="revenue-chart-title">
      <h2 id="revenue-chart-title" className="text-xl font-semibold text-gray-900 mb-4">Revenue Trend (6 Months)</h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="month"
            stroke="#6b7280"
            fontSize={12}
            aria-label="Month"
          />
          <YAxis
            stroke="#6b7280"
            fontSize={12}
            aria-label="Revenue in Rupees"
          />
          <Tooltip
            formatter={(value) => [`₹${value}`, 'Revenue']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ backgroundColor: '#f9fafb', border: '1px solid #d1d5db' }}
          />
          <Line
            type="monotone"
            dataKey="revenue"
            stroke="#3b82f6"
            strokeWidth={3}
            dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2, fill: '#ffffff' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}