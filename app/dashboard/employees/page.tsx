'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { IEmployee } from '@/models/Employee';
import { Plus, Edit2, Trash2, X, Users, Mail, Phone, MapPin, Briefcase } from 'lucide-react';

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    location: '',
    status: 'active',
    salary: 0,
    hireDate: '',
    notes: '',
  });

  const statusLabels: Record<string, string> = {
    active: 'Активный',
    on_leave: 'В отпуске',
    terminated: 'Уволен',
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await fetch('/api/employees');
      const data = await response.json();
      if (data.employees) {
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  const handleCreate = () => {
    setSelectedEmployee(null);
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      location: '',
      status: 'active',
      salary: 0,
      hireDate: '',
      notes: '',
    });
    setShowModal(true);
  };

  const handleEdit = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setFormData({
      name: employee.name,
      email: employee.email,
      phone: employee.phone || '',
      role: employee.role,
      department: employee.department || '',
      location: employee.location || '',
      status: employee.status,
      salary: employee.salary || 0,
      hireDate: employee.hireDate ? new Date(employee.hireDate).toISOString().split('T')[0] : '',
      notes: employee.notes || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить этого сотрудника?')) return;

    try {
      await fetch(`/api/employees/${id}`, { method: 'DELETE' });
      fetchEmployees();
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = selectedEmployee ? `/api/employees/${selectedEmployee._id}` : '/api/employees';
      const method = selectedEmployee ? 'PATCH' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          hireDate: formData.hireDate ? new Date(formData.hireDate) : undefined,
        }),
      });

      setShowModal(false);
      fetchEmployees();
    } catch (error) {
      console.error('Error saving employee:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 text-green-700 border-green-100';
      case 'on_leave': return 'bg-yellow-50 text-yellow-700 border-yellow-100';
      case 'terminated': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('ru-RU').format(value) + ' ₸';
  };

  return (
    <>
      <Header title="Сотрудники" user={{ name: 'Администратор', email: 'admin@kairat.kz' }} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Команда</h2>
            <p className="text-gray-500 text-sm mt-1">Управляйте командой и ролями</p>
          </div>
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Добавить сотрудника
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {employees.map((employee) => (
            <div key={employee._id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-medium">
                  {getInitials(employee.name)}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(employee)}
                    className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded transition-colors"
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDelete(employee._id || '')}
                    className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded transition-colors"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>

              <h3 className="font-medium text-gray-900">{employee.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{employee.role}</p>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-500">
                  <Mail size={14} />
                  <span className="truncate">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Phone size={14} />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.location && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <MapPin size={14} />
                    <span>{employee.location}</span>
                  </div>
                )}
                {employee.department && (
                  <div className="flex items-center gap-2 text-gray-500">
                    <Briefcase size={14} />
                    <span>{employee.department}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyle(employee.status)}`}>
                  {statusLabels[employee.status] || employee.status}
                </span>
              </div>
            </div>
          ))}

          {employees.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-gray-400">
              <Users size={48} className="mb-4 opacity-50" />
              <p className="text-lg font-medium text-gray-500">Сотрудников не найдено</p>
              <p className="text-sm">Добавьте первого члена команды для начала работы.</p>
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
                {selectedEmployee ? 'Редактировать сотрудника' : 'Новый сотрудник'}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">ФИО *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    placeholder="Асет Нурланов"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email *</label>
                  <input
                    type="email"
                    className="input-field"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    placeholder="aset@company.kz"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Должность *</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    placeholder="Менеджер по продажам"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Отдел</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    placeholder="Продажи"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Город</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Алматы"
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
                    <option value="active">Активный</option>
                    <option value="on_leave">В отпуске</option>
                    <option value="terminated">Уволен</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Дата найма</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Зарплата (₸)</label>
                <input
                  type="number"
                  className="input-field"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: Number(e.target.value) })}
                  placeholder="500000"
                />
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
                disabled={loading || !formData.name || !formData.email || !formData.role}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Сохранение...
                  </span>
                ) : (
                  selectedEmployee ? 'Обновить' : 'Создать'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
