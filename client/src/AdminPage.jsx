"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom" // ✅ use react-router-dom
import { fetchProducts, createProduct, updateProduct, deleteProduct } from "./api"

function AdminPage({ user }) {
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [form, setForm] = useState({ title: "", price: 0, category: "", image: "" })
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(false)

  // Redirect non-admins (only after user is loaded)
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/")
    }
  }, [user, navigate])

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch (err) {
      alert(err.message || "Failed to fetch products")
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price) {
      alert("Title and price are required.")
      return
    }
    setLoading(true)
    try {
      if (editingId) {
        await updateProduct(editingId, form)
        alert("Product updated")
      } else {
        await createProduct(form)
        alert("Product added")
      }
      setForm({ title: "", price: 0, category: "", image: "" })
      setEditingId(null)
      loadProducts()
    } catch (err) {
      alert(err.message || "Failed to save product")
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (product) => {
    setForm({
      title: product.title,
      price: product.price,
      category: product.category,
      image: product.image
    })
    setEditingId(product._id)
  }

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure?")) return
    try {
      await deleteProduct(id)
      alert("Product deleted")
      loadProducts()
    } catch (err) {
      alert(err.message || "Failed to delete product")
    }
  }

  // Log out handler
  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    navigate("/")
    window.location.reload() // Ensures App state resets
  }

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-indigo-800">Admin Panel</h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/")}
            className="bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-indigo-900"
          >
            Go to Shop
          </button>
          <button
            onClick={handleLogout}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300"
          >
            Log Out
          </button>
        </div>
      </div>

      {/* Product Form */}
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-lg shadow space-y-4">
        <h2 className="font-semibold">{editingId ? "Edit Product" : "Add Product"}</h2>
        <input
          type="text"
          placeholder="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
          className="w-full border px-3 py-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="Image URL"
          value={form.image}
          onChange={(e) => setForm({ ...form, image: e.target.value })}
          className="w-full border px-3 py-2 rounded"
        />
        <button type="submit" disabled={loading} className="bg-indigo-800 text-white py-2 px-4 rounded">
          {loading ? "Saving..." : editingId ? "Update Product" : "Add Product"}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={() => {
              setEditingId(null)
              setForm({ title: "", price: 0, category: "", image: "" })
            }}
            className="ml-2 py-2 px-4 rounded border"
          >
            Cancel
          </button>
        )}
      </form>

      {/* Product List */}
      <div className="space-y-4">
          {products.map((p) => (
            <div key={p._id} className="flex justify-between items-center p-4 bg-white rounded shadow">
              <div className="flex items-center gap-4">
                <img src={p.image} alt={p.title} className="w-16 h-16 object-cover rounded" />
                <div>
                  <h3 className="font-semibold">{p.title}</h3>
                  <p className="text-gray-600">${p.price} - {p.category}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleEdit(p)} className="px-3 py-1 bg-yellow-400 rounded">
                  Edit
                </button>
                <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-red-500 text-white rounded">
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

export default AdminPage
