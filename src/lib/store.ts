import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  name: string
  price: number
  image: string
  quantity: number
  startDate: string // ISO date string
  endDate: string // ISO date string
  duration: number
  pickupTime?: string // "pagi" | "malam"
  returnTime?: string // "pagi" | "malam" | etc
}

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  clearCart: () => void
  total: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (newItem) => {
        set((state) => {
          // Check if item with same ID AND same dates exists
          const existingItemIndex = state.items.findIndex(
            (item) => 
              item.id === newItem.id && 
              item.startDate === newItem.startDate && 
              item.endDate === newItem.endDate &&
              item.pickupTime === newItem.pickupTime &&
              item.returnTime === newItem.returnTime
          )

          if (existingItemIndex > -1) {
            const newItems = [...state.items]
            newItems[existingItemIndex].quantity += newItem.quantity
            return { items: newItems }
          }

          return { items: [...state.items, newItem] }
        })
      },
      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== itemId),
        }))
      },
      clearCart: () => set({ items: [] }),
      total: () => {
        return get().items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
      }
    }),
    {
      name: 'rental-cart-storage',
    }
  )
)
