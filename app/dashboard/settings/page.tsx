'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { ProtectedRoute } from '@/components/protected-route';
import { useAuth } from '@/lib/auth-context';

export default function SettingsPage() {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    updates: false,
  });
  const [theme, setTheme] = useState('dark');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <ProtectedRoute>
      <DashboardLayout>
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Settings</h1>
            <p className="text-sm text-muted-foreground mt-1">Manage system preferences</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Settings Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                <nav className="flex flex-col">
                  {[
                    { id: 'profile', label: 'Profile Settings', icon: '👤' },
                    { id: 'notifications', label: 'Notifications', icon: '🔔' },
                    { id: 'security', label: 'Security', icon: '🔒' },
                    { id: 'appearance', label: 'Appearance', icon: '🎨' },
                    { id: 'system', label: 'System', icon: '⚙️' },
                  ].map((item) => (
                    <button
                      key={item.id}
                      className="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700/50 hover:text-cyan-400 border-b border-border last:border-b-0 transition"
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span className="text-sm font-medium">{item.label}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Settings Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Profile Settings */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Profile Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 pb-4 border-b border-border">
                    <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <span className="text-white font-bold text-2xl">
                        {user?.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{user?.name}</h3>
                      <p className="text-sm text-slate-400 capitalize">{user?.role} Account</p>
                      <button className="text-xs text-cyan-400 hover:text-cyan-300 mt-2">Change Avatar</button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Full Name</label>
                    <input
                      type="text"
                      value={user?.name}
                      readOnly
                      className="w-full px-4 py-2 bg-slate-800/50 border border-border rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Email</label>
                    <input
                      type="email"
                      value={user?.email}
                      readOnly
                      className="w-full px-4 py-2 bg-slate-800/50 border border-border rounded-lg text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-2">Role</label>
                    <input
                      type="text"
                      value={user?.role}
                      readOnly
                      className="w-full px-4 py-2 bg-slate-800/50 border border-border rounded-lg text-white capitalize"
                    />
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Notification Preferences</h2>
                <div className="space-y-4">
                  {[
                    {
                      key: 'email',
                      label: 'Email Notifications',
                      description: 'Receive updates via email',
                    },
                    {
                      key: 'push',
                      label: 'Push Notifications',
                      description: 'Receive push notifications',
                    },
                    {
                      key: 'updates',
                      label: 'System Updates',
                      description: 'Notify about system updates',
                    },
                  ].map((notif) => (
                    <div key={notif.key} className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-lg transition">
                      <div>
                        <p className="font-medium text-white">{notif.label}</p>
                        <p className="text-xs text-slate-400">{notif.description}</p>
                      </div>
                      <button
                        onClick={() =>
                          setNotifications({
                            ...notifications,
                            [notif.key]: !notifications[notif.key as keyof typeof notifications],
                          })
                        }
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
                          notifications[notif.key as keyof typeof notifications]
                            ? 'bg-cyan-500'
                            : 'bg-slate-700'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition ${
                            notifications[notif.key as keyof typeof notifications]
                              ? 'translate-x-6'
                              : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appearance */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">Appearance</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-cyan-300 mb-3">Theme</label>
                    <div className="flex gap-4">
                      {[
                        { id: 'dark', label: 'Dark', icon: '🌙' },
                        { id: 'light', label: 'Light', icon: '☀️' },
                        { id: 'auto', label: 'Auto', icon: '🔄' },
                      ].map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setTheme(t.id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition ${
                            theme === t.id
                              ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400'
                              : 'bg-slate-800/50 border-border hover:border-cyan-500/30 text-slate-400'
                          }`}
                        >
                          <span>{t.icon}</span>
                          <span className="text-sm font-medium">{t.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* System Settings */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-lg font-semibold text-white mb-6">System Settings</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-lg transition">
                    <div>
                      <p className="font-medium text-white">API Key</p>
                      <p className="text-xs text-slate-400">Your API key for integrations</p>
                    </div>
                    <button className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition text-xs font-medium">
                      Generate
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-lg transition">
                    <div>
                      <p className="font-medium text-white">Backup Data</p>
                      <p className="text-xs text-slate-400">Export system data</p>
                    </div>
                    <button className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg hover:bg-green-500/30 transition text-xs font-medium">
                      Export
                    </button>
                  </div>

                  <div className="flex items-center justify-between p-3 hover:bg-slate-700/20 rounded-lg transition border-t border-border pt-4 mt-4">
                    <div>
                      <p className="font-medium text-white">Danger Zone</p>
                      <p className="text-xs text-red-400">Clear all data</p>
                    </div>
                    <button className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition text-xs font-medium">
                      Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="flex gap-4">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-lg transition font-medium"
                >
                  Save Changes
                </button>
                {saved && <div className="flex items-center gap-2 text-green-400 text-sm">✓ Changes saved</div>}
              </div>
            </div>
          </div>
        </div>
      </DashboardLayout>
    </ProtectedRoute>
  );
}
