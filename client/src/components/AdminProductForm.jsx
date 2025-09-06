// AdminProductForm.jsx
"use client"
import { useState } from "react"
import { createProduct } from "../api"

function AdminProductForm({ onCreated }) {
  const [form, setForm] = useState({ title: "", price: "", category: "", image: "" })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    try {
  const product = await createProduct({ ...form, price: Number(form.price) })
  onCreated(product)
  setForm({ title: "", price: "", category: "", image: "" })
    } catch (err) {
      setError(err.message || "Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md p-4 bg-white rounded shadow">
      {error && <p className="text-red-500">{error}</p>}
  <input placeholder="Title" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} className="w-full border px-3 py-2 rounded"/>
      <input type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="w-full border px-3 py-2 rounded"/>
      <input placeholder="Category" value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="w-full border px-3 py-2 rounded"/>
      <input placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className="w-full border px-3 py-2 rounded"/>
      <button type="submit" disabled={loading} className="w-full bg-indigo-800 text-white py-2 rounded">{loading ? "Creating..." : "Add Product"}</button>
    </form>
  )
}

export default AdminProductForm
