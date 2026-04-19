import { useState, useEffect } from "react";
import { useAppDispatch } from "@/hooks/redux";
import { addProduct, editProduct } from "@/store/slices/productSlice";
import { v4 as uuidv4 } from "uuid";

import { required } from "@/lib/validations";

interface ProductFormProps {
  product?: any;
  onClose?: () => void;
}

export default function ProductForm({ product, onClose }: ProductFormProps) {
  const dispatch = useAppDispatch();
  const isEdit = !!product;
  const [loading, setLoading] = useState(false);

  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({
    name: '',
    sku: '',
    category: 'General',
    description: '',
    price: '',
    costPrice: '',
    stock: '',
    lowStockThreshold: '',
    images: [],
    tags: [],
    isActive: true,
  });
  const [errors, setErrors] = useState<any>({});

  useEffect(() => {
    if (product) {
      setForm({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || 'General',
        description: product.description || '',
        price: product.price || '',
        costPrice: product.costPrice || '',
        stock: product.stock || '',
        lowStockThreshold: product.lowStockThreshold || '',
        images: product.images || [],
        tags: product.tags || [],
        isActive: product.isActive !== false,
      });
    }
  }, [product]);

  const validateStep = (stepNum: number) => {
    const newErrors: any = {};
    if (stepNum === 1) {
      const nameCheck = required(form.name);
      if (!nameCheck.valid) newErrors.name = nameCheck.message;
    }
    if (stepNum === 2) {
      if (!form.price || isNaN(Number(form.price))) newErrors.price = 'Valid price required';
      if (form.stock !== '' && isNaN(Number(form.stock))) newErrors.stock = 'Valid stock required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    setStep(step - 1);
  };

  const handleFileUpload = (files: File[]) => {
    const validFiles = files.filter(file => file.type.startsWith('image/')).slice(0, 5 - form.images.length);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setForm((prev: any) => ({ ...prev, images: [...prev.images, result] }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setForm((prev: any) => ({ ...prev, images: prev.images.filter((_: any, i: number) => i !== index) }));
  };

  const handleSubmit = () => {
    if (!validateStep(step)) return;

    setLoading(true);
    setTimeout(() => {
      const productData = {
        id: product?.id || uuidv4(),
        name: form.name,
        sku: form.sku,
        category: form.category,
        price: Number(form.price),
        costPrice: Number(form.costPrice) || 0,
        stock: Number(form.stock) || 0,
        lowStockThreshold: Number(form.lowStockThreshold) || 5,
        images: form.images,
        description: form.description,
        tags: form.tags,
        isActive: form.isActive,
        createdAt: product?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      if (isEdit) {
        dispatch(editProduct(productData));
      } else {
        dispatch(addProduct(productData));
      }

      setLoading(false);
      if (onClose) onClose();
    }, 500);
  };

  const inputClass = "w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const btnClass = "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition";

  return (
    <div className="bg-white p-4 md:p-8 rounded-2xl shadow-lg max-w-2xl mx-auto transform transition-all duration-300 animate-fadeIn">
      <div className="mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-900" role="heading" aria-level={1}>
          {isEdit ? 'Edit Product' : 'Add New Product'}
        </h2>
        <p className="text-sm text-gray-500 text-center mt-2" aria-live="polite" aria-atomic="true">
          Step {step} of 4
        </p>
        <div className="w-full bg-gray-200 h-2 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-600 to-blue-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${(step / 4) * 100}%` }}
            role="progressbar"
            aria-valuenow={step}
            aria-valuemin={1}
            aria-valuemax={4}
          />
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-fadeIn">
          <div>
            <label htmlFor="product-name" className="block text-sm font-medium mb-2 text-gray-700">
              Product Name <span className="text-red-500" aria-label="required">*</span>
            </label>
            <input
              id="product-name"
              className={`${inputClass} transition-all duration-200 hover:border-blue-400 focus:scale-100`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              aria-required="true"
              aria-invalid={!!errors.name}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="text-red-500 text-sm mt-2 flex items-center gap-1 animate-slideDown">
                <span aria-label="error">⚠️</span> {errors.name}
              </p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">SKU</label>
            <input className={inputClass} value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select className={inputClass} value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option>General</option>
              <option>Electronics</option>
              <option>Clothing</option>
              <option>Books</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea className={inputClass} rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Price *</label>
            <input className={inputClass} type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Cost Price</label>
            <input className={inputClass} type="number" step="0.01" value={form.costPrice} onChange={(e) => setForm({ ...form, costPrice: e.target.value })} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Stock Quantity</label>
            <input className={inputClass} type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
            {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock}</p>}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
            <input className={inputClass} type="number" value={form.lowStockThreshold} onChange={(e) => setForm({ ...form, lowStockThreshold: e.target.value })} />
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Product Images (Max 5 files)</label>
            <div
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
              onDrop={(e) => {
                e.preventDefault();
                const files = Array.from(e.dataTransfer.files);
                handleFileUpload(files);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <div className="space-y-2">
                <div className="text-4xl">📁</div>
                <p className="text-gray-600">Drag & drop images here, or click to select</p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => handleFileUpload(Array.from(e.target.files || []))}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-block px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                >
                  Choose Files
                </label>
              </div>
            </div>
            {form.images.length > 0 && (
              <div className="mt-4">
                <p className="text-sm text-gray-600 mb-2">Selected images ({form.images.length}/5):</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {form.images.map((url: string, index: number) => (
                    <div key={index} className="relative">
                      <img
                        src={url}
                        alt={`Product ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-5 h-5 text-xs hover:bg-red-600"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tags</label>
            <input
              className={inputClass}
              placeholder="Enter tags separated by commas"
              value={form.tags.join(', ')}
              onChange={(e) => setForm({ ...form, tags: e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag) })}
            />
          </div>
        </div>
      )}

      {step === 4 && (
        <div className="space-y-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                className="mr-2"
              />
              Active Product
            </label>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-medium mb-2">Summary</h3>
            <p><strong>Name:</strong> {form.name}</p>
            <p><strong>Price:</strong> ${form.price}</p>
            <p><strong>Stock:</strong> {form.stock}</p>
            <p><strong>Category:</strong> {form.category}</p>
          </div>
        </div>
      )}

      <div className="flex justify-between gap-3 mt-8 pt-6 border-t border-gray-200">
        {step > 1 && (
          <button
            className={`${btnClass} bg-gray-500 hover:bg-gray-600 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200`}
            onClick={handlePrev}
            disabled={loading}
            aria-label="Go to previous step"
          >
            ← Previous
          </button>
        )}
        {step < 4 ? (
          <button
            className={`${btnClass} active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ml-auto`}
            onClick={handleNext}
            disabled={loading}
            aria-label="Go to next step"
          >
            Next →
          </button>
        ) : (
          <button
            className={`${btnClass} active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ml-auto flex items-center gap-2`}
            onClick={handleSubmit}
            disabled={loading}
            aria-label={isEdit ? 'Update product' : 'Create product'}
          >
            {loading ? (
              <>
                <span className="inline-block animate-spin">⏳</span>
                {isEdit ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              <>{isEdit ? '✓ Update Product' : '✓ Create Product'}</>
            )}
          </button>
        )}
      </div>
    </div>
  );
}