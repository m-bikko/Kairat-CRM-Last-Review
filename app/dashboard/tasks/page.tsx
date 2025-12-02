'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { ITask } from '@/models/Task';
import { Plus, Check, Circle, Edit2, Trash2, X, Calendar, CheckSquare } from 'lucide-react';

export default function TasksPage() {
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    status: 'pending' as 'pending' | 'in_progress' | 'completed',
    dueDate: '',
    assignee: '',
  });

  const priorityLabels: Record<string, string> = {
    high: 'Высокий',
    medium: 'Средний',
    low: 'Низкий',
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/tasks');
      const data = await response.json();
      if (data.tasks) {
        setTasks(data.tasks);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  const handleCreate = () => {
    setSelectedTask(null);
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      status: 'pending',
      dueDate: '',
      assignee: '',
    });
    setShowModal(true);
  };

  const handleEdit = (task: ITask) => {
    setSelectedTask(task);
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      assignee: task.assignee || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить эту задачу?')) return;

    try {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
      fetchTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const toggleTaskStatus = async (task: ITask) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await fetch(`/api/tasks/${task._id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      fetchTasks();
    } catch (error) {
      console.error('Error toggling task status:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = selectedTask ? `/api/tasks/${selectedTask._id}` : '/api/tasks';
      const method = selectedTask ? 'PATCH' : 'POST';

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setShowModal(false);
      fetchTasks();
    } catch (error) {
      console.error('Error saving task:', error);
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-50 text-red-600 border-red-100';
      case 'medium': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'low': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  const pendingTasks = tasks.filter(t => t.status !== 'completed');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  return (
    <>
      <Header title="Задачи" user={{ name: 'Администратор', email: 'admin@kairat.kz' }} />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-light text-gray-900">Управление задачами</h2>
            <p className="text-gray-500 text-sm mt-1">{pendingTasks.length} в работе, {completedTasks.length} выполнено</p>
          </div>
          <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
            <Plus size={16} />
            Добавить задачу
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pending Tasks */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">В работе</h3>
            <div className="space-y-3">
              {pendingTasks.map((task) => (
                <div key={task._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className="mt-0.5 w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-indigo-500 transition-colors"
                    >
                      <Circle size={12} className="text-gray-300" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-gray-900 truncate">{task.title}</h4>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleEdit(task)}
                            className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDelete(task._id || '')}
                            className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-1">{task.description}</p>
                      <div className="flex items-center gap-3 mt-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium border ${getPriorityColor(task.priority)}`}>
                          {priorityLabels[task.priority] || task.priority}
                        </span>
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Calendar size={10} />
                            {new Date(task.dueDate).toLocaleDateString('ru-RU')}
                          </span>
                        )}
                        {task.assignee && (
                          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-[10px] font-medium">
                            {task.assignee.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {pendingTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <CheckSquare size={32} className="mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Нет задач в работе</p>
                </div>
              )}
            </div>
          </div>

          {/* Completed Tasks */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Выполненные</h3>
            <div className="space-y-3">
              {completedTasks.map((task) => (
                <div key={task._id} className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm opacity-60 group">
                  <div className="flex items-start gap-3">
                    <button
                      onClick={() => toggleTaskStatus(task)}
                      className="mt-0.5 w-5 h-5 rounded-full bg-green-500 flex items-center justify-center"
                    >
                      <Check size={12} className="text-white" />
                    </button>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h4 className="font-medium text-gray-500 line-through truncate">{task.title}</h4>
                        <button
                          onClick={() => handleDelete(task._id || '')}
                          className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                      <p className="text-sm text-gray-400 mt-1 line-clamp-1">{task.description}</p>
                    </div>
                  </div>
                </div>
              ))}
              {completedTasks.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  <p className="text-sm">Нет выполненных задач</p>
                </div>
              )}
            </div>
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
                {selectedTask ? 'Редактировать задачу' : 'Новая задача'}
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
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Связаться с клиентом"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Подробности задачи..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Приоритет</label>
                  <select
                    className="input-field"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as 'high' | 'medium' | 'low' })}
                  >
                    <option value="low">Низкий</option>
                    <option value="medium">Средний</option>
                    <option value="high">Высокий</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Статус</label>
                  <select
                    className="input-field"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as 'pending' | 'in_progress' | 'completed' })}
                  >
                    <option value="pending">Ожидает</option>
                    <option value="in_progress">В работе</option>
                    <option value="completed">Выполнено</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Срок</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Исполнитель</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.assignee}
                    onChange={(e) => setFormData({ ...formData, assignee: e.target.value })}
                    placeholder="Асет Нурланов"
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
                disabled={loading || !formData.title}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Сохранение...
                  </span>
                ) : (
                  selectedTask ? 'Обновить' : 'Создать'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
