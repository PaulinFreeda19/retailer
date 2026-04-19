import { useAppSelector } from "@/hooks/redux";

export default function TopProducts() {
  const products = useAppSelector((state) => state.product.products);
  const orders = useAppSelector((state) => state.order.orders);

  // Calculate sales for each product
  const productSales = products.map(product => {
    const totalSold = orders
      .filter(order => order.status === 'DELIVERED')
      .reduce((sum, order) => {
        const item = order.items.find(i => i.productId === product.id);
        return sum + (item ? item.quantity : 0);
      }, 0);

    return {
      ...product,
      totalSold,
      revenue: totalSold * product.price,
    };
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn" role="region" aria-labelledby="top-products-title">
      <h2 id="top-products-title" className="text-xl font-semibold text-gray-900 mb-4">Top Products</h2>

      <div className="space-y-4">
        {productSales.map((product, index) => (
          <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-bold text-gray-500">#{index + 1}</span>
              <div>
                <p className="font-medium text-gray-900">{product.name}</p>
                <p className="text-sm text-gray-500">{product.totalSold} sold</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-green-600">₹{product.revenue.toFixed(2)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}