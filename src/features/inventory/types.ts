export interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  costPrice: number;
  salePrice?: number;
  stock: number;
  lowStockThreshold: number;
  images: string[];
  description: string;
  tags: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}