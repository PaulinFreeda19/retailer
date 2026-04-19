import { useState } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { deleteProduct } from "@/store/slices/productSlice";
import { useProducts } from "../hooks/useProducts";

interface ProductTableProps {
  onEdit?: (product: any) => void;
}

export default function ProductTable({ onEdit }: ProductTableProps) {
  const dispatch = useAppDispatch();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in-stock' | 'low-stock' | 'out-of-stock'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'stock' | 'createdAt' | 'updatedAt'>('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [showInactive, setShowInactive] = useState(false);

  const { paginated, totalPages, totalItems, currentPage, hasNextPage, hasPrevPage } = useProducts({
    search,
    category,
    sortBy,
    sortOrder,
    page,
    pageSize: 10,
    showInactive,
    minPrice: minPrice ? Number(minPrice) : undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    stockFilter,
  });

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete "${name}"?`)) {
      dispatch(deleteProduct(id));
    }
  };

  const exportToCSV = (products: any[]) => {
    const headers = ['Name', 'SKU', 'Category', 'Price', 'Cost Price', 'Stock', 'Low Stock Threshold', 'Status', 'Created Date'];
    const csvContent = [
      headers.join(','),
      ...products.map(p => [
        `"${p.name}"`,
        `"${p.sku}"`,
        `"${p.category}"`,
        p.price,
        p.costPrice,
        p.stock,
        p.lowStockThreshold,
        p.isActive ? 'Active' : 'Inactive',
        new Date(p.createdAt).toLocaleDateString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'products.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg border border-gray-200 transition-all duration-300">
        <input
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search products by name, SKU, or description"
        />
        <select
          className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          aria-label="Filter by product category"
        >
          <option value="">All Categories</option>
          <option>General</option>
          <option>Electronics</option>
          <option>Clothing</option>
          <option>Books</option>
        </select>
        <div className="flex gap-2">
          <input
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400 w-24"
            placeholder="Min"
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            aria-label="Minimum price filter"
          />
          <input
            className="px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400 w-24"
            placeholder="Max"
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            aria-label="Maximum price filter"
          />
        </div>
        <select
          className="px-3 py-2 justify-self-end w-40 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 hover:border-gray-400"
          value={stockFilter}
          onChange={(e) => setStockFilter(e.target.value as any)}
          aria-label="Filter products by stock status"
        >
          <option value="all">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <label className="flex items-center cursor-pointer group">
          <input
            type="checkbox"
            checked={showInactive}
            onChange={(e) => setShowInactive(e.target.checked)}
            className="mr-2 rounded focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            aria-label="Show inactive products"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900 transition-colors">Show Inactive Products</span>
        </label>
        <button
          className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-500 text-white rounded-lg hover:from-green-700 hover:to-green-600 active:scale-95 transition-all duration-200 font-medium shadow-md hover:shadow-lg flex items-center gap-2"
          onClick={() => exportToCSV(paginated)}
          aria-label="Export filtered products to CSV"
        >
          📥 Export to CSV
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-md">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-gray-900 to-gray-800 text-white">
              <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700 transition-colors group" onClick={() => handleSort('name')} role="button" tabIndex={0} aria-label="Sort by product name" onKeyPress={(e) => e.key === 'Enter' && handleSort('name')}>
                <div className="flex items-center gap-1">
                  Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </th>
              <th className="px-4 py-3 text-left">SKU</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => handleSort('price')} role="button" tabIndex={0} aria-label="Sort by price" onKeyPress={(e) => e.key === 'Enter' && handleSort('price')}>
                <div className="flex items-center gap-1">
                  Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </th>
              <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => handleSort('stock')} role="button" tabIndex={0} aria-label="Sort by stock" onKeyPress={(e) => e.key === 'Enter' && handleSort('stock')}>
                <div className="flex items-center gap-1">
                  Stock {sortBy === 'stock' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left cursor-pointer hover:bg-gray-700 transition-colors" onClick={() => handleSort('createdAt')} role="button" tabIndex={0} aria-label="Sort by creation date" onKeyPress={(e) => e.key === 'Enter' && handleSort('createdAt')}>
                <div className="flex items-center gap-1">
                  Created {sortBy === 'createdAt' && (sortOrder === 'asc' ? '↑' : '↓')}
                </div>
              </th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((product: any, index: number) => (
              <tr key={product.id} className={`border-b border-gray-200 transition-all duration-200 hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{product.name}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{product.sku}</td>
                <td className="px-4 py-3 text-sm"><span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">{product.category}</span></td>
                <td className="px-4 py-3 text-sm font-medium text-gray-900">${product.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${
                    product.stock === 0
                      ? 'bg-red-100 text-red-800'
                      : product.stock <= product.lowStockThreshold
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`} aria-label={`Stock: ${product.stock}`}>
                    {product.stock}
                    {product.stock <= product.lowStockThreshold && product.stock > 0 && (
                      <span className="ml-1" aria-label="low stock warning">⚠️</span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium transition-colors duration-200 ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-300 text-gray-800'}`}>
                    {product.isActive ? '● Active' : '● Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {new Date(product.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex justify-center gap-2">
                    <button
                      className="px-3 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded transition-all duration-200 font-medium active:scale-95"
                      onClick={() => onEdit && onEdit(product)}
                      aria-label={`Edit product ${product.name}`}
                    >
                      ✎ Edit
                    </button>
                    <button
                      className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-all duration-200 font-medium active:scale-95"
                      onClick={() => handleDelete(product.id, product.name)}
                      aria-label={`Delete product ${product.name}`}
                    >
                      🗑 Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <div className="text-sm text-gray-700" role="status" aria-live="polite">
          Showing <strong>{paginated.length}</strong> of <strong>{totalItems}</strong> products
        </div>
        <div className="flex gap-2 items-center">
          <button
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium active:scale-95"
            disabled={!hasPrevPage}
            onClick={() => setPage(page - 1)}
            aria-label="Go to previous page"
          >
            ← Previous
          </button>
          <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium" aria-current="page">
            Page {currentPage} of {totalPages}
          </span>
          <button
            className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium active:scale-95"
            disabled={!hasNextPage}
            onClick={() => setPage(page + 1)}
            aria-label="Go to next page"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}