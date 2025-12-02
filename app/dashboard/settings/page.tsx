'use client';

import Header from '@/components/layout/Header';
import { useState } from 'react';
import { User, Bell, Shield, Palette, Globe, CreditCard, Save } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'language', label: 'Language', icon: Globe },
    { id: 'billing', label: 'Billing', icon: CreditCard },
  ];

  return (
    <>
      <Header
        title="Settings"
        user={{ name: 'Admin User', email: 'admin@test.com' }}
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
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Profile Settings</h3>
                    <p className="text-sm text-gray-500">Manage your account information</p>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-medium">
                      AU
                    </div>
                    <div>
                      <button className="text-sm text-indigo-600 hover:text-indigo-700 font-medium">
                        Change avatar
                      </button>
                      <p className="text-xs text-gray-400 mt-1">JPG, GIF or PNG. Max 1MB.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">First Name</label>
                      <input type="text" defaultValue="Admin" className="input-field" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Last Name</label>
                      <input type="text" defaultValue="User" className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                      <input type="email" defaultValue="admin@test.com" className="input-field" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1.5">Bio</label>
                      <textarea rows={3} className="input-field" placeholder="Tell us about yourself..." />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-gray-100">
                    <button className="btn-primary flex items-center gap-2">
                      <Save size={16} />
                      Save Changes
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Notification Preferences</h3>
                    <p className="text-sm text-gray-500">Choose what notifications you want to receive</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { title: 'Email notifications', description: 'Receive email updates about your activity' },
                      { title: 'Push notifications', description: 'Receive push notifications in your browser' },
                      { title: 'Lead updates', description: 'Get notified when leads move through pipeline' },
                      { title: 'Team mentions', description: 'Get notified when someone mentions you' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">{item.title}</h4>
                          <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" defaultChecked className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-100 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab !== 'profile' && activeTab !== 'notifications' && (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                  <div className="w-16 h-16 bg-gray-100 rounded-full mb-4 animate-pulse"></div>
                  <h3 className="text-lg font-medium text-gray-500">{tabs.find(t => t.id === activeTab)?.label}</h3>
                  <p className="text-sm">This section is coming soon.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
