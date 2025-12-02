'use client';

import Header from '@/components/layout/Header';
import { useState, useEffect } from 'react';
import { User, Bell, Shield, Palette, Globe, CreditCard, Save, Check } from 'lucide-react';

interface SettingsData {
  profile: {
    firstName: string;
    lastName: string;
    email: string;
    bio: string;
  };
  notifications: {
    emailNotifications: boolean;
    pushNotifications: boolean;
    leadUpdates: boolean;
    teamMentions: boolean;
  };
  appearance: {
    theme: 'light' | 'dark' | 'system';
    accentColor: string;
  };
  language: string;
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState<SettingsData>({
    profile: {
      firstName: '',
      lastName: '',
      email: '',
      bio: '',
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      leadUpdates: true,
      teamMentions: true,
    },
    appearance: {
      theme: 'light',
      accentColor: '#6366f1',
    },
    language: 'ru',
  });

  const tabs = [
    { id: 'profile', label: 'Профиль', icon: User },
    { id: 'notifications', label: 'Уведомления', icon: Bell },
    { id: 'security', label: 'Безопасность', icon: Shield },
    { id: 'appearance', label: 'Внешний вид', icon: Palette },
    { id: 'language', label: 'Язык', icon: Globe },
    { id: 'billing', label: 'Оплата', icon: CreditCard },
  ];

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      if (data.settings) {
        setSettings({
          profile: data.settings.profile || settings.profile,
          notifications: data.settings.notifications || settings.notifications,
          appearance: data.settings.appearance || settings.appearance,
          language: data.settings.language || 'ru',
        });
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (error) {
      console.error('Error saving settings:', error);
    } finally {
      setSaving(false);
    }
  };

  const updateProfile = (field: string, value: string) => {
    setSettings({
      ...settings,
      profile: { ...settings.profile, [field]: value },
    });
  };

