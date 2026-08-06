"use client";

import Link from "next/link";
import { useCart } from "./CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="group">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-[4/5] bg-white border border-line rounded-xl overflow-hidden mb-3">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-ink/30 font-body text-sm">
              No image
            </div>
          )}
        </div>
      </Link>
      <Link href={`/product/${product.id}`}>
        <h3 className="font-body font-medium text-ink">{product.name}</h3>
      </Link>
      <div className="flex items-center justify-between mt-1">
        <span className="font-display text-lg text-forest">₹{product.price}</span>
        <button
          onClick={() => addToCart(product, 1)}
          className="text-sm font-body px-3 py-1.5 rounded-full border border-ink/20 hover:border-forest hover:text-forest transition-colors"
        >
          Add
        </button>
      </div>
    </div>
  );
}
