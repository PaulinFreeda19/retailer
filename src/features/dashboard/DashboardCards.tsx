import { useAppSelector } from "@/hooks/redux";

export default function DashboardCards() {
  const products = useAppSelector((state) => state.product.products);
  const orders = useAppSelector((state) => state.order.orders);

  const totalOrders = orders.length;
  const monthlyIncome = orders
    .filter(order => order.status === 'DELIVERED')
    .reduce((sum, order) => sum + order.totalAmount, 0);
  const activeProducts = products.filter(p => p.isActive).length;
  const pendingDeliveries = orders.filter(order =>
    ['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY'].includes(order.status)
  ).length;

  const data = [
    { title: "Total Orders", value: totalOrders.toString(), icon: "📦" },
    { title: "Monthly Income", value: `₹${monthlyIncome.toFixed(2)}`, icon: "💰" },
    { title: "Active Products", value: activeProducts.toString(), icon: "📊" },
    { title: "Pending Deliveries", value: pendingDeliveries.toString(), icon: "🚚" },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
      {data.map((d, index) => (
        <div
          key={d.title}
          className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 p-6 rounded-lg border border-gray-200 hover:scale-105 transform"
          role="region"
          aria-labelledby={`card-title-${index}`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p id={`card-title-${index}`} className="text-gray-500 text-sm font-medium">{d.title}</p>
              <h2 className="text-2xl font-bold text-gray-900 mt-1">{d.value}</h2>
            </div>
            <span className="text-3xl" aria-hidden="true">{d.icon}</span>
          </div>
        </div>
      ))}
    </div>
  );
}