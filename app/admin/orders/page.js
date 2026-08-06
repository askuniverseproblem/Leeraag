"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

const STATUSES = ["pending", "shipped", "delivered", "cancelled"];

export default function AdminOrders() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function checkAccess() {
      const { data } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login");
        return;
      }
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", data.user.id)
        .single();
      if (profile?.role !== "admin") {
        router.push("/");
        return;
      }
      setChecking(false);
      loadOrders();
    }
    checkAccess();
  }, [router]);

  async function loadOrders() {
    const { data } = await supabase
      .from("orders")
      .select("*, order_items(*, products(name))")
      .order("created_at", { ascending: false });
    setOrders(data || []);
  }

  async function updateStatus(orderId, status) {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    loadOrders();
  }

  if (checking) return <p className="max-w-5xl mx-auto px-5 py-12 font-body">Checking access...</p>;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Admin — Orders</h1>
        <Link href="/admin" className="text-forest font-body underline">
          ← Back to Products
        </Link>
      </div>

      {orders.length === 0 ? (
        <p className="font-body text-ink/50">No orders yet.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-line rounded-lg p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-body font-medium text-sm">Order #{order.id.slice(0, 8)}</p>
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order.id, e.target.value)}
                  className="border border-line rounded px-3 py-1 text-sm font-body"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <p className="font-body text-sm text-ink/60 mb-2">{order.address}</p>
              <ul className="font-body text-sm text-ink/80 mb-2">
                {order.order_items?.map((item) => (
                  <li key={item.id}>
                    {item.products?.name} × {item.quantity} — ₹{item.price}
                  </li>
                ))}
              </ul>
              <p className="font-body font-semibold">Total: ₹{order.total}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
