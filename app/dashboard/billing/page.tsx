import Header from '@/components/layout/Header';
import { getSession } from '@/lib/auth';
import { Plus, Download, Filter, MoreHorizontal, FileText } from 'lucide-react';

const invoices = [
  { id: 'INV-001', clientName: 'Acme Corp', amount: 4500.00, status: 'Paid', dueDate: '2024-01-15', service: 'CRM Implementation' },
  { id: 'INV-002', clientName: 'Stark Industries', amount: 12000.00, status: 'Pending', dueDate: '2024-01-28', service: 'Quarterly Audit' },
  { id: 'INV-003', clientName: 'Wayne Enterprises', amount: 850.00, status: 'Overdue', dueDate: '2024-01-10', service: 'Consulting' },
  { id: 'INV-004', clientName: 'Cyberdyne Systems', amount: 2300.00, status: 'Paid', dueDate: '2024-01-05', service: 'License Fee' },
  { id: 'INV-005', clientName: 'Oscorp', amount: 7500.00, status: 'Pending', dueDate: '2024-02-01', service: 'Integration Services' },
];

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'Paid': return 'bg-green-50 text-green-700 border-green-100';
    case 'Pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
    case 'Overdue': return 'bg-red-50 text-red-700 border-red-100';
    default: return 'bg-gray-50 text-gray-600 border-gray-100';
  }
};

export default async function BillingPage() {
  const session = await getSession();

  return (
    <>
      <Header
        title="Billing"
        user={session ? { name: session.name, email: session.email } : undefined}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-light text-gray-900">Billing & Invoices</h2>
              <p className="text-gray-500 text-sm mt-1">Manage subscriptions, invoices, and payment statuses.</p>
            </div>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-sm transition-colors">
              <Plus size={16} />
              Create Invoice
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex gap-2">
              <button className="px-3 py-1.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-md text-gray-700 flex items-center gap-2 hover:bg-gray-100">
                <Filter size={12} /> Filter
              </button>
              <button className="px-3 py-1.5 text-xs font-medium bg-gray-50 border border-gray-200 rounded-md text-gray-700 flex items-center gap-2 hover:bg-gray-100">
                <Download size={12} /> Export
              </button>
            </div>
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Invoice ID</th>
                  <th className="px-6 py-4">Client</th>
                  <th className="px-6 py-4">Service</th>
                  <th className="px-6 py-4">Date Due</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => (
                  <tr key={invoice.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      {invoice.id}
                    </td>
                    <td className="px-6 py-4">{invoice.clientName}</td>
                    <td className="px-6 py-4">{invoice.service}</td>
                    <td className="px-6 py-4">{invoice.dueDate}</td>
                    <td className="px-6 py-4 font-mono">${invoice.amount.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(invoice.status)}`}>
                        {invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-gray-400 hover:text-gray-600 p-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
