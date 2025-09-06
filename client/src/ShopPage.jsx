
import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AuthForm from "./components/AuthForm"
import ProductListing from "./components/ProductList"
import Cart from "./components/Cart"
import { fetchProducts, addToCart, getCartItems } from "./api"
function ShopPage({ setUser: setUserFromApp }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })
  const [products, setProducts] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    if (setUserFromApp) setUserFromApp(null)
  }

  // Fetch products on mount
  useEffect(() => {
    const loadProducts = async () => {
      try {
  const data = await fetchProducts({ limit: 1000 })
        setProducts(data)
      } catch (err) {
        console.error(err)
      }
    }
    loadProducts()
  }, [])

  // Load cart items
  useEffect(() => {
    const loadCart = async () => {
      if (user) {
        const items = await getCartItems()
        setCartItems(items)
      } else {
        setCartItems(JSON.parse(localStorage.getItem("cart")) || [])
      }
    }
    loadCart()
  }, [user])

  const handleLogin = (userData) => {
    setUser(userData)
    localStorage.setItem("user", JSON.stringify(userData))
    if (setUserFromApp) setUserFromApp(userData)
  }

  const handleAddToCart = async (product) => {
    try {
      let updatedCart
      if (user) {
  updatedCart = await addToCart(product._id, 1)
      } else {
        const storedCart = JSON.parse(localStorage.getItem("cart")) || []
  const index = storedCart.findIndex((i) => i._id === product._id)
        if (index >= 0) storedCart[index].quantity += 1
        else storedCart.push({ ...product, quantity: 1 })
        localStorage.setItem("cart", JSON.stringify(storedCart))
        updatedCart = storedCart
      }
      setCartItems(updatedCart)
      setIsCartOpen(true)
    } catch (err) {
      console.error(err)
      alert(err.message || "Failed to add to cart")
    }
  }

  // Redirect admin users to /admin
  useEffect(() => {
    if (user && user.role === "admin") {
      navigate("/admin");
    }
    if (setUserFromApp) setUserFromApp(user)
  }, [user, setUserFromApp, navigate])


  return (
    <div>
      {!user ? (
        <AuthForm onLogin={handleLogin} />
      ) : (
        <div className="p-6">
          <div className="flex justify-between items-center mb-6 gap-4 flex-wrap">
            <h1 className="text-3xl font-bold text-indigo-800">Welcome, {user.name}</h1>
            <div className="flex gap-2">
              <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 bg-indigo-800 text-white px-4 py-2 rounded-lg hover:bg-indigo-900">
                View Cart ({cartItems.reduce((sum, i) => sum + (i.qty || i.quantity || 0), 0)})
              </button>
              <button onClick={handleLogout} className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300">
                Log Out
              </button>
            </div>
          </div>

          <ProductListing products={products} onAddToCart={handleAddToCart} />

          <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} items={cartItems} onCartChange={setCartItems} />
        </div>
      )}
    </div>
  )
}

export default ShopPage
