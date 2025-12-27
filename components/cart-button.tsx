"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { useCart } from '@/lib/cart-context'
import { useEffect, useState } from 'react'

/**
 * Cart Button Component
 * Header button with animated badge showing cart item count
 */
export default function CartButton() {
  const { itemCount, openCart } = useCart()
  const [prevCount, setPrevCount] = useState(0)
  const [shouldPulse, setShouldPulse] = useState(false)

  // Trigger pulse animation when item count increases
  useEffect(() => {
    if (itemCount > prevCount && itemCount > 0) {
      setShouldPulse(true)
      const timeout = setTimeout(() => setShouldPulse(false), 600)
      return () => clearTimeout(timeout)
    }
    setPrevCount(itemCount)
  }, [itemCount, prevCount])

  return (
    <button
      onClick={openCart}
      className="relative p-2 text-black hover:text-[#ff6a1a] rounded-md transition-colors"
      aria-label={`Shopping cart with ${itemCount} items`}
    >
      {/* Cart Icon */}
      <ShoppingCart className="w-6 h-6" />

      {/* Animated Badge */}
      <AnimatePresence>
        {itemCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              scale: shouldPulse ? [1, 1.3, 1] : 1,
              opacity: 1
            }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{
              scale: {
                duration: shouldPulse ? 0.3 : 0.2,
                ease: 'easeOut'
              },
              opacity: {
                duration: 0.2
              }
            }}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 flex items-center justify-center bg-[#ff6a1a] text-white text-xs font-bold rounded-full border-2 border-white shadow-sm"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {itemCount > 99 ? '99+' : itemCount}
          </motion.span>
        )}
      </AnimatePresence>

      {/* Pulse Ring Effect (when item added) */}
      <AnimatePresence>
        {shouldPulse && (
          <motion.span
            initial={{ scale: 1, opacity: 0.8 }}
            animate={{ scale: 1.8, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-[#ff6a1a] rounded-full"
            aria-hidden="true"
          />
        )}
      </AnimatePresence>
    </button>
  )
}
