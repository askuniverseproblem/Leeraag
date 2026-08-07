"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [loginType, setLoginType] = useState("email");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let emailToUse = identifier;

    if (loginType === "phone") {
      const { data, error: lookupError } = await supabase.rpc("get_email_by_phone", {
        input_phone: identifier,
      });
      if (lookupError || !data) {
        setError("No account found with this phone number.");
        setLoading(false);
        return;
      }
      emailToUse = data;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email: emailToUse,
      password,
    });

    setLoading(false);
    if (error) {
      setError(error.message);
    } else {
      router.push(params.get("redirect") || "/");
    }
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-3xl mb-8">Log In</h1>

      <div className="flex border border-line rounded-full mb-6 overflow-hidden">
        <button
          type="button"
          onClick={() => setLoginType("email")}
          className={`flex-1 py-2 text-sm font-body ${
            loginType === "email" ? "bg-forest text-sand" : "text-ink/60"
          }`}
        >
          Email
        </button>
        <button
          type="button"
          onClick={() => setLoginType("phone")}
          className={`flex-1 py-2 text-sm font-body ${
            loginType === "phone" ? "bg-forest text-sand" : "text-ink/60"
          }`}
        >
          Phone
        </button>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type={loginType === "email" ? "email" : "tel"}
          required
          placeholder={loginType === "email" ? "Email" : "Phone Number"}
          className="input-field"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
        <input
          type="password"
          required
          placeholder="Password"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm font-body">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Logging in..." : "Log In"}
        </button>
      </form>
      <p className="font-body text-sm text-ink/60 mt-6">
        Don't have an account?{" "}
        <Link href="/signup" className="text-forest font-medium">
          Sign Up
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="max-w-sm mx-auto px-5 py-16">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
         }
