"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "@/components/CartContext";

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", address: "", city: "", pincode: "" });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data?.user) {
        router.push("/login?redirect=/checkout");
      } else {
        setUser(data.user);
      }
    });
  }, [router]);

  async function handlePlaceOrder(e) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        total,
        status: "pending",
        address: `${form.name}, ${form.address}, ${form.city} - ${form.pincode}, Ph: ${form.phone}`,
      })
      .select()
      .single();

    if (orderError) {
      setError(orderError.message);
      setSubmitting(false);
      return;
    }

    const items = cart.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.qty,
      price: item.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(items);

    if (itemsError) {
      setError(itemsError.message);
      setSubmitting(false);
      return;
    }

    clearCart();
    router.push(`/order-success?id=${order.id}`);
  }

  if (!user) return null;

  return (
    <div className="max-w-xl mx-auto px-5 py-12">
      <h1 className="font-display text-3xl mb-8">Checkout</h1>
      <form onSubmit={handlePlaceOrder} className="space-y-4">
        <input
          required
          placeholder="Full Name"
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          placeholder="Phone Number"
          className="input-field"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <input
          required
          placeholder="Address"
          className="input-field"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
        />
        <div className="flex gap-4">
          <input
            required
            placeholder="City"
            className="input-field"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
          />
          <input
            required
            placeholder="Pincode"
            className="input-field"
            value={form.pincode}
            onChange={(e) => setForm({ ...form, pincode: e.target.value })}
          />
        </div>
        <div className="border border-line rounded-lg p-4 font-body text-sm text-ink/70">
          Payment method: <strong>Cash on Delivery</strong>
        </div>
        {error && <p className="text-red-600 text-sm font-body">{error}</p>}
        <div className="flex items-center justify-between pt-4">
          <span className="font-display text-xl">Total: ₹{total}</span>
          <button type="submit" disabled={submitting} className="btn-primary disabled:opacity-50">
            {submitting ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </form>
    </div>
  );
}
