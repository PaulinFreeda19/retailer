import { useState, useMemo } from "react";
import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateOrderStatus, assignAgent, cancelOrder } from "@/store/slices/orderSlice";
import { assignOrderToAgent } from "@/store/slices/deliverySlice";

type SortField = 'id' | 'customerName' | 'totalAmount' | 'status' | 'orderDate';
type SortDirection = 'asc' | 'desc';

export default function OrdersTable() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector((state) => state.order.orders);
  const agents = useAppSelector((state) => state.delivery.agents);

  const [sortField, setSortField] = useState<SortField>('orderDate');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [customerFilter, setCustomerFilter] = useState('');
  const [minAmount, setMinAmount] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filteredAndSortedOrders = useMemo(() => {
    let filtered = orders.filter(order => {
      if (statusFilter !== 'ALL' && order.status !== statusFilter) return false;
      if (customerFilter && !order.customerName.toLowerCase().includes(customerFilter.toLowerCase())) return false;
      if (minAmount && order.totalAmount < parseFloat(minAmount)) return false;
      if (maxAmount && order.totalAmount > parseFloat(maxAmount)) return false;
      if (dateFrom && new Date(order.orderDate) < new Date(dateFrom)) return false;
      if (dateTo && new Date(order.orderDate) > new Date(dateTo)) return false;
      return true;
    });

    return filtered.sort((a, b) => {
      let aValue: any = a[sortField];
      let bValue: any = b[sortField];

      if (sortField === 'orderDate') {
        aValue = new Date(aValue).getTime();
        bValue = new Date(bValue).getTime();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }, [orders, sortField, sortDirection, statusFilter, customerFilter, minAmount, maxAmount, dateFrom, dateTo]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleStatusUpdate = (orderId: string, newStatus: any) => {
    dispatch(updateOrderStatus({ id: orderId, status: newStatus }));
  };

  const handleAssignAgent = (orderId: string, agentId: string) => {
    dispatch(assignAgent({ orderId, agentId }));
    dispatch(assignOrderToAgent({ agentId, orderId }));
  };

  const handleCancelOrder = (orderId: string) => {
    if (confirm('Are you sure you want to cancel this order?')) {
      dispatch(cancelOrder(orderId));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED': return 'bg-blue-100 text-blue-800';
      case 'PREPARING': return 'bg-purple-100 text-purple-800';
      case 'OUT_FOR_DELIVERY': return 'bg-orange-100 text-orange-800';
      case 'DELIVERED': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="orders-table-title">
      <h2 id="orders-table-title" className="text-2xl font-semibold text-gray-900">Order Management</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
        <div>
          <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by order status"
          >
            <option value="ALL">All Statuses</option>
            <option value="PENDING">Pending</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="PREPARING">Preparing</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
          </select>
        </div>

        <div>
          <label htmlFor="customer-filter" className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
          <input
            id="customer-filter"
            type="text"
            placeholder="Search customer..."
            value={customerFilter}
            onChange={(e) => setCustomerFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Filter by customer name"
          />
        </div>

        <div>
          <label htmlFor="min-amount" className="block text-sm font-medium text-gray-700 mb-1">Min Amount</label>
          <input
            id="min-amount"
            type="number"
            placeholder="0"
            value={minAmount}
            onChange={(e) => setMinAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Minimum order amount"
          />
        </div>

        <div>
          <label htmlFor="max-amount" className="block text-sm font-medium text-gray-700 mb-1">Max Amount</label>
          <input
            id="max-amount"
            type="number"
            placeholder="0"
            value={maxAmount}
            onChange={(e) => setMaxAmount(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Maximum order amount"
          />
        </div>

        <div>
          <label htmlFor="date-from" className="block text-sm font-medium text-gray-700 mb-1">Date From</label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Start date filter"
          />
        </div>

        <div>
          <label htmlFor="date-to" className="block text-sm font-medium text-gray-700 mb-1">Date To</label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="End date filter"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow-lg rounded-lg overflow-hidden animate-fadeIn">
        <div className="w-full overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200" role="table" aria-label="Orders table">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('id')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSort('id')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Order ID"
                >
                  Order ID {sortField === 'id' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('customerName')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSort('customerName')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Customer Name"
                >
                  Customer {sortField === 'customerName' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('totalAmount')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSort('totalAmount')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Total Amount"
                >
                  Amount {sortField === 'totalAmount' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('status')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSort('status')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Status"
                >
                  Status {sortField === 'status' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                  onClick={() => handleSort('orderDate')}
                  onKeyPress={(e) => e.key === 'Enter' && handleSort('orderDate')}
                  tabIndex={0}
                  role="button"
                  aria-label="Sort by Order Date"
                >
                  Date {sortField === 'orderDate' && (sortDirection === 'asc' ? '↑' : '↓')}
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    <div>
                      <div className="font-medium">{order.customerName}</div>
                      <div className="text-gray-500">{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">₹{order.totalAmount.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {new Date(order.orderDate).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    {order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                      <>
                        <select
                          value={order.status}
                          onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                          className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`Update status for order ${order.id}`}
                        >
                          <option value="PENDING">Pending</option>
                          <option value="CONFIRMED">Confirmed</option>
                          <option value="PREPARING">Preparing</option>
                          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                          <option value="DELIVERED">Delivered</option>
                        </select>

                        {order.status === 'CONFIRMED' && !order.assignedAgentId && (
                          <select
                            onChange={(e) => handleAssignAgent(order.id, e.target.value)}
                            defaultValue=""
                            className="px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label={`Assign agent for order ${order.id}`}
                          >
                            <option value="" disabled>Assign Agent</option>
                            {agents.filter(a => a.status === 'AVAILABLE').map(agent => (
                              <option key={agent.id} value={agent.id}>{agent.name}</option>
                            ))}
                          </select>
                        )}

                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          className="px-2 py-1 mt-2 bg-red-500 text-white rounded text-xs hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                          aria-label={`Cancel order ${order.id}`}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}