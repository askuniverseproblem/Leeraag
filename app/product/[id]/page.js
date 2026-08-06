"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/components/CartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProduct() {
      const { data } = await supabase.from("products").select("*").eq("id", id).single();
      setProduct(data);
      setLoading(false);
    }
    loadProduct();
  }, [id]);

  if (loading) return <p className="max-w-6xl mx-auto px-5 py-12 font-body">Loading...</p>;
  if (!product)
    return <p className="max-w-6xl mx-auto px-5 py-12 font-body">Product not found.</p>;

  return (
    <div className="max-w-6xl mx-auto px-5 py-12 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-white border border-line rounded-xl overflow-hidden">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink/30">No image</div>
        )}
      </div>
      <div>
        <h1 className="font-display text-3xl mb-2">{product.name}</h1>
        <p className="font-display text-2xl text-forest mb-4">₹{product.price}</p>
        <p className="font-body text-ink/70 mb-6">{product.description}</p>
        <p className="font-body text-sm text-ink/50 mb-6">
          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
        </p>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center border border-line rounded-full">
            <button className="px-4 py-2" onClick={() => setQty((q) => Math.max(1, q - 1))}>
              −
            </button>
            <span className="px-3 font-body">{qty}</span>
            <button className="px-4 py-2" onClick={() => setQty((q) => q + 1)}>
              +
            </button>
          </div>
        </div>
        <button
          disabled={product.stock <= 0}
          className="btn-primary disabled:opacity-40"
          onClick={() => {
            addToCart(product, qty);
            router.push("/cart");
          }}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
