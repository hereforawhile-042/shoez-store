import Layout from "@/layout/layout";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { RxArrowRight, RxTrash } from "react-icons/rx";
import Stepper from "@/components/ui/Stepper";
import { CartContext } from "@/context/Contexts";
import { Button } from "@/components/ui/button";
import { FaCartPlus } from "react-icons/fa";
import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, Trash2 } from "lucide-react";

const Cart = () => {
  const navigate = useNavigate();
  const { cart, setCart, formatCurrency } = useContext(CartContext);

  // Copy of original cart
  const [cartProducts, setProducts] = useState(
    cart.map((item) => ({ ...item, quantity: item.quantity || 1 }))
  );

  // Remove items from cart
  const handleRemove = (id) => {
    setProducts((prev) => prev.filter((item) => item.id !== id));
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Increment function for stepper component
  const increaseQuant = (id) => {
    setProducts((items) =>
      items.map((prev) => {
        if (prev.id === id) {
          return { ...prev, quantity: prev.quantity + 1 };
        }
        return prev;
      })
    );
  };

  // Decrement function for stepper component
  const decreaseQuant = (id) => {
    setProducts((items) =>
      items.map((prev) => {
        if (prev.id === id && prev.quantity > 1) {
          return { ...prev, quantity: prev.quantity - 1 };
        }
        return prev;
      })
    );
  };

  // Function to calculate order amount
  const cartSum = () => {
    return cartProducts.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
  };

  const subtotal = cartSum();
  const deliveryFee = 0;
  const total = subtotal + deliveryFee;

  // Function to handle navigation to checkout page and update cart context
  const handleCheckout = () => {
    setCart(cartProducts);
    navigate("/checkout");
  };

  return (
    <Layout noPadding={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3"
            >
              <ShoppingBag className="text-gray-900" size={28} />
              <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                Shopping Cart
              </h1>
              {cartProducts.length > 0 && (
                <span className="bg-black text-white text-sm px-3 py-1 rounded-full">
                  {cartProducts.length}{" "}
                  {cartProducts.length === 1 ? "item" : "items"}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                {cartProducts.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center justify-center py-16 px-4"
                  >
                    <FaCartPlus className="w-16 h-16 text-gray-300 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Your cart is empty
                    </h3>
                    <p className="text-gray-500 mb-6 text-center">
                      Add some products to get started
                    </p>
                    <Button onClick={() => navigate("/products")}>
                      Continue Shopping
                    </Button>
                  </motion.div>
                ) : (
                  <div className="divide-y divide-gray-200">
                    <AnimatePresence mode="popLayout">
                      {cartProducts.map((item) => (
                        <motion.div
                          layout
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -50 }}
                          transition={{ duration: 0.3 }}
                          key={item.id}
                          className="p-4 sm:p-6 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex gap-4">
                            {/* Product Image */}
                            <div className="flex-shrink-0">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 object-cover rounded-lg bg-gray-100"
                              />
                            </div>

                            {/* Product Details */}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between gap-4">
                                <div className="flex-1">
                                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-1 line-clamp-2">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-gray-600 mb-2">
                                    {item.brand} • {item.category}
                                  </p>
                                  {item.size && (
                                    <p className="text-sm text-gray-500">
                                      Size: {item.size}
                                    </p>
                                  )}
                                </div>

                                {/* Delete Button - Desktop */}
                                <motion.button
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  onClick={() => handleRemove(item.id)}
                                  className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
                                  title="Remove item"
                                >
                                  <Trash2 size={20} />
                                </motion.button>
                              </div>

                              {/* Price and Quantity Controls */}
                              <div className="flex items-center justify-between mt-4 gap-4">
                                {/* Quantity Stepper */}
                                <div className="flex-shrink-0">
                                  <Stepper
                                    value={item.quantity}
                                    Increment={() => increaseQuant(item.id)}
                                    Decrement={() => decreaseQuant(item.id)}
                                  />
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                  <p className="text-lg sm:text-xl font-bold text-gray-900">
                                    {formatCurrency(item.price * item.quantity)}
                                  </p>
                                  {item.quantity > 1 && (
                                    <p className="text-xs text-gray-500">
                                      {formatCurrency(item.price)} each
                                    </p>
                                  )}
                                </div>
                              </div>

                              {/* Delete Button - Mobile */}
                              <button
                                onClick={() => handleRemove(item.id)}
                                className="sm:hidden flex items-center gap-2 mt-3 text-sm text-red-600 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                                Remove
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white rounded-2xl shadow-sm p-6 sticky top-24"
              >
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {/* Subtotal */}
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>

                  {/* Delivery Fee */}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Fee</span>
                    <span className="font-medium text-green-600">
                      {deliveryFee === 0 ? "FREE" : formatCurrency(deliveryFee)}
                    </span>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-gray-200 pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-gray-900">
                        Total
                      </span>
                      <span className="text-2xl font-bold text-gray-900">
                        {formatCurrency(total)}
                      </span>
                    </div>
                  </div>

                  {/* Checkout Button */}
                  <Button
                    onClick={handleCheckout}
                    disabled={cartProducts.length === 0}
                    className="w-full py-6 text-base font-semibold rounded-xl mt-6"
                  >
                    Proceed to Checkout
                    <RxArrowRight className="ml-2" size={20} />
                  </Button>

                  {/* Continue Shopping Link */}
                  <button
                    onClick={() => navigate("/products")}
                    className="w-full text-center text-sm text-gray-600 hover:text-gray-900 py-3"
                  >
                    ← Continue Shopping
                  </button>
                </div>

                {/* Trust Badges */}
                <div className="mt-6 pt-6 border-t border-gray-200 space-y-3">
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Secure checkout</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>Free delivery on orders over ₦50,000</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <svg
                      className="w-5 h-5 text-green-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>30-day return policy</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cart;
