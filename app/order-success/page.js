"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function OrderSuccess() {
  const params = useSearchParams();
  const id = params.get("id");

  return (
    <div className="max-w-xl mx-auto px-5 py-24 text-center">
      <h1 className="font-display text-3xl mb-4">Order Placed!</h1>
      <p className="font-body text-ink/60 mb-2">Your order ID is:</p>
      <p className="font-body font-medium mb-8">{id}</p>
      <Link href="/" className="btn-primary">
        Continue Shopping
      </Link>
    </div>
  );
}
