import Header from '@/components/layout/Header';
import { getSession } from '@/lib/auth';
import { ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';

const transactions = [
  { id: '1', description: 'Payment from Acme Corp', amount: 15000, type: 'income', date: '2024-01-15', status: 'Completed' },
  { id: '2', description: 'Software License', amount: -2500, type: 'expense', date: '2024-01-14', status: 'Completed' },
  { id: '3', description: 'Payment from Wayne Ent', amount: 35000, type: 'income', date: '2024-01-13', status: 'Pending' },
  { id: '4', description: 'Marketing Campaign', amount: -8000, type: 'expense', date: '2024-01-12', status: 'Completed' },
  { id: '5', description: 'Consulting Fee', amount: 12000, type: 'income', date: '2024-01-11', status: 'Completed' },
];

export default async function FinancePage() {
  const session = await getSession();

  return (
    <>
      <Header
        title="Finance"
        user={session ? { name: session.name, email: session.email } : undefined}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {/* Finance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Total Revenue</span>
                <div className="p-2 rounded-lg bg-green-50">
                  <DollarSign size={16} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">$248,500</h3>
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium mt-2">
                <ArrowUpRight size={12} />
                +18.2% vs last month
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Expenses</span>
                <div className="p-2 rounded-lg bg-red-50">
                  <CreditCard size={16} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">$42,300</h3>
              <div className="flex items-center gap-1 text-red-600 text-xs font-medium mt-2">
                <ArrowDownRight size={12} />
                +5.4% vs last month
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Net Profit</span>
                <div className="p-2 rounded-lg bg-purple-50">
                  <TrendingUp size={16} className="text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">$206,200</h3>
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium mt-2">
                <ArrowUpRight size={12} />
                +22.1% vs last month
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Outstanding</span>
                <div className="p-2 rounded-lg bg-orange-50">
                  <Wallet size={16} className="text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">$35,000</h3>
              <div className="flex items-center gap-1 text-orange-600 text-xs font-medium mt-2">
                3 pending invoices
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">Recent Transactions</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{tx.description}</td>
                    <td className="px-6 py-4 text-gray-500">{tx.date}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        tx.status === 'Completed'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                        {tx.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-mono font-medium ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'income' ? '+' : ''}{tx.amount.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}
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
