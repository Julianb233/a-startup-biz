"use client"

import { useCart } from '@/lib/cart-context'
import { ShoppingCart } from 'lucide-react'

/**
 * Add to Cart Button Component
 * Reusable button to add any service to the cart
 *
 * Usage:
 * <AddToCartButton
 *   slug={service.slug}
 *   name={service.title}
 *   price={service.pricing.basePrice}
 * />
 */

interface AddToCartButtonProps {
  slug: string
  name: string
  price: number
  className?: string
}

export default function AddToCartButton({
  slug,
  name,
  price,
  className = ''
}: AddToCartButtonProps) {
  const { addItem } = useCart()

  const handleAddToCart = () => {
    addItem({
      slug,
      name,
      price
    })
  }

  return (
    <button
      onClick={handleAddToCart}
      className={`flex items-center justify-center gap-2 px-6 py-4 bg-[#ff6a1a] text-white font-semibold rounded-lg hover:bg-[#ea580c] transition-all transform hover:scale-[1.02] active:scale-[0.98] ${className}`}
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      <ShoppingCart className="w-5 h-5" />
      Add to Cart - ${price.toLocaleString()}
    </button>
  )
}
