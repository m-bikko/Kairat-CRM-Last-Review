'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { IInvoice } from '@/models/Invoice';
import { Plus, Edit2, Trash2, X, FileText, Download } from 'lucide-react';

export default function BillingPage() {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<IInvoice | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    clientName: '',
    clientEmail: '',
    service: '',
    amount: 0,
    status: 'pending',
    dueDate: '',
    issueDate: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const statusLabels: Record<string, string> = {
    paid: 'Оплачено',
    pending: 'Ожидает',
    overdue: 'Просрочено',
    cancelled: 'Отменено',
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoices');
      const data = await response.json();
      if (data.invoices) {
        setInvoices(data.invoices);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

  const handleCreate = () => {
    setSelectedInvoice(null);
    setFormData({
      clientName: '',
      clientEmail: '',
      service: '',
      amount: 0,
      status: 'pending',
      dueDate: '',
      issueDate: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setShowModal(true);
  };

  const handleEdit = (invoice: IInvoice) => {
    setSelectedInvoice(invoice);
    setFormData({
      clientName: invoice.clientName,
      clientEmail: invoice.clientEmail || '',
      service: invoice.service,
      amount: invoice.amount,
      status: invoice.status,
      dueDate: new Date(invoice.dueDate).toISOString().split('T')[0],
      issueDate: new Date(invoice.issueDate).toISOString().split('T')[0],
      notes: invoice.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этот счёт?')) return;

    try {
      await fetch(`/api/invoices/${id}`, { method: 'DELETE' });
      fetchInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = selectedInvoice ? `/api/invoices/${selectedInvoice._id}` : '/api/invoices';
      const method = selectedInvoice ? 'PATCH' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setShowModal(false);
      fetchInvoices();
    } catch (error) {
      console.error('Error saving invoice:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-50 text-green-700 border-green-100';
      case 'pending': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'overdue': return 'bg-red-50 text-red-700 border-red-100';
      case 'cancelled': return 'bg-gray-50 text-gray-600 border-gray-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value) + ' ₸';
  };

  return (
    <>
      <Header title="Счета" user={{ name: 'Администратор', email: 'admin@kairat.kz' }} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-light text-gray-900">Выставление счетов</h2>
              <p className="text-gray-500 text-sm mt-1">Управляйте счетами и статусами оплаты.</p>
            </div>
            <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
              <Plus size={16} />
              Создать счёт
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50/50 text-gray-500 font-medium">
                <tr>
                  <th className="px-6 py-4">Номер счёта</th>
                  <th className="px-6 py-4">Клиент</th>
                  <th className="px-6 py-4">Услуга</th>
                  <th className="px-6 py-4">Срок оплаты</th>
                  <th className="px-6 py-4">Сумма</th>
                  <th className="px-6 py-4">Статус</th>
                  <th className="px-6 py-4 text-right">Действия</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.map((invoice) => (
                  <tr key={invoice._id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-2">
                      <FileText size={14} className="text-gray-400" />
                      {invoice.invoiceNumber}
                    </td>
                    <td className="px-6 py-4">{invoice.clientName}</td>
                    <td className="px-6 py-4">{invoice.service}</td>
                    <td className="px-6 py-4">{new Date(invoice.dueDate).toLocaleDateString('ru-RU')}</td>
                    <td className="px-6 py-4 font-mono">{formatCurrency(invoice.amount)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(invoice.status)}`}>
                        {statusLabels[invoice.status] || invoice.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(invoice)}
                          className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded transition-colors"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDelete(invoice._id || '')}
                          className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {invoices.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-400">
                      <FileText size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-gray-500">Счетов не найдено</p>
                      <p className="text-sm">Создайте первый счёт для начала работы.</p>
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
                {selectedInvoice ? 'Редактировать счёт' : 'Новый счёт'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[calc(90vh-140px)]">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Клиент *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    required
                    placeholder="ТОО Казахстан"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email клиента</label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.clientEmail}
                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                    placeholder="client@example.kz"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Услуга *</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.service}
                  onChange={(e) => setFormData({ ...formData, service: e.target.value })}
                  required
                  placeholder="Внедрение CRM"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Статус</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Ожидает</option>
                    <option value="paid">Оплачено</option>
                    <option value="overdue">Просрочено</option>
                    <option value="cancelled">Отменено</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Дата выставления</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Срок оплаты *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    required
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
                disabled={loading || !formData.clientName || !formData.service || !formData.amount || !formData.dueDate}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Сохранение...
                  </span>
                ) : (
                  selectedInvoice ? 'Обновить' : 'Создать'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
