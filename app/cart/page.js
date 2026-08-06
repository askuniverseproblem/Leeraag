"use client";

import Link from "next/link";
import { useCart } from "@/components/CartContext";

export default function CartPage() {
  const { cart, updateQty, removeFromCart, total } = useCart();

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-16 text-center">
        <p className="font-body text-ink/60 mb-6">Your cart is empty.</p>
        <Link href="/" className="btn-primary">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl mb-8">Your Cart</h1>
      <div className="space-y-5">
        {cart.map((item) => (
          <div key={item.id} className="flex items-center gap-4 border-b border-line pb-5">
            <div className="w-20 h-20 bg-white border border-line rounded-lg overflow-hidden shrink-0">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-body font-medium">{item.name}</p>
              <p className="font-body text-forest">₹{item.price}</p>
            </div>
            <div className="flex items-center border border-line rounded-full">
              <button className="px-3 py-1" onClick={() => updateQty(item.id, item.qty - 1)}>
                −
              </button>
              <span className="px-2 font-body">{item.qty}</span>
              <button className="px-3 py-1" onClick={() => updateQty(item.id, item.qty + 1)}>
                +
              </button>
            </div>
            <button
              onClick={() => removeFromCart(item.id)}
              className="text-sm text-ink/50 hover:text-red-600 font-body"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between mt-8">
        <span className="font-display text-2xl">Total: ₹{total}</span>
        <Link href="/checkout" className="btn-primary">
          Checkout
        </Link>
      </div>
    </div>
  );
}
