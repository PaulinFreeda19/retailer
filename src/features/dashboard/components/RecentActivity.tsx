import { useAppSelector } from "@/hooks/redux";

export default function RecentActivity() {
  const orders = useAppSelector((state) => state.order.orders);

  const recentOrders = [...orders]
  .sort((a, b) => new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime())
  .slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn" role="region" aria-labelledby="recent-activity-title">
      <h2 id="recent-activity-title" className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>

      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                Order {order.id} - {order.customerName}
              </p>
              <p className="text-xs text-gray-500">
                {order.status} • {new Date(order.orderDate).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-gray-900">₹{order.totalAmount.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}