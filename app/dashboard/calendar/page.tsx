'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import { IEvent } from '@/models/Event';
import { ChevronLeft, ChevronRight, Plus, Edit2, Trash2, X, Calendar } from 'lucide-react';

const HOURS = Array.from({ length: 11 }, (_, i) => i + 8);
const DAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт'];

const colorOptions = [
  { value: 'indigo', label: 'Индиго', classes: 'bg-indigo-50 border-indigo-500 text-indigo-900' },
  { value: 'purple', label: 'Фиолетовый', classes: 'bg-purple-50 border-purple-500 text-purple-900' },
  { value: 'green', label: 'Зелёный', classes: 'bg-green-50 border-green-500 text-green-900' },
  { value: 'red', label: 'Красный', classes: 'bg-red-50 border-red-500 text-red-900' },
  { value: 'orange', label: 'Оранжевый', classes: 'bg-orange-50 border-orange-500 text-orange-900' },
  { value: 'blue', label: 'Синий', classes: 'bg-blue-50 border-blue-500 text-blue-900' },
];

export default function CalendarPage() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    startTime: '09:00',
    endDate: '',
    endTime: '10:00',
    color: 'indigo',
    location: '',
  });

  useEffect(() => {
    fetchEvents();
  }, [currentDate]);

  const fetchEvents = async () => {
    try {
      const response = await fetch('/api/events');
      const data = await response.json();
      if (data.events) {
        setEvents(data.events);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const handleCreate = () => {
    setSelectedEvent(null);
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      title: '',
      description: '',
      startDate: today,
      startTime: '09:00',
      endDate: today,
      endTime: '10:00',
      color: 'indigo',
      location: '',
    });
    setShowModal(true);
  };

  const handleEdit = (event: IEvent) => {
    setSelectedEvent(event);
    const start = new Date(event.startDate);
    const end = new Date(event.endDate);
    setFormData({
      title: event.title,
      description: event.description || '',
      startDate: start.toISOString().split('T')[0],
      startTime: start.toTimeString().slice(0, 5),
      endDate: end.toISOString().split('T')[0],
      endTime: end.toTimeString().slice(0, 5),
      color: event.color || 'indigo',
      location: event.location || '',
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Вы уверены, что хотите удалить это событие?')) return;

    try {
      await fetch(`/api/events/${id}`, { method: 'DELETE' });
      fetchEvents();
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = selectedEvent ? `/api/events/${selectedEvent._id}` : '/api/events';
      const method = selectedEvent ? 'PATCH' : 'POST';

      const startDate = new Date(`${formData.startDate}T${formData.startTime}`);
      const endDate = new Date(`${formData.endDate}T${formData.endTime}`);

      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          startDate,
          endDate,
          color: formData.color,
          location: formData.location,
        }),
      });

      setShowModal(false);
      fetchEvents();
    } catch (error) {
      console.error('Error saving event:', error);
    } finally {
      setLoading(false);
    }
  };

  const getEventStyle = (color: string) => {
    const colorMap: Record<string, string> = {
      indigo: 'bg-indigo-50 border-l-4 border-indigo-500',
      purple: 'bg-purple-50 border-l-4 border-purple-500',
      green: 'bg-green-50 border-l-4 border-green-500',
      red: 'bg-red-50 border-l-4 border-red-500',
      orange: 'bg-orange-50 border-l-4 border-orange-500',
      blue: 'bg-blue-50 border-l-4 border-blue-500',
    };
    return colorMap[color] || colorMap.indigo;
  };

  const getEventTextColor = (color: string) => {
    const colorMap: Record<string, string> = {
      indigo: 'text-indigo-900',
      purple: 'text-purple-900',
      green: 'text-green-900',
      red: 'text-red-900',
      orange: 'text-orange-900',
      blue: 'text-blue-900',
    };
    return colorMap[color] || colorMap.indigo;
  };

  const getWeekDays = () => {
    const start = new Date(currentDate);
    start.setDate(start.getDate() - start.getDay() + 1);
    return Array.from({ length: 5 }, (_, i) => {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      return date;
    });
  };

  const weekDays = getWeekDays();

  const getEventsForDayAndHour = (dayIndex: number, hour: number) => {
    const dayDate = weekDays[dayIndex];
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      return (
        eventStart.getDate() === dayDate.getDate() &&
        eventStart.getMonth() === dayDate.getMonth() &&
        eventStart.getHours() === hour
      );
    });
  };

  const formatMonth = () => {
    return currentDate.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Header title="Календарь" user={{ name: 'Администратор', email: 'admin@kairat.kz' }} />

      <div className="flex-1 overflow-hidden p-6 flex flex-col">
        <div className="flex flex-col h-full bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-medium text-gray-900 capitalize">{formatMonth()}</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)))}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronLeft size={16} className="text-gray-600" />
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-2 py-1 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded transition-colors"
                >
                  Сегодня
                </button>
                <button
                  onClick={() => setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)))}
                  className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              </div>
            </div>
            <button onClick={handleCreate} className="btn-primary flex items-center gap-2">
              <Plus size={14} />
              Новое событие
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="flex-1 overflow-y-auto">
            <div className="grid grid-cols-6 min-w-[800px] h-full">
              {/* Time Column */}
              <div className="border-r border-gray-100">
                <div className="h-10 border-b border-gray-100 bg-gray-50"></div>
                {HOURS.map(hour => (
                  <div key={hour} className="h-20 border-b border-gray-100 text-xs text-gray-400 font-mono text-right pr-2 pt-2">
                    {hour}:00
                  </div>
                ))}
              </div>

              {/* Days Columns */}
              {weekDays.map((date, index) => (
                <div key={index} className="relative border-r border-gray-100 last:border-r-0">
                  <div className="h-10 border-b border-gray-100 bg-gray-50 flex flex-col items-center justify-center text-sm sticky top-0 z-10">
                    <span className="font-medium text-gray-600">{DAYS[index]}</span>
                    <span className="text-xs text-gray-400">{date.getDate()}</span>
                  </div>
                  {HOURS.map(hour => {
                    const dayEvents = getEventsForDayAndHour(index, hour);
                    return (
                      <div key={`${index}-${hour}`} className="h-20 border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer relative">
                        {dayEvents.map(event => (
                          <div
                            key={event._id}
                            onClick={() => handleEdit(event)}
                            className={`absolute inset-x-1 top-1 rounded p-2 text-xs hover:scale-[1.02] transition-transform cursor-pointer shadow-sm ${getEventStyle(event.color || 'indigo')}`}
                            style={{
                              height: `${Math.min(
                                ((new Date(event.endDate).getTime() - new Date(event.startDate).getTime()) / (1000 * 60 * 60)) * 80 - 8,
                                150
                              )}px`
                            }}
                          >
                            <p className={`font-medium truncate ${getEventTextColor(event.color || 'indigo')}`}>{event.title}</p>
                            <p className="text-gray-500 mt-1">
                              {new Date(event.startDate).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Events List */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
          <h3 className="text-sm font-medium text-gray-900 mb-3">Предстоящие события</h3>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {events.slice(0, 5).map(event => (
              <div key={event._id} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-lg group">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${event.color === 'indigo' ? 'bg-indigo-500' : event.color === 'purple' ? 'bg-purple-500' : event.color === 'green' ? 'bg-green-500' : 'bg-gray-500'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-900">{event.title}</p>
                    <p className="text-xs text-gray-500">{new Date(event.startDate).toLocaleString('ru-RU')}</p>
                  </div>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => handleEdit(event)}
                    className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded"
                  >
                    <Edit2 size={12} />
                  </button>
                  <button
                    onClick={() => handleDelete(event._id || '')}
                    className="p-1 hover:bg-red-50 text-gray-400 hover:text-red-500 rounded"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))}
            {events.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Нет запланированных событий</p>
            )}
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
                {selectedEvent ? 'Редактировать событие' : 'Новое событие'}
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
                  placeholder="Встреча с клиентом"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Дата начала *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Время начала</label>
                  <input
                    type="time"
                    className="input-field"
                    value={formData.startTime}
                    onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Дата окончания *</label>
                  <input
                    type="date"
                    className="input-field"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Время окончания</label>
                  <input
                    type="time"
                    className="input-field"
                    value={formData.endTime}
                    onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Цвет</label>
                  <select
                    className="input-field"
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  >
                    {colorOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Место</label>
                  <input
                    type="text"
                    className="input-field"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="Переговорная А"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Описание</label>
                <textarea
                  className="input-field resize-none"
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Подробности события..."
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
                disabled={loading || !formData.title || !formData.startDate || !formData.endDate}
                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Сохранение...
                  </span>
                ) : (
                  selectedEvent ? 'Обновить' : 'Создать'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
