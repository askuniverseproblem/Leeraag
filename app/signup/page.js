"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          age: age,
          phone: phone,
        },
      },
    });

    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="max-w-sm mx-auto px-5 py-16 text-center">
        <h1 className="font-display text-3xl mb-4">Check your email</h1>
        <p className="font-body text-ink/60 mb-8">
          We've sent a confirmation link to <strong>{email}</strong>. Click it to activate your
          account, then come back and log in.
        </p>
        <Link href="/login" className="btn-primary">
          Go to Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-5 py-16">
      <h1 className="font-display text-3xl mb-8">Sign Up</h1>
      <form onSubmit={handleSignup} className="space-y-4">
        <input
          required
          placeholder="Full Name"
          className="input-field"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          required
          type="number"
          min="1"
          placeholder="Age"
          className="input-field"
          value={age}
          onChange={(e) => setAge(e.target.value)}
        />
        <input
          type="email"
          required
          placeholder="Email"
          className="input-field"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="tel"
          required
          placeholder="Phone Number"
          className="input-field"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <input
          type="password"
          required
          minLength={6}
          placeholder="Password (min 6 chars)"
          className="input-field"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="text-red-600 text-sm font-body">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full disabled:opacity-50">
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>
      <p className="font-body text-sm text-ink/60 mt-6">
        Already have an account?{" "}
        <Link href="/login" className="text-forest font-medium">
          Log In
        </Link>
      </p>
    </div>
  );
}
