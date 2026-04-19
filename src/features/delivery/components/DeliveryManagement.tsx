import { useAppSelector, useAppDispatch } from "@/hooks/redux";
import { updateAgentStatus, assignOrderToAgent, completeDelivery } from "@/store/slices/deliverySlice";
import { assignAgent } from "@/store/slices/orderSlice";

export default function DeliveryManagement() {
  const dispatch = useAppDispatch();
  const agents = useAppSelector((state) => state.delivery.agents);
  const orders = useAppSelector((state) => state.order.orders);

  const availableOrders = orders.filter(order =>
    ['CONFIRMED', 'PREPARING'].includes(order.status) && !order.assignedAgentId
  );

  const handleUpdateAgentStatus = (agentId: string, status: any) => {
    dispatch(updateAgentStatus({ id: agentId, status }));
  };

  const handleAssignOrder = (agentId: string, orderId: string) => {
    dispatch(assignOrderToAgent({ agentId, orderId }));
    dispatch(assignAgent({ orderId, agentId }));
  };

  const handleCompleteDelivery = (agentId: string, orderId: string) => {
    dispatch(completeDelivery({ agentId, orderId }));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return 'bg-green-100 text-green-800';
      case 'BUSY': return 'bg-yellow-100 text-yellow-800';
      case 'OFFLINE': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="delivery-management-title">
      <h1 id="delivery-management-title" className="text-3xl font-bold text-gray-900">Delivery Management</h1>

      {/* Agent Management */}
      <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Delivery Agents</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-medium text-gray-900">{agent.name}</h3>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(agent.status)}`}>
                  {agent.status}
                </span>
              </div>

              <div className="space-y-2 text-sm text-gray-600">
                <p>📧 {agent.email}</p>
                <p>📱 {agent.phone}</p>
                <p>🚗 {agent.vehicleType}</p>
                <p>⭐ Rating: {agent.rating}/5</p>
                <p>📦 Deliveries: {agent.totalDeliveries}</p>
                <p>📋 Current Orders: {agent.currentOrders.length}</p>
              </div>

              <div className="mt-4 flex space-x-2">
                <select
                  value={agent.status}
                  onChange={(e) => handleUpdateAgentStatus(agent.id, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={`Update status for ${agent.name}`}
                >
                  <option value="AVAILABLE">Available</option>
                  <option value="BUSY">Busy</option>
                  <option value="OFFLINE">Offline</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Assignment */}
      <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Order Assignment</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Available Orders</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {availableOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{order.id}</p>
                      <p className="text-sm text-gray-600">{order.customerName}</p>
                      <p className="text-sm text-gray-600">₹{order.totalAmount.toFixed(2)}</p>
                    </div>
                    <div className="flex flex-col space-y-1">
                      {agents.filter(a => a.status === 'AVAILABLE').map(agent => (
                        <button
                          key={agent.id}
                          onClick={() => handleAssignOrder(agent.id, order.id)}
                          className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          aria-label={`Assign order ${order.id} to ${agent.name}`}
                        >
                          Assign to {agent.name}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
              {availableOrders.length === 0 && (
                <p className="text-gray-500 text-center py-4">No orders available for assignment</p>
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-3">Active Deliveries</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {agents.filter(a => a.currentOrders.length > 0).map(agent => (
                <div key={agent.id} className="border border-gray-200 rounded-lg p-3">
                  <h4 className="font-medium text-gray-900 mb-2">{agent.name}</h4>
                  {agent.currentOrders.map(orderId => {
                    const order = orders.find(o => o.id === orderId);
                    return order ? (
                      <div key={orderId} className="flex justify-between items-center bg-gray-50 p-2 rounded mb-2">
                        <div>
                          <p className="text-sm font-medium">{order.id}</p>
                          <p className="text-xs text-gray-600">{order.customerName}</p>
                        </div>
                        <button
                          onClick={() => handleCompleteDelivery(agent.id, orderId)}
                          className="px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                          aria-label={`Mark delivery ${orderId} as completed`}
                        >
                          Complete
                        </button>
                      </div>
                    ) : null;
                  })}
                </div>
              ))}
              {agents.filter(a => a.currentOrders.length > 0).length === 0 && (
                <p className="text-gray-500 text-center py-4">No active deliveries</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Route Management */}
      <div className="bg-white p-6 rounded-lg shadow-lg animate-fadeIn">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Route Management</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {agents.map((agent) => (
            <div key={agent.id} className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-medium text-gray-900 mb-3">{agent.name}'s Routes</h3>
              {agent.currentOrders.length > 0 ? (
                <div className="space-y-2">
                  {agent.currentOrders.map((orderId, index) => {
                    const order = orders.find(o => o.id === orderId);
                    return order ? (
                      <div key={orderId} className="flex items-center space-x-3 p-2 bg-gray-50 rounded">
                        <span className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                          {index + 1}
                        </span>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{order.customerName}</p>
                          <p className="text-xs text-gray-600">{order.deliveryAddress}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold">₹{order.totalAmount.toFixed(2)}</p>
                          {order.estimatedDelivery && (
                            <p className="text-xs text-gray-500">
                              Est: {new Date(order.estimatedDelivery).toLocaleDateString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No active routes</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}