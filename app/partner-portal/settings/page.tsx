"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import PartnerLayout from "@/components/partner-layout"
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  Save,
  Bell,
  Lock,
  CreditCard,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react"

export default function SettingsPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    // Profile
    firstName: "John",
    lastName: "Doe",
    email: "partner@example.com",
    phone: "(555) 123-4567",
    companyName: "Partner Solutions LLC",
    website: "https://partnersolutions.com",

    // Notifications
    emailNotifications: true,
    referralUpdates: true,
    monthlyReports: false,

    // Password
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    // Add save logic here
    console.log("Saving profile:", formData)
  }

  const handleSavePassword = (e: React.FormEvent) => {
    e.preventDefault()
    // Add password change logic here
    console.log("Changing password")
  }

  return (
    <PartnerLayout>
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Settings</h1>
          <p className="text-gray-600">
            Manage your account settings and preferences
          </p>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Profile Information
                </h2>
                <p className="text-sm text-gray-500">
                  Update your personal and business details
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="url"
                    name="website"
                    value={formData.website}
                    onChange={handleInputChange}
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-all shadow-lg shadow-orange-500/30 flex items-center gap-2"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </motion.button>
            </div>
          </form>
        </motion.div>

        {/* Notification Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Bell className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Notifications
                </h2>
                <p className="text-sm text-gray-500">
                  Manage how you receive updates
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-4">
            <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Email Notifications</p>
                <p className="text-sm text-gray-500">
                  Receive email updates about your account
                </p>
              </div>
              <input
                type="checkbox"
                name="emailNotifications"
                checked={formData.emailNotifications}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#ff6a1a] border-gray-300 rounded focus:ring-[#ff6a1a]"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Referral Updates</p>
                <p className="text-sm text-gray-500">
                  Get notified when referral status changes
                </p>
              </div>
              <input
                type="checkbox"
                name="referralUpdates"
                checked={formData.referralUpdates}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#ff6a1a] border-gray-300 rounded focus:ring-[#ff6a1a]"
              />
            </label>

            <label className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all cursor-pointer">
              <div>
                <p className="font-medium text-gray-900">Monthly Reports</p>
                <p className="text-sm text-gray-500">
                  Receive monthly performance reports
                </p>
              </div>
              <input
                type="checkbox"
                name="monthlyReports"
                checked={formData.monthlyReports}
                onChange={handleInputChange}
                className="w-5 h-5 text-[#ff6a1a] border-gray-300 rounded focus:ring-[#ff6a1a]"
              />
            </label>
          </div>
        </motion.div>

        {/* Security Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Security</h2>
                <p className="text-sm text-gray-500">
                  Update your password and security settings
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSavePassword} className="p-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="currentPassword"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    placeholder="Enter current password"
                    className="w-full pl-11 pr-11 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    placeholder="Enter new password"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm new password"
                    className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#ff6a1a] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <motion.button
                type="submit"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-lg shadow-red-500/30 flex items-center gap-2"
              >
                <Lock className="w-5 h-5" />
                Update Password
              </motion.button>
            </div>
          </form>
        </motion.div>
      </div>
    </PartnerLayout>
  )
}
