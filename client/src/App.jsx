import React, { useState, useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from "react-router-dom"
import ShopPage from "./ShopPage"
import AdminPage from "./AdminPage"

function App() {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user")
    return saved ? JSON.parse(saved) : null
  })

  return (
    <Router>
      <Routes>
        {/* Shop route */}
        <Route path="/" element={<ShopPage setUser={setUser} />} />

        {/* Admin route (protected) */}
        <Route
          path="/admin"
          element={
            user && user.role === "admin" ? (
              <AdminPage user={user} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </Router>
  )
}

export default App
