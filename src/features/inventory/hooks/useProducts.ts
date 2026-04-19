import { useMemo } from "react";
import { useAppSelector } from "@/hooks/redux";

interface UseProductsOptions {
  search?: string;
  category?: string;
  sortBy?: 'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
  showInactive?: boolean;
  minPrice?: number;
  maxPrice?: number;
  stockFilter?: 'all' | 'in-stock' | 'low-stock' | 'out-of-stock';
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const { products } = useAppSelector((s) => s.product);

  const {
    search = '',
    category = '',
    sortBy = 'createdAt',
    sortOrder = 'desc',
    page = 1,
    pageSize = 10,
    showInactive = false,
    minPrice,
    maxPrice,
    stockFilter = 'all',
  } = options;

  const processedProducts = useMemo(() => {
    let filtered = products.filter(p => showInactive || p.isActive);

    // Search filter
    if (search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.sku.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Category filter
    if (category) {
      filtered = filtered.filter(p => p.category === category);
    }

    // Price range filter
    if (minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= minPrice);
    }
    if (maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= maxPrice);
    }

    // Stock filter
    if (stockFilter !== 'all') {
      filtered = filtered.filter(p => {
        switch (stockFilter) {
          case 'in-stock':
            return p.stock > p.lowStockThreshold;
          case 'low-stock':
            return p.stock > 0 && p.stock <= p.lowStockThreshold;
          case 'out-of-stock':
            return p.stock === 0;
          default:
            return true;
        }
      });
    }

    // Sorting
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy];
      let bVal: any = b[sortBy];

      if (sortBy === 'createdAt' || sortBy === 'updatedAt') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }

      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    return filtered;
  }, [products, search, category, sortBy, sortOrder, showInactive, minPrice, maxPrice, stockFilter]);

  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    return processedProducts.slice(start, end);
  }, [processedProducts, page, pageSize]);

  const totalPages = Math.ceil(processedProducts.length / pageSize);
  const totalItems = processedProducts.length;

  return {
    products: processedProducts,
    paginated,
    totalPages,
    totalItems,
    currentPage: page,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};