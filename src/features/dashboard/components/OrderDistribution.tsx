import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useAppSelector } from "@/hooks/redux";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

export default function OrderDistribution() {
  const orders = useAppSelector((state) => state.order.orders);

  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(statusCounts).map(([status, count]) => ({
    name: status.replace('_', ' '),
    value: count,
  }));

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn" role="region" aria-labelledby="order-distribution-title">
      <h2 id="order-distribution-title" className="text-xl font-semibold text-gray-900 mb-4">Order Distribution</h2>

      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) + '%' : ''}`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            aria-label="Order status distribution"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}