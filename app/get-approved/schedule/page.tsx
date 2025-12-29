'use client'

import { useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  Calendar,
  Clock,
  CheckCircle2,
  Video,
  Phone,
  ArrowRight,
  Loader2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import Header from '@/components/header'
import Footer from '@/components/footer'

// Generate available time slots for the next 7 days
function getAvailableSlots() {
  const slots: { date: Date; times: string[] }[] = []
  const now = new Date()

  for (let i = 1; i <= 7; i++) {
    const date = new Date(now)
    date.setDate(date.getDate() + i)

    // Skip weekends
    if (date.getDay() === 0 || date.getDay() === 6) continue

    // Generate time slots from 9 AM to 5 PM
    const times = ['9:00 AM', '10:00 AM', '11:00 AM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM']

    // Randomly remove some slots to simulate availability
    const availableTimes = times.filter(() => Math.random() > 0.3)

    if (availableTimes.length > 0) {
      slots.push({ date, times: availableTimes })
    }
  }

  return slots
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  })
}

function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  })
}

function ScheduleContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const applicationId = searchParams.get('id')

  const [availableSlots] = useState(getAvailableSlots)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isConfirmed, setIsConfirmed] = useState(false)
  const [currentWeekStart, setCurrentWeekStart] = useState(0)

  const visibleSlots = availableSlots.slice(currentWeekStart, currentWeekStart + 4)

  const handleConfirm = async () => {
    if (!selectedDate || !selectedTime) return

    setIsSubmitting(true)

    // Simulate API call to book the slot
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In production, you'd call an API here to:
    // 1. Book the calendar slot (Calendly, Cal.com, etc.)
    // 2. Update the partner application with the scheduled call
    // 3. Send confirmation emails

    setIsSubmitting(false)
    setIsConfirmed(true)
  }

  if (isConfirmed) {
    return (
      <section className="py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto text-center"
          >
            {/* Success Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring' }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-100 to-green-50 rounded-full mb-8"
            >
              <CheckCircle2 className="w-12 h-12 text-green-500" />
            </motion.div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              You&apos;re All Set!
            </h1>

            <p className="text-xl text-gray-600 mb-8">
              Your call is scheduled for{' '}
              <span className="font-semibold text-gray-900">
                {selectedDate && formatDate(selectedDate)} at {selectedTime}
              </span>
            </p>

            {/* Confirmation Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gray-50 rounded-2xl p-8 text-left mb-8"
            >
              <h2 className="font-bold text-gray-900 mb-4">What to Expect</h2>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Video className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Video Call via Zoom</p>
                    <p className="text-sm text-gray-600">
                      We&apos;ll send you a meeting link 30 minutes before
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">15 Minutes</p>
                    <p className="text-sm text-gray-600">Quick and focused conversation</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900">Same-Day Decision</p>
                    <p className="text-sm text-gray-600">
                      Most partners are approved on the call
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Calendar Add Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8"
            >
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                <Calendar className="w-5 h-5" />
                Add to Google Calendar
              </button>
              <button className="flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                <Calendar className="w-5 h-5" />
                Add to Outlook
              </button>
            </motion.div>

            <p className="text-gray-500 text-sm">
              We&apos;ve sent a confirmation email with all the details.
            </p>
          </motion.div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 lg:py-24">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-orange-100 to-orange-50 rounded-full mb-6">
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Pick a Time That Works
            </h1>

            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose a 15-minute slot for a quick call with our partner team.
              We&apos;ll get you set up in no time!
            </p>
          </motion.div>

          {/* Date Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Select a Date</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentWeekStart(Math.max(0, currentWeekStart - 4))}
                  disabled={currentWeekStart === 0}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={() =>
                    setCurrentWeekStart(
                      Math.min(availableSlots.length - 4, currentWeekStart + 4)
                    )
                  }
                  disabled={currentWeekStart >= availableSlots.length - 4}
                  className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {visibleSlots.map((slot) => {
                const isSelected =
                  selectedDate?.toDateString() === slot.date.toDateString()
                return (
                  <button
                    key={slot.date.toISOString()}
                    onClick={() => {
                      setSelectedDate(slot.date)
                      setSelectedTime(null)
                    }}
                    className={`p-4 rounded-xl border-2 transition-all text-center ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 hover:border-orange-300 hover:bg-orange-50/50'
                    }`}
                  >
                    <p className="font-bold text-lg">
                      {slot.date.toLocaleDateString('en-US', { weekday: 'short' })}
                    </p>
                    <p className={`text-sm ${isSelected ? 'text-orange-600' : 'text-gray-500'}`}>
                      {slot.date.toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                  </button>
                )
              })}
            </div>
          </motion.div>

          {/* Time Selection */}
          {selectedDate && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 md:p-8 mb-8"
            >
              <h2 className="text-lg font-bold text-gray-900 mb-4">
                Available Times for {formatShortDate(selectedDate)}
              </h2>

              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {availableSlots
                  .find((s) => s.date.toDateString() === selectedDate.toDateString())
                  ?.times.map((time) => {
                    const isSelected = selectedTime === time
                    return (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-xl border-2 transition-all text-center font-medium ${
                          isSelected
                            ? 'border-orange-500 bg-orange-500 text-white'
                            : 'border-gray-200 hover:border-orange-300 text-gray-700'
                        }`}
                      >
                        {time}
                      </button>
                    )
                  })}
              </div>
            </motion.div>
          )}

          {/* Confirm Button */}
          {selectedDate && selectedTime && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="bg-gray-50 rounded-xl p-4 mb-6 inline-block">
                <p className="text-gray-600">
                  <span className="font-semibold text-gray-900">
                    {formatDate(selectedDate)}
                  </span>{' '}
                  at <span className="font-semibold text-gray-900">{selectedTime}</span>
                </p>
              </div>

              <div>
                <button
                  onClick={handleConfirm}
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-lg rounded-xl hover:from-orange-600 hover:to-orange-700 transition-all shadow-lg shadow-orange-500/30 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      Confirm Booking
                      <ArrowRight className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          )}

          {/* Help Text */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center mt-8"
          >
            <p className="text-gray-500 text-sm">
              Can&apos;t find a time that works?{' '}
              <a href="mailto:partners@astartupbiz.com" className="text-orange-600 hover:underline">
                Email us
              </a>{' '}
              and we&apos;ll find an alternative.
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default function SchedulePage() {
  return (
    <main className="relative overflow-x-hidden max-w-full bg-white scroll-smooth min-h-screen">
      <Header />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500" />
          </div>
        }
      >
        <ScheduleContent />
      </Suspense>
      <Footer />
    </main>
  )
}
