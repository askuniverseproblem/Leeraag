"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useCart } from "./CartContext";

export default function Navbar() {
  const { count } = useCart();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data?.user || null);
      if (data?.user) checkAdmin(data.user.id);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) checkAdmin(session.user.id);
      else setIsAdmin(false);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function checkAdmin(userId) {
    const { data } = await supabase.from("profiles").select("role").eq("id", userId).single();
    setIsAdmin(data?.role === "admin");
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="border-b border-line bg-sand sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-5 py-4 flex items-center justify-between">
        <Link href="/" className="font-display text-2xl font-semibold text-forest">
          Dukaan
        </Link>
        <nav className="flex items-center gap-5 font-body text-sm">
          {isAdmin && (
            <Link href="/admin" className="hover:text-forest">
              Admin
            </Link>
          )}
          <Link href="/cart" className="hover:text-forest relative">
            Cart{count > 0 ? ` (${count})` : ""}
          </Link>
          {user ? (
            <button onClick={handleLogout} className="hover:text-forest">
              Logout
            </button>
          ) : (
            <Link href="/login" className="hover:text-forest">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
