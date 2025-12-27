"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'

/**
 * Cart Item Interface
 * Represents a service in the shopping cart
 */
export interface CartItem {
  slug: string
  name: string
  price: number
  quantity: number
}

/**
 * Cart Context Interface
 * Defines all cart operations and state
 */
interface CartContextType {
  items: CartItem[]
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (slug: string) => void
  updateQuantity: (slug: string, quantity: number) => void
  clearCart: () => void
  total: number
  itemCount: number
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'a-startup-biz-cart'
const MAX_QUANTITY = 99

/**
 * Cart Provider Component
 * Manages global cart state with localStorage persistence
 */
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const [isHydrated, setIsHydrated] = useState(false)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart)
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart)
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error)
    } finally {
      setIsHydrated(true)
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error)
      }
    }
  }, [items, isHydrated])

  /**
   * Add item to cart
   * If item already exists, increment quantity
   */
  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems(currentItems => {
      const existingItemIndex = currentItems.findIndex(i => i.slug === item.slug)

      if (existingItemIndex > -1) {
        // Item exists, increment quantity
        const newItems = [...currentItems]
        const newQuantity = Math.min(
          newItems[existingItemIndex].quantity + 1,
          MAX_QUANTITY
        )
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity
        }
        return newItems
      } else {
        // New item, add to cart
        return [...currentItems, { ...item, quantity: 1 }]
      }
    })

    // Open cart drawer to show feedback
    setIsOpen(true)
  }, [])

  /**
   * Remove item from cart completely
   */
  const removeItem = useCallback((slug: string) => {
    setItems(currentItems => currentItems.filter(item => item.slug !== slug))
  }, [])

  /**
   * Update item quantity
   * If quantity is 0 or less, remove item
   */
  const updateQuantity = useCallback((slug: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(slug)
      return
    }

    setItems(currentItems => {
      const newItems = [...currentItems]
      const itemIndex = newItems.findIndex(item => item.slug === slug)

      if (itemIndex > -1) {
        newItems[itemIndex] = {
          ...newItems[itemIndex],
          quantity: Math.min(quantity, MAX_QUANTITY)
        }
      }

      return newItems
    })
  }, [removeItem])

  /**
   * Clear entire cart
   */
  const clearCart = useCallback(() => {
    setItems([])
  }, [])

  /**
   * Open cart drawer
   */
  const openCart = useCallback(() => {
    setIsOpen(true)
  }, [])

  /**
   * Close cart drawer
   */
  const closeCart = useCallback(() => {
    setIsOpen(false)
  }, [])

  /**
   * Calculate cart total
   */
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  /**
   * Calculate total item count
   */
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  const value: CartContextType = {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isOpen,
    openCart,
    closeCart
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

/**
 * useCart Hook
 * Access cart context from any component
 */
export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
