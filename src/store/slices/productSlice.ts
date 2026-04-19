import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Product } from "@/features/inventory/types";

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [
    {
      id: '1',
      name: 'Wireless Headphones',
      sku: 'WH-001',
      category: 'Electronics',
      price: 99.99,
      costPrice: 60.00,
      stock: 25,
      lowStockThreshold: 5,
      images: ['https://example.com/headphones.jpg'],
      description: 'High-quality wireless headphones with noise cancellation',
      tags: ['wireless', 'audio', 'electronics'],
      isActive: true,
      createdAt: new Date('2024-01-15').toISOString(),
      updatedAt: new Date('2024-01-15').toISOString(),
    },
    {
      id: '2',
      name: 'Cotton T-Shirt',
      sku: 'TS-002',
      category: 'Clothing',
      price: 19.99,
      costPrice: 8.00,
      stock: 100,
      lowStockThreshold: 10,
      images: ['https://example.com/tshirt.jpg'],
      description: 'Comfortable cotton t-shirt in various sizes',
      tags: ['clothing', 'cotton', 'casual'],
      isActive: true,
      createdAt: new Date('2024-01-20').toISOString(),
      updatedAt: new Date('2024-01-20').toISOString(),
    },
    {
      id: '3',
      name: 'Programming Book',
      sku: 'BK-003',
      category: 'Books',
      price: 49.99,
      costPrice: 25.00,
      stock: 3,
      lowStockThreshold: 5,
      images: ['https://example.com/book.jpg'],
      description: 'Comprehensive guide to modern programming',
      tags: ['book', 'programming', 'education'],
      isActive: true,
      createdAt: new Date('2024-02-01').toISOString(),
      updatedAt: new Date('2024-02-01').toISOString(),
    },
  ],
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<Product>) => {
      state.products.push(action.payload);
    },
    editProduct: (state, action: PayloadAction<Product>) => {
      const index = state.products.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.products[index] = { ...action.payload, updatedAt: new Date().toISOString() };
      }
    },
    deleteProduct: (state, action: PayloadAction<string>) => {
      const index = state.products.findIndex(p => p.id === action.payload);
      if (index !== -1) {
        state.products[index].isActive = false; // Soft delete
      }
    },
    hardDeleteProduct: (state, action: PayloadAction<string>) => {
      state.products = state.products.filter(p => p.id !== action.payload);
    },
  },
});

export const { addProduct, editProduct, deleteProduct, hardDeleteProduct } = productSlice.actions;
export default productSlice.reducer;