"use client"

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingCart, Minus, Plus, Trash2, ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/cart-context'

/**
 * Cart Drawer Component
 * Slide-out drawer showing shopping cart contents
 */
export default function CartDrawer() {
  const router = useRouter()
  const { items, removeItem, updateQuantity, total, itemCount, isOpen, closeCart } = useCart()

  const handleCheckout = () => {
    closeCart()
    router.push('/checkout')
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            aria-hidden="true"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'tween', duration: 0.3, ease: 'easeInOut' }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
              <h2
                className="text-2xl font-bold text-black"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Shopping Cart
              </h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                aria-label="Close cart"
              >
                <X className="w-6 h-6 text-gray-600" />
              </button>
            </div>

            {/* Items Badge */}
            {itemCount > 0 && (
              <div className="px-6 py-3 bg-orange-50 border-b border-orange-100">
                <p
                  className="text-sm text-orange-800 font-medium"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
                </p>
              </div>
            )}

            {/* Items List or Empty State */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {items.length === 0 ? (
                // Empty State
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <ShoppingCart className="w-12 h-12 text-gray-400" />
                  </div>
                  <h3
                    className="text-xl font-semibold text-gray-900 mb-2"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Your cart is empty
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-sm">
                    Browse our consulting services and add them to your cart to get started.
                  </p>
                  <button
                    onClick={() => {
                      closeCart()
                      router.push('/services')
                    }}
                    className="px-6 py-3 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#ea580c] transition-colors"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Browse Services
                  </button>
                </div>
              ) : (
                // Cart Items
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.slug}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      {/* Item Details */}
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 pr-4">
                          <h3
                            className="font-semibold text-gray-900 mb-1 leading-tight"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {item.name}
                          </h3>
                          <p className="text-lg font-bold text-[#ff6a1a]">
                            ${item.price.toLocaleString()}
                          </p>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.slug)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          aria-label={`Remove ${item.name}`}
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.slug, item.quantity - 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity <= 1}
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-4 h-4 text-gray-600" />
                          </button>

                          <span
                            className="w-12 text-center font-semibold text-gray-900"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            {item.quantity}
                          </span>

                          <button
                            onClick={() => updateQuantity(item.slug, item.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={item.quantity >= 99}
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-4 h-4 text-gray-600" />
                          </button>
                        </div>

                        {/* Item Subtotal */}
                        <div className="text-right">
                          <p className="text-sm text-gray-500 mb-1">Subtotal</p>
                          <p
                            className="text-lg font-bold text-gray-900"
                            style={{ fontFamily: 'Montserrat, sans-serif' }}
                          >
                            ${(item.price * item.quantity).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Total and Actions */}
            {items.length > 0 && (
              <div className="border-t border-gray-200 px-6 py-5 bg-gray-50">
                {/* Total */}
                <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
                  <span
                    className="text-lg font-semibold text-gray-900"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Total
                  </span>
                  <span
                    className="text-2xl font-bold text-[#ff6a1a]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    ${total.toLocaleString()}
                  </span>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {/* Proceed to Checkout */}
                  <button
                    onClick={handleCheckout}
                    className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#ea580c] transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Proceed to Checkout
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  {/* Continue Shopping */}
                  <button
                    onClick={closeCart}
                    className="w-full px-6 py-3 border-2 border-[#ff6a1a] text-[#ff6a1a] font-semibold rounded-lg hover:bg-[#ff6a1a] hover:text-white transition-all"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Continue Shopping
                  </button>
                </div>

                {/* Helper Text */}
                <p className="text-xs text-gray-500 text-center mt-4">
                  Secure checkout powered by industry-leading payment processors
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
