import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface DeliveryAgent {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'AVAILABLE' | 'BUSY' | 'OFFLINE';
  currentOrders: string[]; // Order IDs
  totalDeliveries: number;
  rating: number;
  vehicleType: string;
}

interface DeliveryState {
  agents: DeliveryAgent[];
  loading: boolean;
  error: string | null;
}

const initialState: DeliveryState = {
  agents: [
    {
      id: 'AGENT-001',
      name: 'Mike Johnson',
      email: 'mike@delivery.com',
      phone: '+1234567895',
      status: 'BUSY',
      currentOrders: ['ORD-002', 'ORD-004'],
      totalDeliveries: 45,
      rating: 4.8,
      vehicleType: 'Motorcycle'
    },
    {
      id: 'AGENT-002',
      name: 'Sarah Davis',
      email: 'sarah@delivery.com',
      phone: '+1234567896',
      status: 'AVAILABLE',
      currentOrders: ['ORD-005'],
      totalDeliveries: 38,
      rating: 4.9,
      vehicleType: 'Car'
    },
    {
      id: 'AGENT-003',
      name: 'Tom Wilson',
      email: 'tom@delivery.com',
      phone: '+1234567897',
      status: 'AVAILABLE',
      currentOrders: [],
      totalDeliveries: 52,
      rating: 4.7,
      vehicleType: 'Bicycle'
    }
  ],
  loading: false,
  error: null
};

const deliverySlice = createSlice({
  name: 'delivery',
  initialState,
  reducers: {
    updateAgentStatus: (state, action: PayloadAction<{ id: string; status: DeliveryAgent['status'] }>) => {
      const agent = state.agents.find(a => a.id === action.payload.id);
      if (agent) {
        agent.status = action.payload.status;
      }
    },
    assignOrderToAgent: (state, action: PayloadAction<{ agentId: string; orderId: string }>) => {
      const agent = state.agents.find(a => a.id === action.payload.agentId);
      if (agent && !agent.currentOrders.includes(action.payload.orderId)) {
        agent.currentOrders.push(action.payload.orderId);
        if (agent.status === 'AVAILABLE') {
          agent.status = 'BUSY';
        }
      }
    },
    completeDelivery: (state, action: PayloadAction<{ agentId: string; orderId: string }>) => {
      const agent = state.agents.find(a => a.id === action.payload.agentId);
      if (agent) {
        agent.currentOrders = agent.currentOrders.filter(id => id !== action.payload.orderId);
        agent.totalDeliveries += 1;
        if (agent.currentOrders.length === 0) {
          agent.status = 'AVAILABLE';
        }
      }
    }
  }
});

export const { updateAgentStatus, assignOrderToAgent, completeDelivery } = deliverySlice.actions;
export default deliverySlice.reducer;