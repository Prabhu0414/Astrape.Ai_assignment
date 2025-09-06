"use client"
import { useState } from "react"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"
import { login, signup } from "../api"

function AuthForm({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [signupForm, setSignupForm] = useState({ name: "", email: "", password: "", confirmPassword: "" })

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleLogin = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    if (!loginForm.email || !loginForm.password) {
      setErrors({ general: "Email and password required" })
      setIsLoading(false)
      return
    }
    try {
      const user = await login(loginForm)
      onLogin(user)
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setErrors({})
    const newErrors = {}
    if (!signupForm.name) newErrors.name = "Name is required"
    if (!signupForm.email) newErrors.email = "Email is required"
    else if (!validateEmail(signupForm.email)) newErrors.email = "Invalid email"
    if (!signupForm.password) newErrors.password = "Password required"
    else if (signupForm.password.length < 6) newErrors.password = "Min 6 chars"
    if (signupForm.password !== signupForm.confirmPassword) newErrors.confirmPassword = "Passwords do not match"
    if (Object.keys(newErrors).length > 0) return setErrors(newErrors), setIsLoading(false)

    try {
      const user = await signup(signupForm)
      onLogin(user)
    } catch (err) {
      setErrors({ general: err.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-indigo-800 mb-2">ModernShop</h1>
          <p className="text-gray-600">Your premium shopping destination</p>
        </div>

        <div className="bg-white/50 backdrop-blur-sm rounded-lg shadow-xl border-0 p-6">
          <div className="flex bg-gray-100 rounded-lg p-1 mb-6">
            <button onClick={() => setActiveTab("login")} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${activeTab==="login"?"bg-white text-indigo-800 shadow-sm":"text-gray-600 hover:text-gray-900"}`}>Login</button>
            <button onClick={() => setActiveTab("signup")} className={`flex-1 py-2 px-4 rounded-md text-sm font-medium ${activeTab==="signup"?"bg-white text-indigo-800 shadow-sm":"text-gray-600 hover:text-gray-900"}`}>Sign Up</button>
          </div>

          {errors.general && <p className="text-red-500 mb-2">{errors.general}</p>}

          {activeTab === "login" ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                <input type="email" placeholder="Email" value={loginForm.email} onChange={(e)=>setLoginForm({...loginForm,email:e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg"/>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                <input type={showPassword?"text":"password"} placeholder="Password" value={loginForm.password} onChange={(e)=>setLoginForm({...loginForm,password:e.target.value})} className="w-full pl-10 pr-10 py-2 border rounded-lg"/>
                <button type="button" onClick={()=>setShowPassword(!showPassword)} className="absolute right-3 top-3">{showPassword?<EyeOff className="h-4 w-4"/>:<Eye className="h-4 w-4"/>}</button>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-indigo-800 text-white py-2 rounded-lg">{isLoading?"Signing in...":"Sign In"}</button>
            </form>
          ) : (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                <input type="text" placeholder="Full Name" value={signupForm.name} onChange={(e)=>setSignupForm({...signupForm,name:e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg"/>
              </div>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                <input type="email" placeholder="Email" value={signupForm.email} onChange={(e)=>setSignupForm({...signupForm,email:e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg"/>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                <input type={showPassword?"text":"password"} placeholder="Password" value={signupForm.password} onChange={(e)=>setSignupForm({...signupForm,password:e.target.value})} className="w-full pl-10 pr-10 py-2 border rounded-lg"/>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
                <input type="password" placeholder="Confirm Password" value={signupForm.confirmPassword} onChange={(e)=>setSignupForm({...signupForm,confirmPassword:e.target.value})} className="w-full pl-10 pr-4 py-2 border rounded-lg"/>
              </div>
              <button type="submit" disabled={isLoading} className="w-full bg-indigo-800 text-white py-2 rounded-lg">{isLoading?"Creating...":"Create Account"}</button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthForm
