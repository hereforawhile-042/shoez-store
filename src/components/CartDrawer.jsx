import { useContext } from "react";
import { CartContext } from "@/context/Contexts";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const CartDrawer = () => {
  const { cart, setCart, formatCurrency, isCartOpen, setIsCartOpen } =
    useContext(CartContext);
  const navigate = useNavigate();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0
  );

  const handleRemove = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id, delta) => {
    setCart((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newQuantity = (item.quantity || 1) + delta;
          return { ...item, quantity: Math.max(1, newQuantity) };
        }
        return item;
      })
    );
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    navigate("/checkout");
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full sm:w-[450px] bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} />
                <h2 className="text-lg font-bold">Shopping Cart</h2>
                <span className="bg-gray-100 text-xs font-medium px-2 py-1 rounded-full">
                  {cart.length} items
                </span>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center">
                    <ShoppingBag className="text-gray-300" size={32} />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-gray-900">
                      Your cart is empty
                    </p>
                    <p className="text-sm text-gray-500">
                      Looks like you haven't added anything yet.
                    </p>
                  </div>
                  <Button
                    onClick={() => {
                      setIsCartOpen(false);
                      navigate("/products");
                    }}
                    variant="outline"
                  >
                    Start Shopping
                  </Button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-contain object-center"
                      />
                    </div>

                    <div className="flex flex-1 flex-col">
                      <div>
                        <div className="flex justify-between text-base font-medium text-gray-900">
                          <h3 className="line-clamp-1">{item.name}</h3>
                          <p className="ml-4">
                            {formatCurrency(item.price * (item.quantity || 1))}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">
                          {item.brand}
                        </p>
                        {item.size && (
                          <p className="mt-1 text-sm text-gray-500">
                            Size: {item.size}
                          </p>
                        )}
                      </div>
                      <div className="flex flex-1 items-end justify-between text-sm">
                        <div className="flex items-center border rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-2 hover:bg-gray-50 disabled:opacity-50"
                            disabled={(item.quantity || 1) <= 1}
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-2 font-medium">
                            {item.quantity || 1}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-2 hover:bg-gray-50"
                          >
                            <Plus size={14} />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemove(item.id)}
                          className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1"
                        >
                          <Trash2 size={16} />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t border-gray-100 p-6 bg-gray-50">
                <div className="flex justify-between text-base font-medium text-gray-900 mb-4">
                  <p>Subtotal</p>
                  <p>{formatCurrency(subtotal)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500 mb-6">
                  Shipping and taxes calculated at checkout.
                </p>
                <Button
                  onClick={handleCheckout}
                  className="w-full py-6 text-base shadow-lg hover:shadow-xl transition-all"
                >
                  Checkout <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <div className="mt-6 flex justify-center text-center text-sm text-gray-500">
                  <p>
                    or{" "}
                    <button
                      type="button"
                      className="font-medium text-black hover:text-gray-800 underline"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Continue Shopping
                      <span aria-hidden="true"> &rarr;</span>
                    </button>
                  </p>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
