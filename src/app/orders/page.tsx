import OrdersTable from "@/features/orders/components/OrdersTable";

export default function OrdersPage() {
  return (
    <div className="p-6" role="main" aria-labelledby="orders-page-title">
      <OrdersTable />
    </div>
  );
}