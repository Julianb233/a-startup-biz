"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
  User,
  Mail,
  Phone,
  Building2,
  Globe,
  MapPin,
  Upload,
  Save,
  Camera,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  companyName: string
  website: string
  address: string
  city: string
  state: string
  zipCode: string
  bio: string
}

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof ProfileFormData, string>>>({})

  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "(555) 123-4567",
    companyName: "Acme Ventures LLC",
    website: "https://acmeventures.com",
    address: "123 Business Ave",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    bio: "Entrepreneur and business owner focused on scaling innovative solutions.",
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    // Clear error for this field when user starts typing
    if (errors[name as keyof ProfileFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof ProfileFormData, string>> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format"
    }
    if (formData.phone && !/^[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = "Invalid phone format"
    }
    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = "Website must start with http:// or https://"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!validateForm()) {
      return
    }

    setIsSaving(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSaving(false)
    setIsEditing(false)
    setShowSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            My Profile
          </h1>
          <p className="text-gray-600">
            Manage your personal and business information
          </p>
        </div>

        {!isEditing ? (
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setIsEditing(true)}
            className="px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#e55f17] transition-colors shadow-lg shadow-orange-500/20"
          >
            Edit Profile
          </motion.button>
        ) : (
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setIsEditing(false)
                setErrors({})
              }}
              className="px-6 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-lg hover:border-gray-300 hover:bg-gray-50 transition-all"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
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
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        )}
      </motion.div>

      {/* Success Message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3"
        >
          <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
          <p className="text-green-800 font-medium">
            Profile updated successfully!
          </p>
        </motion.div>
      )}

      {/* Profile Photo Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Camera className="w-6 h-6 text-[#ff6a1a]" />
          Profile Photo
        </h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="relative">
            <div className="w-32 h-32 bg-gradient-to-br from-[#ff6a1a] to-[#e55f17] rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-lg">
              {formData.firstName.charAt(0)}
              {formData.lastName.charAt(0)}
            </div>
            {isEditing && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="absolute bottom-0 right-0 w-10 h-10 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center hover:bg-gray-50 transition-colors shadow-md"
              >
                <Upload className="w-5 h-5 text-gray-700" />
              </motion.button>
            )}
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {formData.firstName} {formData.lastName}
            </h3>
            <p className="text-gray-600 mb-3">{formData.companyName}</p>
            {isEditing && (
              <p className="text-sm text-gray-500">
                Click the upload icon to change your photo. JPG, PNG, or GIF.
                Max size 5MB.
              </p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <User className="w-6 h-6 text-[#ff6a1a]" />
          Personal Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.firstName}
            icon={User}
            required
          />
          <FormField
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.lastName}
            icon={User}
            required
          />
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.email}
            icon={Mail}
            required
          />
          <FormField
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.phone}
            icon={Phone}
          />
        </div>

        <div className="mt-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Bio
          </label>
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            disabled={!isEditing}
            rows={4}
            className={`w-full px-4 py-3 border-2 rounded-lg transition-all ${
              isEditing
                ? "border-gray-200 focus:border-[#ff6a1a] focus:outline-none"
                : "border-gray-100 bg-gray-50"
            }`}
          />
        </div>
      </motion.div>

      {/* Business Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
      >
        <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <Building2 className="w-6 h-6 text-[#ff6a1a]" />
          Business Information
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.companyName}
            icon={Building2}
          />
          <FormField
            label="Website"
            name="website"
            type="url"
            value={formData.website}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.website}
            icon={Globe}
          />
          <div className="md:col-span-2">
            <FormField
              label="Address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.address}
              icon={MapPin}
            />
          </div>
          <FormField
            label="City"
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!isEditing}
            error={errors.city}
            icon={MapPin}
          />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              label="State"
              name="state"
              value={formData.state}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.state}
            />
            <FormField
              label="ZIP Code"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              disabled={!isEditing}
              error={errors.zipCode}
            />
          </div>
        </div>
      </motion.div>
    </div>
  )
}

interface FormFieldProps {
  label: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
  error?: string
  icon?: React.ComponentType<{ className?: string }>
  type?: string
  required?: boolean
}

function FormField({
  label,
  name,
  value,
  onChange,
  disabled,
  error,
  icon: Icon,
  type = "text",
  required = false,
}: FormFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        )}
        <input
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${
            Icon ? "pl-12" : "pl-4"
          } pr-4 py-3 border-2 rounded-lg transition-all ${
            error
              ? "border-red-300 focus:border-red-500"
              : disabled
                ? "border-gray-100 bg-gray-50"
                : "border-gray-200 focus:border-[#ff6a1a]"
          } focus:outline-none`}
        />
        {error && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-red-600 mt-1.5 flex items-center gap-1"
        >
          {error}
        </motion.p>
      )}
    </div>
  )
}
