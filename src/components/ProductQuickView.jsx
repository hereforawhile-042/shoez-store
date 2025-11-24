import { X, ZoomIn, Heart, ShoppingCart, Star } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useContext, useState } from "react";
import { CartContext, FavouriteContext } from "@/context/Contexts";
import { Button } from "./ui/button";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const ProductQuickView = ({ product, isOpen, onClose }) => {
  const { addToCart, formatCurrency } = useContext(CartContext);
  const { favourite, setFavourite } = useContext(FavouriteContext);
  const [selectedSize, setSelectedSize] = useState(null);
  const navigate = useNavigate();

  if (!product) return null;

  const isFavourite = favourite.some((item) => item.id === product.id);

  const toggleFavourite = (e) => {
    e.stopPropagation();
    if (isFavourite) {
      setFavourite(favourite.filter((item) => item.id !== product.id));
      toast.info("Removed from wishlist");
    } else {
      setFavourite([...favourite, product]);
      toast.success("Added to wishlist");
    }
  };

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes && product.sizes.length > 0) {
      toast.error("Please select a size");
      return;
    }
    addToCart({ ...product, size: selectedSize });
    onClose();
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 rounded-full bg-white shadow-lg hover:bg-gray-100 transition-colors z-10"
              >
                <X size={20} />
              </button>

              <div className="grid md:grid-cols-2 gap-8 p-8">
                {/* Image Section */}
                <div className="relative">
                  <div className="aspect-square rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <button
                    onClick={toggleFavourite}
                    className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
                  >
                    <Heart
                      size={20}
                      className={
                        isFavourite
                          ? "fill-red-500 text-red-500"
                          : "text-gray-600"
                      }
                    />
                  </button>
                </div>

                {/* Product Info */}
                <div className="flex flex-col">
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                      {product.brand}
                    </p>
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                      {product.name}
                    </h2>

                    {/* Rating */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={
                              i < 4
                                ? "fill-yellow-400 text-yellow-400"
                                : "text-gray-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">(4.0)</span>
                    </div>

                    <p className="text-3xl font-bold text-gray-900 mb-6">
                      {formatCurrency(product.price)}
                    </p>

                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {product.short_description ||
                        "Premium quality footwear designed for comfort and style."}
                    </p>

                    {/* Size Selection */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Select Size
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {product.sizes.map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-4 py-2 rounded-lg border-2 transition-all ${
                                selectedSize === size
                                  ? "border-black bg-black text-white"
                                  : "border-gray-200 hover:border-gray-400"
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Stock Status */}
                    <div className="mb-6">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                          product.status === "In Stock"
                            ? "bg-green-100 text-green-800"
                            : product.status === "Low Stock"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {product.status}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button
                      onClick={handleAddToCart}
                      className="w-full py-6 text-base flex items-center justify-center gap-2"
                      disabled={product.status === "Out of Stock"}
                    >
                      <ShoppingCart size={20} />
                      Add to Cart
                    </Button>
                    <Button
                      onClick={handleViewDetails}
                      variant="outline"
                      className="w-full py-6 text-base flex items-center justify-center gap-2"
                    >
                      <ZoomIn size={20} />
                      View Full Details
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ProductQuickView;
