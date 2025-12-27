import {
  Settings as SettingsIcon,
  Bell,
  Shield,
  Globe,
  Mail,
  CreditCard,
  Database,
  Save,
} from 'lucide-react';

export default function SettingsPage() {
  const settingsSections = [
    {
      title: 'General Settings',
      icon: SettingsIcon,
      color: 'orange',
      items: [
        { label: 'Site Name', value: 'A Startup Biz', type: 'text' },
        { label: 'Support Email', value: 'support@astartupbiz.com', type: 'email' },
        { label: 'Timezone', value: 'America/New_York', type: 'select' },
      ],
    },
    {
      title: 'Notifications',
      icon: Bell,
      color: 'blue',
      items: [
        { label: 'Email Notifications', value: true, type: 'toggle' },
        { label: 'Order Alerts', value: true, type: 'toggle' },
        { label: 'Weekly Reports', value: false, type: 'toggle' },
      ],
    },
    {
      title: 'Security',
      icon: Shield,
      color: 'red',
      items: [
        { label: 'Two-Factor Authentication', value: true, type: 'toggle' },
        { label: 'Session Timeout (minutes)', value: '30', type: 'number' },
        { label: 'Password Policy', value: 'Strong', type: 'select' },
      ],
    },
    {
      title: 'Payment Settings',
      icon: CreditCard,
      color: 'green',
      items: [
        { label: 'Stripe API Key', value: '••••••••••••••', type: 'password' },
        { label: 'PayPal Email', value: 'business@astartupbiz.com', type: 'email' },
        { label: 'Accept Payments', value: true, type: 'toggle' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your admin dashboard configuration
          </p>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          const colorClasses = {
            orange: 'bg-orange-100 text-orange-600',
            blue: 'bg-blue-100 text-blue-600',
            red: 'bg-red-100 text-red-600',
            green: 'bg-green-100 text-green-600',
          };

          return (
            <div
              key={section.title}
              className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm"
            >
              <div className="mb-4 flex items-center space-x-3">
                <div className={`rounded-lg p-2 ${colorClasses[section.color as keyof typeof colorClasses]}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h2 className="text-lg font-semibold text-gray-900">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-4">
                {section.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <label className="text-sm font-medium text-gray-700">
                      {item.label}
                    </label>

                    {item.type === 'toggle' ? (
                      <button
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          item.value
                            ? 'bg-orange-600'
                            : 'bg-gray-200'
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            item.value ? 'translate-x-6' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    ) : item.type === 'password' ? (
                      <input
                        type="password"
                        value={item.value as string}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        readOnly
                      />
                    ) : (
                      <input
                        type={item.type}
                        value={item.value as string}
                        className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-200"
                        readOnly
                      />
                    )}
                  </div>
                ))}
              </div>

              <button className="mt-4 w-full rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 transition-colors">
                <Save className="inline h-4 w-4 mr-2" />
                Save Changes
              </button>
            </div>
          );
        })}
      </div>

      {/* System Information */}
      <div className="rounded-lg bg-white border border-gray-200 p-6 shadow-sm">
        <div className="mb-4 flex items-center space-x-3">
          <div className="rounded-lg bg-purple-100 p-2 text-purple-600">
            <Database className="h-5 w-5" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">
            System Information
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-600">Version</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">v1.0.0</p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-600">Environment</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              Production
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-600">Database</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              PostgreSQL 15.2
            </p>
          </div>
          <div className="rounded-lg bg-gray-50 p-4">
            <p className="text-sm font-medium text-gray-600">Last Backup</p>
            <p className="mt-1 text-lg font-semibold text-gray-900">
              2 hours ago
            </p>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-lg bg-white border-2 border-red-200 p-6 shadow-sm">
        <h2 className="mb-2 text-lg font-semibold text-red-900">
          Danger Zone
        </h2>
        <p className="mb-4 text-sm text-red-700">
          These actions are irreversible. Please be careful.
        </p>
        <div className="space-y-3">
          <button className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
            Clear All Cache
          </button>
          <button className="w-full rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50 transition-colors">
            Reset Database
          </button>
          <button className="w-full rounded-lg border border-red-600 bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors">
            Delete All Data
          </button>
        </div>
      </div>
    </div>
  );
}
