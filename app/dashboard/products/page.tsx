'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { IProduct } from '@/models/Product';
import { Plus, Edit2, Trash2, X, Package, Tag, DollarSign } from 'lucide-react';

export default function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<IProduct | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 'unlimited' as 'unlimited' | 'limited' | 'out_of_stock',
    stockQuantity: 0,
    status: 'active' as 'active' | 'draft' | 'archived',
    sku: '',
  });

  const statusLabels: Record<string, string> = {
    active: 'Активный',
    draft: 'Черновик',
    archived: 'Архив',
  };

  const stockLabels: Record<string, string> = {
    unlimited: 'Неограничено',
    limited: 'Ограничено',
    out_of_stock: 'Нет в наличии',
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      const data = await response.json();
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const handleCreate = () => {
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: 0,
      category: '',
      stock: 'unlimited',
      stockQuantity: 0,
      status: 'active',
      sku: '',
    });
    setShowModal(true);
  };

  const handleEdit = (product: IProduct) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      category: product.category,
      stock: product.stock,
      stockQuantity: product.stockQuantity || 0,
      status: product.status,
      sku: product.sku || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот продукт?')) return;

    try {
      await fetch(`/api/products/${id}`, { method: 'DELETE' });
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = selectedProduct ? `/api/products/${selectedProduct._id}` : '/api/products';
      const method = selectedProduct ? 'PATCH' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setShowModal(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-100';
      case 'draft': return 'bg-gray-50 text-gray-600 border-gray-100';
      case 'archived': return 'bg-red-50 text-red-600 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value) + ' ₸';
  };

  return (
    <>
      <Header title="Продукты" user={{ name: 'Администратор', email: 'admin@kairat.kz' }} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Продукты и услуги</h2>
            <p className="text-gray-500 text-sm mt-1">Управляйте каталогом продуктов</p>
          </div>
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Добавить продукт
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Package size={20} className="text-indigo-600" />
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(product)}
                    className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(product._id || '')}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-xl font-semibold text-gray-900">
                  {formatCurrency(product.price)}
                  <span className="text-sm font-normal text-gray-400">/мес</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(product.status)}`}>
                  {statusLabels[product.status] || product.status}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Tag size={10} />
                  {product.category}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">
                  {stockLabels[product.stock] || product.stock}
                </span>
              </div>
            </div>
          ))}

          {products.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <Package size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-500">Продуктов не найдено</p>
              <p className="text-sm">Добавьте первый продукт для начала работы.</p>
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setShowModal(false)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          <div
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                {selectedProduct ? 'Редактировать продукт' : 'Новый продукт'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Название *</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="CRM Корпоративный"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Описание продукта..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Цена (₸) *</label>
                  <input
                    type="number"
                    step="1"
                    className="input-field"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    required
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    required
                    placeholder="Программное обеспечение"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Наличие</label>
                  <select
                    className="input-field"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value as 'unlimited' | 'limited' | 'out_of_stock' })}
                  >
                    <option value="unlimited">Неограничено</option>
                    <option value="limited">Ограничено</option>
                    <option value="out_of_stock">Нет в наличии</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Статус</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'active' | 'draft' | 'archived' })}
                  >
                    <option value="active">Активный</option>
                    <option value="draft">Черновик</option>
                    <option value="archived">Архив</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {formData.stock === 'limited' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Количество</label>
                    <input
                      type="number"
                      className="input-field"
                      value={formData.stockQuantity}
                      onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                      placeholder="100"
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Артикул</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="PRD-001"
                  />
                </div>
              </div>
            </form>

            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-100 bg-gray-50">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Отмена
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !formData.name || !formData.price || !formData.category}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Сохранение...
                  </span>
                ) : (
                  selectedProduct ? 'Обновить' : 'Создать'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
