'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { ITransaction } from '@/models/Transaction';
import { Plus, Edit2, Trash2, X, ArrowUpRight, ArrowDownRight, DollarSign, TrendingUp, CreditCard, Wallet } from 'lucide-react';

interface Stats {
  totalIncome: number;
  totalExpenses: number;
  netProfit: number;
  pendingAmount: number;
}

export default function FinancePage() {
  const [transactions, setTransactions] = useState<ITransaction[]>([]);
  const [stats, setStats] = useState<Stats>({ totalIncome: 0, totalExpenses: 0, netProfit: 0, pendingAmount: 0 });
  const [showModal, setShowModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<ITransaction | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    amount: 0,
    type: 'income' as 'income' | 'expense',
    category: '',
    date: new Date().toISOString().split('T')[0],
    status: 'pending',
    reference: '',
    notes: '',
  });

  const statusLabels: Record<string, string> = {
    completed: 'Завершено',
    pending: 'В ожидании',
    cancelled: 'Отменено',
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      if (data.transactions) {
        setTransactions(data.transactions);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleCreate = () => {
    setSelectedTransaction(null);
    setFormData({
      description: '',
      amount: 0,
      type: 'income',
      category: '',
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      reference: '',
      notes: '',
    });
    setShowModal(true);
  };

  const handleEdit = (transaction: ITransaction) => {
    setSelectedTransaction(transaction);
    setFormData({
      description: transaction.description,
      amount: Math.abs(transaction.amount),
      type: transaction.type,
      category: transaction.category || '',
      date: new Date(transaction.date).toISOString().split('T')[0],
      status: transaction.status,
      reference: transaction.reference || '',
      notes: transaction.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту транзакцию?')) return;

    try {
      await fetch(`/api/transactions/${id}`, { method: 'DELETE' });
      fetchTransactions();
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = selectedTransaction ? `/api/transactions/${selectedTransaction._id}` : '/api/transactions';
      const method = selectedTransaction ? 'PATCH' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setShowModal(false);
      fetchTransactions();
    } catch (error) {
      console.error('Error saving transaction:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ru-RU').format(amount) + ' ₸';
  };

  return (
    <>
      <Header title="Финансы" user={{ name: 'Администратор', email: 'admin@kairat.kz' }} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-light text-gray-900">Финансовый обзор</h2>
              <p className="text-gray-500 text-sm mt-1">Отслеживайте доходы и расходы</p>
            </div>
            <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
              <Plus size={16} />
              Добавить транзакцию
            </button>
          </div>

          {/* Finance Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Общий доход</span>
                <div className="p-2 rounded-lg bg-green-50">
                  <DollarSign size={16} className="text-green-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalIncome)}</h3>
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium mt-2">
                <ArrowUpRight size={12} />
                Доход за период
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Расходы</span>
                <div className="p-2 rounded-lg bg-red-50">
                  <CreditCard size={16} className="text-red-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.totalExpenses)}</h3>
              <div className="flex items-center gap-1 text-red-600 text-xs font-medium mt-2">
                <ArrowDownRight size={12} />
                Расходы за период
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">Чистая прибыль</span>
                <div className="p-2 rounded-lg bg-purple-50">
                  <TrendingUp size={16} className="text-purple-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.netProfit)}</h3>
              <div className="flex items-center gap-1 text-green-600 text-xs font-medium mt-2">
                <ArrowUpRight size={12} />
                Итого за период
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 font-medium">В ожидании</span>
                <div className="p-2 rounded-lg bg-orange-50">
                  <Wallet size={16} className="text-orange-600" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900">{formatCurrency(stats.pendingAmount)}</h3>
              <div className="flex items-center gap-1 text-orange-600 text-xs font-medium mt-2">
                Ожидающие транзакции
              </div>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-medium text-gray-900">Последние транзакции</h3>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Описание</th>
                  <th className="px-6 py-4">Категория</th>
                  <th className="px-6 py-4">Дата</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4 text-right">Сумма</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((tx) => (
                  <tr key={tx._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900">{tx.description}</td>
                    <td className="px-6 py-4 text-gray-500">{tx.category || '-'}</td>
                    <td className="px-6 py-4 text-gray-500">{new Date(tx.date).toLocaleDateString('ru-RU')}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        tx.status === 'completed'
                          ? 'bg-green-50 text-green-700 border-green-100'
                          : tx.status === 'cancelled'
                          ? 'bg-red-50 text-red-700 border-red-100'
                          : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                      }`}>
                        {statusLabels[tx.status] || tx.status}
                      </span>
                    </td>
                    <td className={`px-6 py-4 text-right font-mono font-medium ${
                      tx.type === 'income' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {tx.type === 'income' ? '+' : '-'}{formatCurrency(Math.abs(tx.amount))}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(tx)}
                          className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(tx._id || '')}
                          className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {transactions.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                      Транзакций не найдено. Добавьте первую транзакцию для начала работы.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                {selectedTransaction ? 'Редактировать транзакцию' : 'Новая транзакция'}
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
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание *</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  placeholder="Оплата от клиента..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Тип *</label>
                  <select
                    className="input-field"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' | 'expense' })}
                  >
                    <option value="income">Доход</option>
                    <option value="expense">Расход</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Сумма (₸) *</label>
                  <input
                    type="number"
                    step="1"
                    className="input-field"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    required
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Категория</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="Продажи, Маркетинг и т.д."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Дата</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Статус</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">В ожидании</option>
                    <option value="completed">Завершено</option>
                    <option value="cancelled">Отменено</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Референс</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.reference}
                    onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                    placeholder="СЧ-001 и т.д."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Заметки</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Дополнительные заметки..."
                />
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
                disabled={loading || !formData.description || !formData.amount}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Сохранение...
                  </span>
                ) : (
                  selectedTransaction ? 'Обновить' : 'Создать'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
