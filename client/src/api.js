import axios from "axios"

const API = axios.create({
  baseURL: "https://astrape-ai-assignment-1.onrender.com",
  headers: { "Content-Type": "application/json" },
})

// Attach token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// -------- AUTH APIs --------
export const signup = async (userData) => {
  try {
    const { data } = await API.post("/auth/signup", userData)
    if (!data || !data.token) throw new Error(data?.message || "Token missing in response")
    localStorage.setItem("token", data.token)
    return data.user
  } catch (err) {
    if (err.response && err.response.data) throw new Error(err.response.data.message)
    throw new Error(err.message || "Signup failed")
  }
}

export const login = async (userData) => {
  try {
    const { data } = await API.post("/auth/login", userData)
    if (!data || !data.token) throw new Error("Token missing in response")
    localStorage.setItem("token", data.token)
    localStorage.setItem("user", JSON.stringify(data.user)) // ✅ save user
    return data.user
  } catch (err) {
    throw new Error(err.response?.data?.message || "Login failed")
  }
}


export const logout = () => {
  localStorage.removeItem("token")
}

// -------- PRODUCT APIs --------
export const fetchProducts = async (filters = {}) => {
  try {
    const query = new URLSearchParams(filters).toString()
    const { data } = await API.get(`/products?${query}`)
    return data.products
  } catch (err) {
    throw err.response?.data || err
  }
}

export const fetchProductById = async (id) => {
  try {
    const { data } = await API.get(`/products/${id}`)
    return data
  } catch (err) {
    throw err.response?.data || err
  }
}

// Admin: Create product
export const createProduct = async (product) => {
  try {
    const { data } = await API.post("/admin", product)
    return data
  } catch (err) {
    throw err.response?.data || err
  }
}

// Admin: Update product
export const updateProduct = async (id, product) => {
  try {
    const { data } = await API.put(`/admin/${id}`, product)
    return data
  } catch (err) {
    throw err.response?.data || err
  }
}

// Admin: Delete product
export const deleteProduct = async (id) => {
  try {
    const { data } = await API.delete(`/admin/${id}`)
    return data
  } catch (err) {
    throw err.response?.data || err
  }
}

// Add item to cart
export const addToCart = async (productId, qty = 1) => {
  try {
    const { data } = await API.post("/cart/add", { productId, qty });
    return data.items;
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Update cart item quantity
export const updateCartItem = async (productId, qty) => {
  try {
    const { data } = await API.put("/cart/item", { productId, qty });
    return data.items || data.cart?.items || [];
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Remove item from cart
export const removeCartItem = async (productId) => {
  try {
    const { data } = await API.delete(`/cart/item/${productId}`);
    return data.items || data.cart?.items || [];
  } catch (err) {
    throw err.response?.data || err;
  }
};

// Fetch cart items
export const fetchCart = async () => {
  try {
    const { data } = await API.get("/cart");
    return data.items;
  } catch (err) {
    throw err.response?.data || err;
  }
};

export const getCartItems = async () => {
  try {
    const { data } = await API.get("/cart");
    return data.items;
  } catch (err) {
    throw err.response?.data || err;
  }
};

