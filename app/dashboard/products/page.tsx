import Header from '@/components/layout/Header';
import { getSession } from '@/lib/auth';
import { Plus, MoreHorizontal, Package, Tag, DollarSign } from 'lucide-react';

const products = [
  { id: '1', name: 'CRM Enterprise', description: 'Full-featured CRM solution', price: 299, category: 'Software', stock: 'Unlimited', status: 'Active' },
  { id: '2', name: 'CRM Pro', description: 'Professional CRM package', price: 149, category: 'Software', stock: 'Unlimited', status: 'Active' },
  { id: '3', name: 'CRM Starter', description: 'Basic CRM for small teams', price: 49, category: 'Software', stock: 'Unlimited', status: 'Active' },
  { id: '4', name: 'Implementation Service', description: '40 hours of setup & training', price: 2500, category: 'Service', stock: 'Limited', status: 'Active' },
  { id: '5', name: 'Premium Support', description: '24/7 priority support plan', price: 99, category: 'Service', stock: 'Unlimited', status: 'Draft' },
];

export default async function ProductsPage() {
  const session = await getSession();

  return (
    <>
      <Header
        title="Products"
        user={session ? { name: session.name, email: session.email } : undefined}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Products & Services</h2>
            <p className="text-gray-500 text-sm mt-1">Manage your product catalog</p>
          </div>
          <button className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Add Product
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                  <Package size={20} className="text-indigo-600" />
                </div>
                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreHorizontal size={16} />
                </button>
              </div>

              <h3 className="font-medium text-gray-900 mb-1">{product.name}</h3>
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">{product.description}</p>

              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-1 text-xl font-semibold text-gray-900">
                  <DollarSign size={16} />
                  {product.price}
                  <span className="text-sm font-normal text-gray-400">/mo</span>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                  product.status === 'Active'
                    ? 'bg-green-50 text-green-700 border-green-100'
                    : 'bg-gray-50 text-gray-600 border-gray-100'
                }`}>
                  {product.status}
                </span>
              </div>

              <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Tag size={10} />
                  {product.category}
                </span>
                <span className="text-gray-300">|</span>
                <span className="text-xs text-gray-500">
                  Stock: {product.stock}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
