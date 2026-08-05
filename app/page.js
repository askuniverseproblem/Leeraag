"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "@/components/ProductCard";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });
      if (!error) setProducts(data || []);
      setLoading(false);
    }
    loadProducts();
  }, []);

  return (
    <div>
      <section className="bg-forest text-sand">
        <div className="max-w-6xl mx-auto px-5 py-16">
          <p className="font-body text-amber tracking-wide uppercase text-xs mb-3">
            New arrivals every week
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold max-w-xl">
            Everyday things, chosen well.
          </h1>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 py-12">
        <h2 className="font-display text-2xl mb-6">All Products</h2>
        {loading ? (
          <p className="text-ink/50 font-body">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="text-ink/50 font-body">
            No products yet. Add products from the Admin panel.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
