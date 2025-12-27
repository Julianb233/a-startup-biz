"use client"

import { useState } from "react"
import { ShoppingCart, Check } from "lucide-react"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface AddToCartButtonProps {
  slug: string
  name: string
  price: number
  variant?: "default" | "icon" | "minimal"
  className?: string
  showToast?: boolean
  onAddSuccess?: () => void
}

/**
 * Reusable Add to Cart Button Component
 * Supports multiple display variants and custom styling
 *
 * Usage:
 * <AddToCartButton
 *   slug={service.slug}
 *   name={service.title}
 *   price={service.pricing.basePrice}
 *   variant="default"
 * />
 */
export default function AddToCartButton({
  slug,
  name,
  price,
  variant = "default",
  className = "",
  showToast = true,
  onAddSuccess
}: AddToCartButtonProps) {
  const { addItem, openCart } = useCart()
  const [isAdding, setIsAdding] = useState(false)
  const [justAdded, setJustAdded] = useState(false)

  const handleAddToCart = async (e: React.MouseEvent) => {
    e.preventDefault() // Prevent navigation if button is inside a Link
    e.stopPropagation() // Prevent event bubbling

    if (isAdding || justAdded) return

    setIsAdding(true)

    try {
      // Add item to cart
      addItem({ slug, name, price })

      // Show success state
      setJustAdded(true)

      // Show toast notification if enabled
      if (showToast) {
        toast.success(`Added ${name} to cart`, {
          description: `$${price.toLocaleString()} - View your cart to checkout`,
          duration: 3000,
          action: {
            label: "View Cart",
            onClick: () => openCart()
          }
        })
      }

      // Open cart drawer after a short delay
      setTimeout(() => {
        openCart()
      }, 300)

      // Call success callback if provided
      onAddSuccess?.()

      // Reset success state after 2 seconds
      setTimeout(() => {
        setJustAdded(false)
      }, 2000)
    } catch (error) {
      console.error("Failed to add item to cart:", error)
      toast.error("Failed to add item to cart", {
        description: "Please try again"
      })
    } finally {
      setIsAdding(false)
    }
  }

  // Icon-only variant (for service cards/grids)
  if (variant === "icon") {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding || justAdded}
        className={`
          inline-flex items-center justify-center
          w-10 h-10 rounded-full
          transition-all duration-300
          ${justAdded
            ? "bg-green-500 text-white"
            : "bg-white text-[#ff6a1a] border-2 border-[#ff6a1a] hover:bg-[#ff6a1a] hover:text-white"
          }
          ${isAdding ? "opacity-50 cursor-wait" : ""}
          disabled:opacity-50 disabled:cursor-not-allowed
          shadow-md hover:shadow-lg
          ${className}
        `}
        aria-label={`Add ${name} to cart`}
        title={`Add ${name} to cart`}
      >
        {justAdded ? (
          <Check className="w-5 h-5" />
        ) : (
          <ShoppingCart className={`w-5 h-5 ${isAdding ? "animate-pulse" : ""}`} />
        )}
      </button>
    )
  }

  // Minimal variant (text + icon)
  if (variant === "minimal") {
    return (
      <button
        onClick={handleAddToCart}
        disabled={isAdding || justAdded}
        className={`
          inline-flex items-center gap-2
          text-[#ff6a1a] font-semibold
          transition-all duration-300
          hover:gap-3
          ${isAdding ? "opacity-50 cursor-wait" : ""}
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {justAdded ? (
          <>
            <Check className="w-5 h-5" />
            <span>Added!</span>
          </>
        ) : (
          <>
            <ShoppingCart className={`w-5 h-5 ${isAdding ? "animate-pulse" : ""}`} />
            <span>{isAdding ? "Adding..." : "Add to Cart"}</span>
          </>
        )}
      </button>
    )
  }

  // Default variant (full button)
  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding || justAdded}
      className={`
        inline-flex items-center justify-center gap-2
        px-6 py-4 rounded-xl
        font-bold text-base
        transition-all duration-300
        shadow-md hover:shadow-lg
        ${justAdded
          ? "bg-green-500 text-white"
          : "bg-[#ff6a1a] text-white hover:bg-[#e55f17]"
        }
        ${isAdding ? "opacity-50 cursor-wait" : ""}
        disabled:opacity-50 disabled:cursor-not-allowed
        transform hover:scale-[1.02] active:scale-[0.98]
        ${className}
      `}
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {justAdded ? (
        <>
          <Check className="w-5 h-5" />
          <span>Added to Cart!</span>
        </>
      ) : (
        <>
          <ShoppingCart className={`w-5 h-5 ${isAdding ? "animate-pulse" : ""}`} />
          <span>{isAdding ? "Adding..." : `Add to Cart - $${price.toLocaleString()}`}</span>
        </>
      )}
    </button>
  )
}
