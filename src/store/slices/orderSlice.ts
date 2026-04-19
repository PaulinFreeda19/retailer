import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    productId: string;
    productName: string;
    quantity: number;
    price: number;
  }>;
  totalAmount: number;
  status: 'PENDING' | 'CONFIRMED' | 'PREPARING' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'CANCELLED';
  orderDate: string;
  deliveryAddress: string;
  assignedAgentId?: string;
  estimatedDelivery?: string;
  notes?: string;
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [
    {
      id: 'ORD-001',
      customerName: 'John Doe',
      customerEmail: 'john@example.com',
      customerPhone: '+1234567890',
      items: [
        { productId: '1', productName: 'Wireless Headphones', quantity: 1, price: 99.99 },
        { productId: '2', productName: 'Cotton T-Shirt', quantity: 2, price: 19.99 }
      ],
      totalAmount: 139.97,
      status: 'PENDING',
      orderDate: new Date('2024-01-25').toISOString(),
      deliveryAddress: '123 Main St, City, State 12345',
      notes: 'Handle with care'
    },
    {
      id: 'ORD-002',
      customerName: 'Jane Smith',
      customerEmail: 'jane@example.com',
      customerPhone: '+1234567891',
      items: [
        { productId: '3', productName: 'Programming Book', quantity: 1, price: 49.99 }
      ],
      totalAmount: 49.99,
      status: 'CONFIRMED',
      orderDate: new Date('2024-01-24').toISOString(),
      deliveryAddress: '456 Oak Ave, City, State 12346',
      assignedAgentId: 'AGENT-001',
      estimatedDelivery: new Date('2024-01-26').toISOString()
    },
    {
      id: 'ORD-003',
      customerName: 'Bob Johnson',
      customerEmail: 'bob@example.com',
      customerPhone: '+1234567892',
      items: [
        { productId: '1', productName: 'Wireless Headphones', quantity: 1, price: 99.99 },
        { productId: '3', productName: 'Programming Book', quantity: 1, price: 49.99 }
      ],
      totalAmount: 149.98,
      status: 'DELIVERED',
      orderDate: new Date('2024-01-20').toISOString(),
      deliveryAddress: '789 Pine Rd, City, State 12347',
      assignedAgentId: 'AGENT-002',
      estimatedDelivery: new Date('2024-01-22').toISOString()
    },
    {
      id: 'ORD-004',
      customerName: 'Alice Brown',
      customerEmail: 'alice@example.com',
      customerPhone: '+1234567893',
      items: [
        { productId: '2', productName: 'Cotton T-Shirt', quantity: 3, price: 19.99 }
      ],
      totalAmount: 59.97,
      status: 'PREPARING',
      orderDate: new Date('2024-01-23').toISOString(),
      deliveryAddress: '321 Elm St, City, State 12348',
      assignedAgentId: 'AGENT-001'
    },
    {
      id: 'ORD-005',
      customerName: 'Charlie Wilson',
      customerEmail: 'charlie@example.com',
      customerPhone: '+1234567894',
      items: [
        { productId: '1', productName: 'Wireless Headphones', quantity: 1, price: 99.99 },
        { productId: '2', productName: 'Cotton T-Shirt', quantity: 1, price: 19.99 },
        { productId: '3', productName: 'Programming Book', quantity: 1, price: 49.99 }
      ],
      totalAmount: 169.97,
      status: 'OUT_FOR_DELIVERY',
      orderDate: new Date('2024-01-22').toISOString(),
      deliveryAddress: '654 Maple Dr, City, State 12349',
      assignedAgentId: 'AGENT-002',
      estimatedDelivery: new Date('2024-01-25').toISOString()
    }
  ],
  loading: false,
  error: null
};

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    updateOrderStatus: (state, action: PayloadAction<{ id: string; status: Order['status'] }>) => {
      const order = state.orders.find(o => o.id === action.payload.id);
      if (order) {
        order.status = action.payload.status;
      }
    },
    assignAgent: (state, action: PayloadAction<{ orderId: string; agentId: string }>) => {
      const order = state.orders.find(o => o.id === action.payload.orderId);
      if (order) {
        order.assignedAgentId = action.payload.agentId;
      }
    },
    cancelOrder: (state, action: PayloadAction<string>) => {
      const order = state.orders.find(o => o.id === action.payload);
      if (order && order.status !== 'DELIVERED') {
        order.status = 'CANCELLED' as any; // Add CANCELLED status if needed
      }
    }
  }
});

export const { updateOrderStatus, assignAgent, cancelOrder } = orderSlice.actions;
export default orderSlice.reducer;