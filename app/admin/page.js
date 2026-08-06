"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function AdminPage() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: "", price: "", stock: "", description: "" });
  const [imageFile, setImageFile] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);

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
      loadProducts();
    }
    checkAccess();
  }, [router]);

  async function loadProducts() {
    const { data } = await supabase.from("products").select("*").order("created_at", { ascending: false });
    setProducts(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);

    let image_url = editingId ? products.find((p) => p.id === editingId)?.image_url : null;

    if (imageFile) {
      const fileExt = imageFile.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(fileName, imageFile);
      if (!uploadError) {
        const { data: publicUrl } = supabase.storage.from("product-images").getPublicUrl(fileName);
        image_url = publicUrl.publicUrl;
      }
    }

    const payload = {
      name: form.name,
      price: parseFloat(form.price),
      stock: parseInt(form.stock, 10),
      description: form.description,
      image_url,
    };

    if (editingId) {
      await supabase.from("products").update(payload).eq("id", editingId);
    } else {
      await supabase.from("products").insert(payload);
    }

    setForm({ name: "", price: "", stock: "", description: "" });
    setImageFile(null);
    setEditingId(null);
    setSaving(false);
    loadProducts();
  }

  function startEdit(product) {
    setEditingId(product.id);
    setForm({
      name: product.name,
      price: product.price,
      stock: product.stock,
      description: product.description || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    await supabase.from("products").delete().eq("id", id);
    loadProducts();
  }

  if (checking) return <p className="max-w-5xl mx-auto px-5 py-12 font-body">Checking access...</p>;

  return (
    <div className="max-w-5xl mx-auto px-5 py-10">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-3xl">Admin — Products</h1>
        <Link href="/admin/orders" className="text-forest font-body underline">
          View Orders →
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4 border border-line rounded-xl p-6 mb-10">
        <input
          required
          placeholder="Product Name"
          className="input-field"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          required
          type="number"
          step="0.01"
          placeholder="Price (₹)"
          className="input-field"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          required
          type="number"
          placeholder="Stock quantity"
          className="input-field"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          className="input-field"
          onChange={(e) => setImageFile(e.target.files[0])}
        />
        <textarea
          placeholder="Description"
          className="input-field md:col-span-2"
          rows={3}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <div className="md:col-span-2 flex gap-3">
          <button type="submit" disabled={saving} className="btn-primary disabled:opacity-50">
            {saving ? "Saving..." : editingId ? "Update Product" : "Add Product"}
          </button>
          {editingId && (
            <button
              type="button"
              className="btn-outline"
              onClick={() => {
                setEditingId(null);
                setForm({ name: "", price: "", stock: "", description: "" });
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        {products.map((product) => (
          <div key={product.id} className="flex items-center gap-4 border border-line rounded-lg p-4">
            <div className="w-14 h-14 bg-white border border-line rounded-lg overflow-hidden shrink-0">
              {product.image_url && (
                <img src={product.image_url} alt="" className="w-full h-full object-cover" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-body font-medium">{product.name}</p>
              <p className="font-body text-sm text-ink/60">
                ₹{product.price} · Stock: {product.stock}
              </p>
            </div>
            <button onClick={() => startEdit(product)} className="text-sm font-body text-forest">
              Edit
            </button>
            <button
              onClick={() => handleDelete(product.id)}
              className="text-sm font-body text-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