  const updateNotification = (field: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: { ...settings.notifications, [field]: value },
    });
  };

  const updateAppearance = (field: string, value: string) => {
    setSettings({
      ...settings,
      appearance: { ...settings.appearance, [field]: value },
    });
  };

  const getInitials = () => {
    const first = settings.profile.firstName?.[0] || '';
    const last = settings.profile.lastName?.[0] || '';
    return (first + last).toUpperCase() || 'АД';
  };

  if (loading) {
    return (
      <>
        <Header title="Настройки" user={{ name: 'Администратор', email: 'admin@kairat.kz' }} />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Header
        title="Настройки"
        user={{ name: 'Администратор', email: 'admin@kairat.kz' }}
      />

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Sidebar */}
            <div className="w-full md:w-56 space-y-1">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                      activeTab === tab.id
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900'
                    }`}
                  >
                    <Icon size={16} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Content */}
            <div className="flex-1 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              {activeTab === 'profile' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Настройки профиля</h3>
                    <p className="text-sm text-gray-500">Управляйте информацией вашего аккаунта</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-medium">
                      {getInitials()}
                    </div>
                    <div>
                      <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        Изменить аватар
                      </button>
                      <p className="text-xs text-gray-400 mt-1">JPG, GIF или PNG. Макс. 1МБ.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Имя</label>
                      <input
                        type="text"
                        value={settings.profile.firstName}
                        onChange={(e) => updateProfile('firstName', e.target.value)}
                        className="input-field"
                        placeholder="Нурлан"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Фамилия</label>
                      <input
                        type="text"
                        value={settings.profile.lastName}
                        onChange={(e) => updateProfile('lastName', e.target.value)}
                        className="input-field"
                        placeholder="Сериков"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <input
                        type="email"
                        value={settings.profile.email}
                        onChange={(e) => updateProfile('email', e.target.value)}
                        className="input-field"
                        placeholder="nurlan@example.kz"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">О себе</label>
                      <textarea
                        rows={3}
                        value={settings.profile.bio}
                        onChange={(e) => updateProfile('bio', e.target.value)}
                        className="input-field"
                        placeholder="Расскажите о себе..."
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Сохранение...
                        </>
                      ) : saved ? (
                        <>
                          <Check size={16} />
                          Сохранено!
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Сохранить
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Настройки уведомлений</h3>
                    <p className="text-sm text-gray-500">Выберите какие уведомления вы хотите получать</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { key: 'emailNotifications', title: 'Email уведомления', description: 'Получайте обновления по email о вашей активности' },
                      { key: 'pushNotifications', title: 'Push уведомления', description: 'Получайте push уведомления в браузере' },
                      { key: 'leadUpdates', title: 'Обновления лидов', description: 'Уведомления о перемещении лидов по воронке' },
                      { key: 'teamMentions', title: 'Упоминания в команде', description: 'Уведомления когда вас кто-то упоминает' },
                    ].map((item) => (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                            onChange={(e) => updateNotification(item.key, e.target.checked)}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Сохранение...
                        </>
                      ) : saved ? (
                        <>
                          <Check size={16} />
                          Сохранено!
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Сохранить
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'appearance' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Настройки внешнего вида</h3>
                    <p className="text-sm text-gray-500">Настройте внешний вид приложения</p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Тема</label>
                      <div className="flex gap-3">
                        {[
                          { value: 'light', label: 'Светлая' },
                          { value: 'dark', label: 'Тёмная' },
                          { value: 'system', label: 'Системная' },
                        ].map((option) => (
                          <button
                            key={option.value}
                            onClick={() => updateAppearance('theme', option.value)}
                            className={`flex-1 px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all ${
                              settings.appearance.theme === option.value
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-gray-200 text-gray-600 hover:border-gray-300'
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">Акцентный цвет</label>
                      <div className="flex gap-3">
                        {[
                          { value: '#6366f1', label: 'Индиго' },
                          { value: '#8b5cf6', label: 'Фиолетовый' },
                          { value: '#06b6d4', label: 'Голубой' },
                          { value: '#10b981', label: 'Изумрудный' },
                          { value: '#f59e0b', label: 'Янтарный' },
                          { value: '#ef4444', label: 'Красный' },
                        ].map((color) => (
                          <button
                            key={color.value}
                            onClick={() => updateAppearance('accentColor', color.value)}
                            className={`w-10 h-10 rounded-full border-2 transition-all ${
                              settings.appearance.accentColor === color.value
                                ? 'border-gray-900 scale-110'
                                : 'border-transparent hover:scale-105'
                            }`}
                            style={{ backgroundColor: color.value }}
                            title={color.label}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Сохранение...
                        </>
                      ) : saved ? (
                        <>
                          <Check size={16} />
                          Сохранено!
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Сохранить
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'language' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Настройки языка</h3>
                    <p className="text-sm text-gray-500">Выберите предпочтительный язык</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Язык интерфейса</label>
                    <select
                      value={settings.language}
                      onChange={(e) => setSettings({ ...settings, language: e.target.value })}
                      className="input-field"
                    >
                      <option value="ru">Русский</option>
                      <option value="kk">Қазақша</option>
                      <option value="en">English</option>
                      <option value="es">Español</option>
                      <option value="fr">Français</option>
                      <option value="de">Deutsch</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button
                      onClick={handleSave}
                      disabled={saving}
                      className="btn-primary flex items-center gap-2 disabled:opacity-50"
                    >
                      {saving ? (
                        <>
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Сохранение...
                        </>
                      ) : saved ? (
                        <>
                          <Check size={16} />
                          Сохранено!
                        </>
                      ) : (
                        <>
                          <Save size={16} />
                          Сохранить
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {(activeTab === 'security' || activeTab === 'billing') && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 animate-pulse"></div>
                  <h3 className="text-lg font-medium text-gray-500">{tabs.find(t => t.id === activeTab)?.label}</h3>
                  <p className="text-sm">Этот раздел скоро будет доступен.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
