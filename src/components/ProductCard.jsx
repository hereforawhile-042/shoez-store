import React, { useContext } from "react";
import { CartContext, FavouriteContext } from "@/context/Contexts";
import { useNavigate } from "react-router";
import { Heart, ShoppingCart, Eye } from "lucide-react";
import { motion as Motion } from "framer-motion";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { favourite, setFavourite } = useContext(FavouriteContext);
  const { addToCart, formatCurrency } = useContext(CartContext);

  const isFavourite = favourite.some((item) => item.id === product.id);

  const toggleFavourite = (e) => {
    e.stopPropagation();
    const exists = favourite.find((item) => item.id === product.id);
    if (exists) {
      setFavourite((prev) => prev.filter((item) => item.id !== product.id));
    } else {
      setFavourite((prev) => [...prev, product]);
    }
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleViewDetails = () => {
    navigate(`/product/${product.id}`);
  };

  return (
    <Motion.div
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
      onClick={handleViewDetails}
      className="group relative bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-xl transition-shadow duration-300 cursor-pointer flex flex-col h-full"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-neutral-100">
        {product.image ? (
          <Motion.img
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.4 }}
            src={product.image}
            alt={product.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-50">
            No Image
          </div>
        )}

        {/* Action Buttons Overlay */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0 z-20">
          <Motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleFavourite}
            className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 text-neutral-700 hover:text-red-500 transition-colors"
            title={isFavourite ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              size={18}
              className={isFavourite ? "fill-red-500 text-red-500" : ""}
            />
          </Motion.button>
          <Motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddToCart}
            className="p-2 bg-white rounded-full shadow-md hover:bg-black hover:text-white text-neutral-700 transition-colors"
            title="Add to cart"
          >
            <ShoppingCart size={18} />
          </Motion.button>
          <Motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleViewDetails}
            className="p-2 bg-white rounded-full shadow-md hover:bg-neutral-100 text-neutral-700 transition-colors"
            title="View details"
          >
            <Eye size={18} />
          </Motion.button>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-1">
          <p className="text-xs text-neutral-500 font-medium uppercase tracking-wide">
            {product.brand || "Brand"}
          </p>
        </div>
        <h3 className="font-semibold text-neutral-900 truncate mb-1 text-base group-hover:text-blue-600 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-neutral-500 line-clamp-2 mb-3 h-8">
          {product.shortDescription || product.short_description}
        </p>

        <div className="mt-auto flex items-center justify-between pt-2 border-t border-neutral-100">
          <span className="font-bold text-neutral-900 text-lg">
            {formatCurrency(product.price)}
          </span>
          {/* Optional: Rating or other info */}
        </div>
      </div>
    </Motion.div>
  );
};

export default ProductCard;
