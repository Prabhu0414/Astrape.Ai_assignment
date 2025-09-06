"use client"
import { Minus, Plus, Trash2, X } from "lucide-react"
import { updateCartItem, removeCartItem } from "../api"

function Cart({ isOpen, onClose, items, onCartChange }) {
  if (!isOpen) return null

  const subtotal = items.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0)
  const tax = subtotal * 0.08
  const total = subtotal + tax

  const handleUpdateItem = async (productId, qty) => {
    try {
      if (qty <= 0) {
        const updated = await removeCartItem(productId)
        onCartChange(updated)
      } else {
        const updated = await updateCartItem(productId, qty)
        onCartChange(updated)
      }
    } catch (err) {
      console.error(err)
      alert(err.message || "Failed to update cart")
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      <div className="absolute right-0 top-0 h-full w-full sm:max-w-lg bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold">Shopping Cart</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.product?._id || item._id} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.product?.images?.[0] || "/placeholder.svg"} alt={item.product?.title} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm">{item.product?.title}</h4>
                      <p className="text-lg font-semibold text-indigo-800">${item.product?.price}</p>

                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleUpdateItem(item.product?._id, item.qty - 1)} className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100">
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-8 text-center text-sm">{item.qty}</span>
                        <button onClick={() => handleUpdateItem(item.product?._id, item.qty + 1)} className="w-8 h-8 flex items-center justify-center border rounded hover:bg-gray-100">
                          <Plus className="h-3 w-3" />
                        </button>
                        <button onClick={() => handleUpdateItem(item.product?._id, 0)} className="w-8 h-8 flex items-center justify-center ml-2 text-red-500 hover:bg-red-50 rounded">
                          <Trash2 className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Summary */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span>Subtotal</span><span>${subtotal.toFixed(2)}</span></div>
                <div className="flex justify-between text-sm"><span>Tax</span><span>${tax.toFixed(2)}</span></div>
                <div className="flex justify-between font-semibold text-lg border-t border-gray-200 pt-2"><span>Total</span><span>${total.toFixed(2)}</span></div>
              </div>
            </div>
            <button className="w-full bg-indigo-800 text-white py-3 rounded-lg hover:bg-indigo-900 font-medium">Proceed to Checkout</button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Cart
