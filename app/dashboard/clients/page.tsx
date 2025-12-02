'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { IClient } from '@/models/Client';
import { Plus, Edit2, Trash2, X, Users, Mail, Phone, Globe, Building } from 'lucide-react';

export default function ClientsPage() {
  const [clients, setClients] = useState<IClient[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selectedClient, setSelectedClient] = useState<IClient | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    address: '',
    group: 'ungrouped',
    status: 'prospect',
    totalValue: 0,
    notes: '',
  });

  const groups = [
    { id: 'all', label: 'Все' },
    { id: 'ungrouped', label: 'Без группы' },
    { id: 'enterprise', label: 'Корпорации' },
    { id: 'smb', label: 'Малый бизнес' },
    { id: 'startup', label: 'Стартапы' },
    { id: 'partner', label: 'Партнёры' },
  ];

  const statusLabels: Record<string, string> = {
    active: 'Активный',
    inactive: 'Неактивный',
    prospect: 'Потенциальный',
  };

  useEffect(() => {
    fetchClients();
  }, [selectedGroup]);

  const fetchClients = async () => {
    try {
      const url = selectedGroup === 'all'
        ? '/api/clients'
        : `/api/clients?group=${selectedGroup}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.clients) {
        setClients(data.clients);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleCreate = () => {
    setSelectedClient(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      company: '',
      website: '',
      address: '',
      group: 'ungrouped',
      status: 'prospect',
      totalValue: 0,
      notes: '',
    });
    setShowModal(true);
  };

  const handleEdit = (client: IClient) => {
    setSelectedClient(client);
    setFormData({
      name: client.name,
      email: client.email || '',
      phone: client.phone || '',
      company: client.company || '',
      website: client.website || '',
      address: client.address || '',
      group: client.group || 'ungrouped',
      status: client.status,
      totalValue: client.totalValue || 0,
      notes: client.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого клиента?')) return;

    try {
      await fetch(`/api/clients/${id}`, { method: 'DELETE' });
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = selectedClient ? `/api/clients/${selectedClient._id}` : '/api/clients';
      const method = selectedClient ? 'PATCH' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setShowModal(false);
      fetchClients();
    } catch (error) {
      console.error('Error saving client:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-100';
      case 'inactive': return 'bg-gray-50 text-gray-600 border-gray-100';
      case 'prospect': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value) + ' ₸';
  };

  return (
    <>
      <Header title="Клиенты" user={{ name: 'Администратор', email: 'admin@kairat.kz' }} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Управление клиентами</h2>
            <p className="text-gray-500 text-sm mt-1">Управляйте отношениями с клиентами</p>
          </div>
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Новый клиент
          </button>
        </div>

        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          {groups.map((group) => (
            <button
              key={group.id}
              onClick={() => setSelectedGroup(group.id)}
              className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap transition-all ${
                selectedGroup === group.id
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {group.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.map((client) => (
            <div
              key={client._id}
              className={`bg-white p-5 rounded-2xl border shadow-sm hover:shadow-md transition-all group ${
                client.status === 'active' ? 'border-green-100' :
                client.status === 'inactive' ? 'border-gray-200' : 'border-gray-100'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-medium">
                    {client.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{client.name}</h3>
                    {client.company && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Building size={10} />
                        {client.company}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(client)}
                    className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(client._id || '')}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {client.email && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Mail size={12} />
                    <span className="truncate">{client.email}</span>
                  </div>
                )}
                {client.phone && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Phone size={12} />
                    <span>{client.phone}</span>
                  </div>
                )}
                {client.website && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Globe size={12} />
                    <span className="truncate">{client.website}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(client.status)}`}>
                  {statusLabels[client.status] || client.status}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {formatCurrency(client.totalValue || 0)}
                </span>
              </div>
            </div>
          ))}

          {clients.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <Users size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-500">Клиентов не найдено</p>
              <p className="text-sm">Добавьте первого клиента для начала работы.</p>
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
                {selectedClient ? 'Редактировать клиента' : 'Новый клиент'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    autoFocus
                    placeholder="Нурлан Сериков"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Компания</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    placeholder="ТОО Казахстан"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="nurlan@example.kz"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Телефон</label>
                  <input
                    type="tel"
                    className="input-field"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (777) 123-45-67"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Веб-сайт</label>
                <input
                  type="url"
                  className="input-field"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  placeholder="https://example.kz"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Адрес</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="г. Алматы, ул. Абая 1"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Группа</label>
                  <select
                    className="input-field"
                    value={formData.group}
                    onChange={(e) => setFormData({ ...formData, group: e.target.value })}
                  >
                    <option value="ungrouped">Без группы</option>
                    <option value="enterprise">Корпорация</option>
                    <option value="smb">Малый бизнес</option>
                    <option value="startup">Стартап</option>
                    <option value="partner">Партнёр</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Статус</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="prospect">Потенциальный</option>
                    <option value="active">Активный</option>
                    <option value="inactive">Неактивный</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Общая сумма (₸)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.totalValue}
                  onChange={(e) => setFormData({ ...formData, totalValue: Number(e.target.value) })}
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Заметки</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Дополнительные заметки о клиенте..."
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
                disabled={loading || !formData.name}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Сохранение...
                  </span>
                ) : (
                  selectedClient ? 'Обновить' : 'Создать'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
