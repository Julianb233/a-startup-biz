"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Bell,
  Lock,
  CreditCard,
  Trash2,
  Eye,
  EyeOff,
  Save,
  CheckCircle,
  AlertTriangle,
  Mail,
  MessageSquare,
  Calendar,
  DollarSign,
  Shield,
} from "lucide-react"

interface NotificationSettings {
  emailDigest: boolean
  consultationReminders: boolean
  marketingEmails: boolean
  productUpdates: boolean
  securityAlerts: boolean
  invoiceNotifications: boolean
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"notifications" | "security" | "billing">(
    "notifications"
  )
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailDigest: true,
    consultationReminders: true,
    marketingEmails: false,
    productUpdates: true,
    securityAlerts: true,
    invoiceNotifications: true,
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleNotificationToggle = (key: keyof NotificationSettings) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSaveNotifications = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSaving(false)
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSaving(false)
    setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" })
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const tabs = [
    { id: "notifications" as const, label: "Notifications", icon: Bell },
    { id: "security" as const, label: "Security", icon: Lock },
    { id: "billing" as const, label: "Billing", icon: CreditCard },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account preferences and security
        </p>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
          >
            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium">
              Settings saved successfully!
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
      >
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-semibold transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "text-[#ff6a1a] border-b-2 border-[#ff6a1a] bg-orange-50/50"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <Icon className="w-5 h-5" />
                {tab.label}
              </button>
            )
          })}
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {activeTab === "notifications" && (
              <motion.div
                key="notifications"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Email Notifications
                  </h3>
                  <div className="space-y-4">
                    <NotificationToggle
                      icon={Mail}
                      label="Email Digest"
                      description="Receive a daily summary of your account activity"
                      enabled={notifications.emailDigest}
                      onChange={() => handleNotificationToggle("emailDigest")}
                    />
                    <NotificationToggle
                      icon={Calendar}
                      label="Consultation Reminders"
                      description="Get notified 24 hours before scheduled consultations"
                      enabled={notifications.consultationReminders}
                      onChange={() =>
                        handleNotificationToggle("consultationReminders")
                      }
                    />
                    <NotificationToggle
                      icon={MessageSquare}
                      label="Marketing Emails"
                      description="Receive updates about new features and promotions"
                      enabled={notifications.marketingEmails}
                      onChange={() => handleNotificationToggle("marketingEmails")}
                    />
                    <NotificationToggle
                      icon={Bell}
                      label="Product Updates"
                      description="Be the first to know about platform improvements"
                      enabled={notifications.productUpdates}
                      onChange={() => handleNotificationToggle("productUpdates")}
                    />
                    <NotificationToggle
                      icon={Shield}
                      label="Security Alerts"
                      description="Important notifications about account security"
                      enabled={notifications.securityAlerts}
                      onChange={() => handleNotificationToggle("securityAlerts")}
                      locked
                    />
                    <NotificationToggle
                      icon={DollarSign}
                      label="Invoice Notifications"
                      description="Receive invoices and payment receipts"
                      enabled={notifications.invoiceNotifications}
                      onChange={() =>
                        handleNotificationToggle("invoiceNotifications")
                      }
                    />
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-200">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSaveNotifications}
                    disabled={isSaving}
                    className="px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSaving ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        Save Preferences
                      </>
                    )}
                  </motion.button>
                </div>
              </motion.div>
            )}

            {activeTab === "security" && (
              <motion.div
                key="security"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Change Password
                  </h3>
                  <form onSubmit={handlePasswordChange} className="space-y-4">
                    <PasswordField
                      label="Current Password"
                      value={passwordForm.currentPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          currentPassword: e.target.value,
                        }))
                      }
                      show={showCurrentPassword}
                      onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
                    />
                    <PasswordField
                      label="New Password"
                      value={passwordForm.newPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          newPassword: e.target.value,
                        }))
                      }
                      show={showNewPassword}
                      onToggle={() => setShowNewPassword(!showNewPassword)}
                    />
                    <PasswordField
                      label="Confirm New Password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) =>
                        setPasswordForm((prev) => ({
                          ...prev,
                          confirmPassword: e.target.value,
                        }))
                      }
                      show={showConfirmPassword}
                      onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    />

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <p className="text-sm text-blue-800">
                        Password must be at least 8 characters and include uppercase,
                        lowercase, number, and special character.
                      </p>
                    </div>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      disabled={isSaving}
                      className="px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-colors shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      {isSaving ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Updating...
                        </>
                      ) : (
                        <>
                          <Lock className="w-5 h-5" />
                          Update Password
                        </>
                      )}
                    </motion.button>
                  </form>
                </div>

                <div className="pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Two-Factor Authentication
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">
                          2FA Not Enabled
                        </h4>
                        <p className="text-sm text-gray-600 mb-4">
                          Add an extra layer of security to your account with
                          two-factor authentication.
                        </p>
                        <motion.button
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="px-4 py-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-[#ff6a1a] hover:text-[#ff6a1a] transition-all"
                        >
                          Enable 2FA
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "billing" && (
              <motion.div
                key="billing"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Payment Method
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-6 border border-gray-200">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold text-xs">
                        VISA
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          •••• •••• •••• 4242
                        </p>
                        <p className="text-sm text-gray-500">Expires 12/25</p>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-[#ff6a1a] hover:text-[#ff6a1a] transition-all"
                      >
                        Update
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-4">
                    Billing History
                  </h3>
                  <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                    <div className="divide-y divide-gray-200">
                      {[
                        {
                          date: "Dec 1, 2024",
                          description: "Monthly Subscription",
                          amount: "$99.00",
                        },
                        {
                          date: "Nov 1, 2024",
                          description: "Monthly Subscription",
                          amount: "$99.00",
                        },
                        {
                          date: "Oct 1, 2024",
                          description: "Monthly Subscription",
                          amount: "$99.00",
                        },
                      ].map((invoice, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {invoice.description}
                            </p>
                            <p className="text-sm text-gray-500">{invoice.date}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-semibold text-gray-900">
                              {invoice.amount}
                            </p>
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              className="text-sm text-[#ff6a1a] hover:text-[#e55f17] font-semibold"
                            >
                              Download
                            </motion.button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-red-200">
                  <h3 className="text-lg font-bold text-red-900 mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" />
                    Danger Zone
                  </h3>
                  <div className="bg-red-50 rounded-lg p-6 border border-red-200">
                    <h4 className="font-semibold text-red-900 mb-2">
                      Delete Account
                    </h4>
                    <p className="text-sm text-red-700 mb-4">
                      Once you delete your account, there is no going back. Please be
                      certain.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowDeleteModal(true)}
                      className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete Account
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDeleteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6"
            >
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 text-center mb-2">
                Delete Account?
              </h3>
              <p className="text-gray-600 text-center mb-6">
                This action cannot be undone. All your data will be permanently
                deleted.
              </p>
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 px-4 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 px-4 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

interface NotificationToggleProps {
  icon: React.ComponentType<{ className?: string }>
  label: string
  description: string
  enabled: boolean
  onChange: () => void
  locked?: boolean
}

function NotificationToggle({
  icon: Icon,
  label,
  description,
  enabled,
  onChange,
  locked = false,
}: NotificationToggleProps) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
        <Icon className="w-5 h-5 text-gray-600" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900">{label}</h4>
          {locked && (
            <Lock className="w-4 h-4 text-gray-400" aria-label="Cannot be disabled" />
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
      <motion.button
        whileTap={{ scale: 0.95 }}
        onClick={onChange}
        disabled={locked}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? "bg-[#ff6a1a]" : "bg-gray-300"
        } ${locked ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <motion.div
          animate={{ x: enabled ? 24 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
        />
      </motion.button>
    </div>
  )
}

interface PasswordFieldProps {
  label: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  show: boolean
  onToggle: () => void
}

function PasswordField({ label, value, onChange, show, onToggle }: PasswordFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:border-[#ff6a1a] focus:outline-none transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          {show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
        </button>
      </div>
    </div>
  )
}
