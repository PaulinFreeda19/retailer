import { useState } from "react";
import ProductForm from "@/features/inventory/components/ProductForm";
import ProductTable from "@/features/inventory/components/ProductTable";
import Button from "@/components/ui/Button";
import { useAppSelector } from "@/hooks/redux";

export default function InventoryPage() {
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const products = useAppSelector((s) => s.product.products);
  const lowStockProducts = products.filter(p => p.isActive && p.stock > 0 && p.stock <= p.lowStockThreshold);

  const handleAddProduct = () => {
    setEditingProduct(null);
    setShowForm(true);
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingProduct(null);
  };

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-900">Inventory Management</h1>
        <Button onClick={handleAddProduct}>+ Add New Product</Button>
      </div>

      {/* Low Stock Alerts */}
      {lowStockProducts.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 border-l-4 border-yellow-500 rounded-lg p-4 shadow-md transform transition-all duration-300 animate-slideDown" role="alert">
          <h3 className="text-lg font-bold text-yellow-900 mb-3 flex items-center gap-2">
            ⚠️ Low Stock Alerts ({lowStockProducts.length})
          </h3>
          <div className="space-y-2">
            {lowStockProducts.map(product => (
              <div key={product.id} className="text-sm text-yellow-800 bg-white bg-opacity-50 px-3 py-2 rounded flex items-center justify-between hover:bg-opacity-100 transition-all duration-200">
                <div>
                  <strong className="text-yellow-900">{product.name}</strong> - Only <strong>{product.stock}</strong> left
                </div>
                <span className="text-xs text-yellow-600 ml-2">(threshold: {product.lowStockThreshold})</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn" role="dialog" aria-modal="true" aria-labelledby="form-title">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all duration-300 relative">
            <button
              onClick={handleCloseForm}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-100 hover:bg-gray-200 rounded-full transition-all duration-200 hover:scale-110 active:scale-95 z-10"
              aria-label="Close form"
              title="Press Escape to close"
            >
              ✕
            </button>
            <div id="form-title" className="sr-only">
              {editingProduct ? 'Edit Product Form' : 'Add New Product Form'}
            </div>
            <ProductForm product={editingProduct} onClose={handleCloseForm} />
          </div>
        </div>
      )}

      <ProductTable onEdit={handleEditProduct} />
    </div>
  );
}