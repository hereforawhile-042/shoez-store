// App.jsx
import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router";
import Homepage from "./pages/Home";
import ProductDetail from "./pages/ProductDetails";
import ProductGrid from "./pages/Products";
import Contact from "./pages/Contact";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Cart from "./pages/Cart";
import { ToastContainer, toast } from "react-toastify";
import Checkout from "./pages/Checkout";
import AdminDashboard from "./pages/admin/admin";
import { Profile } from "./pages/profile";
import FavouritePage from "./pages/Favourites";

import { CartContext, FavouriteContext } from "./context/Contexts";

function App() {
  const savedCart = JSON.parse(localStorage.getItem("cart"));
  const [cart, setCart] = useState(savedCart ? savedCart : []);
  const [favourite, setFavourite] = useState([]);
  const [isHeart, setIsHeart] = useState(false);

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(value);

  const addToCart = (product) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      // For now, just warn like before, or we could increment quantity
      // toast.info("Item already in cart");
      // Let's just update quantity if it exists, or warn.
      // The user's previous logic was to warn. I'll stick to that for now to avoid breaking changes,
      // but I'll make it smarter: if it's the same product, maybe just let it be.
      // Actually, let's allow adding multiple if it's a different size?
      // The current schema doesn't seem to support size in cart item ID check easily without composite key.
      // I'll stick to the simple check for now.

      // However, ProductDetails passes { ...product, size: selectedSize }.
      // So we should check if id AND size match?
      // The previous ProductCard logic only checked ID.

      // Let's improve it:
      setCart((prev) => {
        const exists = prev.find((item) => item.id === product.id);
        if (exists) {
          // If we want to support quantity:
          // return prev.map(item => item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item);

          // But for now, let's stick to the "Item already exists" warning to be safe with existing Cart page logic
          // unless I verify Cart page handles quantity.
          // Checkout.jsx handles quantity.

          // Let's just return prev and toast.
          // But we can't toast inside setState updater easily/cleanly.
          return prev;
        }
        return [...prev, { ...product, quantity: 1 }];
      });

      if (cart.some((item) => item.id === product.id)) {
        // toast is imported? No, need to import toast in App.jsx or pass it.
        // toast is imported in App.jsx.
        // But we can't easily toast inside the function if we rely on state closure for toast check?
        // Actually we can just check `cart` state since it's in scope.
        toast.info("Item already in cart");
      } else {
        toast.success("Added to cart");
      }
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
      toast.success("Added to cart");
    }
  };

  const contextValue = { cart, setCart, addToCart, formatCurrency };
  const favouriteValue = { favourite, setFavourite, isHeart, setIsHeart };

  console.log(favourite);

  return (
    <CartContext.Provider value={contextValue}>
      <FavouriteContext.Provider value={favouriteValue}>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick={false}
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <Router>
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/products" element={<ProductGrid />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/products/product/:id" element={<ProductDetail />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/favourite" element={<FavouritePage />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Router>
      </FavouriteContext.Provider>
    </CartContext.Provider>
  );
}

export default App;
