"use client"
import { useState, useMemo } from "react"
import { Search, Filter, ShoppingCart, ChevronDown } from "lucide-react"

function ProductListing({ products, onAddToCart }) {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [sortBy, setSortBy] = useState("name")
  const [showFilters, setShowFilters] = useState(false)

  const categories = ["all", ...Array.from(new Set(products.map(p => p.category)))]

 const filteredProducts = useMemo(() => {
  const filtered = products.filter(p => {
    const name = p.name || p.title || ""
    const matchesSearch = name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || p.category === selectedCategory
    const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1]
    return matchesSearch && matchesCategory && matchesPrice
  })

  filtered.sort((a,b)=>{
    if(sortBy==="price-low") return a.price-b.price
    if(sortBy==="price-high") return b.price-a.price
    return (a.name || a.title || "").localeCompare(b.name || b.title || "")
  })

  return filtered
}, [searchQuery, selectedCategory, priceRange, sortBy, products])

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex-1 max-w-md relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400"/>
          <input type="text" placeholder="Search products..." value={searchQuery} onChange={(e)=>setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border rounded-lg"/>
        </div>
        <button onClick={()=>setShowFilters(!showFilters)} className="lg:hidden flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"><Filter className="h-4 w-4"/> Filters</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className={`lg:w-64 space-y-6 ${showFilters?"block":"hidden lg:block"}`}>
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <h3 className="font-semibold mb-4">Filters</h3>
            <div className="space-y-4">
              <div>
                <label>Category</label>
                <div className="relative">
                  <select value={selectedCategory} onChange={e=>setSelectedCategory(e.target.value)} className="w-full px-3 py-2 border rounded-lg appearance-none">
                    {categories.map(c=><option key={c} value={c}>{c==="all"?"All":c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none"/>
                </div>
              </div>
              <div>
                <label>Price Range: ${priceRange[0]} - ${priceRange[1]}</label>
                <input type="range" min="0" max="500" value={priceRange[1]} onChange={e=>setPriceRange([priceRange[0],Number(e.target.value)])} className="w-full h-2 mt-2 bg-gray-200 rounded-lg"/>
              </div>
              <div>
                <label>Sort By</label>
                <div className="relative">
                  <select value={sortBy} onChange={e=>setSortBy(e.target.value)} className="w-full px-3 py-2 border rounded-lg appearance-none">
                    <option value="name">Name</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-3 h-4 w-4 text-gray-400 pointer-events-none"/>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product=>(
              <div key={product._id} className="group bg-white rounded-lg shadow-sm border hover:shadow-lg transition-all duration-300 hover:scale-105">
                <div className="p-4">
                  <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                    <img src={product.images && product.images.length > 0 ? product.images[0] : (product.image || "/placeholder.svg")} alt={product.title || product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{product.name || product.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">{product.category}</p>
                  <p className="text-2xl font-bold text-indigo-800">${product.price}</p>
                </div>
                <div className="p-4 pt-0">
                  <button onClick={()=>onAddToCart(product)} className="w-full flex items-center justify-center gap-2 bg-indigo-800 text-white py-2 rounded-lg hover:bg-indigo-900 transition-colors">
                    <ShoppingCart className="h-4 w-4"/> Add to Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductListing
