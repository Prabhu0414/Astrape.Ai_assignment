# Astrape.ai Assignment

## Features

### User Features
- **Sign Up / Login:** Users can register and log in securely.
- **Browse Products:** All products from the database are displayed on the home page with images, categories, and prices.
- **Search & Filter:** Users can search for products by name/title, filter by category, and sort by price or name.
- **Add to Cart:** Users can add products to their cart, update quantities, and remove items. Cart persists for logged-in users and guests.
- **Checkout (UI only):** Users can view a cart summary and proceed to checkout (demo UI).

### Admin Features
- **Admin Login:** Admins can log in with their credentials.
- **Add Product:** Admins can add new products with title, price, category, and image.
- **Update Product:** Admins can edit existing products' details.
- **Delete Product:** Admins can remove products from the database.
- **Admin Panel:** Admins have access to a dedicated panel for product management.

## Tech Stack
- **Frontend:** React, Tailwind CSS, Axios
- **Backend:** Node.js, Express, MongoDB, Mongoose

## How to Run
1. **Install dependencies:**
   - In `/client` and `/server` folders: `npm install`
2. **Start the backend:**
   - `cd server && npm run dev` (or `npm start`)
3. **Start the frontend:**
   - `cd client && npm run dev`
4. **Visit** `http://localhost:5173` (or the port shown in your terminal)

## Notes
- Only users with the `admin` role can access the admin panel and perform product management actions.
- All product changes (add, update, delete) are reflected in real time for all users.
- Cart and authentication are persistent across page refreshes.

---

For any issues, please check the browser console and server logs for error details.
