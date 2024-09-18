import { Product } from "@/payload-types";
import { MenuItems } from "@headlessui/react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItem = {
    id: Number;
    product: Product;
    quantity: number;
    notes: string;
};

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity: number, notes: string) => void;
  removeItem: (productId: Number) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
        items: [],

        addItem: (product: Product, quantity: number, notes: string) =>
            set((state: CartState) => {
                return { items: [...state.items, { id: state.items.length ,product, quantity, notes }] };
            }),

        removeItem: (id) =>
            set((state: CartState) => ({
                items: state.items.filter((item) => item.id !== id),
            })),

        clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
