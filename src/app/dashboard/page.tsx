import DashboardCards from "@/features/dashboard/DashboardCards";
import SalesChart from "@/features/dashboard/components/SalesChart";
import OrderDistribution from "@/features/dashboard/components/OrderDistribution";
import TopProducts from "@/features/dashboard/components/TopProducts";
import RecentActivity from "@/features/dashboard/components/RecentActivity";

export default function Dashboard() {
  return (
    <div className="p-6 space-y-6" role="main" aria-labelledby="dashboard-title">
      <h1 id="dashboard-title" className="text-3xl font-bold text-gray-900 mb-6">Dashboard Analytics</h1>

      <DashboardCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart />
        <OrderDistribution />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopProducts />
        <RecentActivity />
      </div>
    </div>
  );
}