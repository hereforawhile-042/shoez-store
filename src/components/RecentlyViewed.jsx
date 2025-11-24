import { useEffect, useState, useContext } from "react";
import { getRecentlyViewed } from "@/utils/recentlyViewed";
import { useNavigate } from "react-router";
import { CartContext } from "@/context/Contexts";
import { Eye, X } from "lucide-react";

const RecentlyViewed = () => {
  const [recentProducts, setRecentProducts] = useState([]);
  const navigate = useNavigate();
  const { formatCurrency } = useContext(CartContext);

  useEffect(() => {
    const products = getRecentlyViewed();
    setRecentProducts(products);
  }, []);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Eye className="text-gray-600" size={24} />
            <h2 className="text-2xl font-bold text-gray-900">
              Recently Viewed
            </h2>
          </div>
          <p className="text-sm text-gray-500">
            {recentProducts.length}{" "}
            {recentProducts.length === 1 ? "item" : "items"}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {recentProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => navigate(`/product/${product.id}`)}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all cursor-pointer group"
            >
              <div className="aspect-square bg-gray-100 overflow-hidden relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm rounded-full p-1.5">
                  <Eye size={14} className="text-gray-600" />
                </div>
              </div>
              <div className="p-3">
                <p className="text-xs text-gray-500 mb-1">{product.brand}</p>
                <h3 className="font-medium text-sm text-gray-900 truncate mb-2">
                  {product.name}
                </h3>
                <p className="font-bold text-gray-900">
                  {formatCurrency(product.price)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RecentlyViewed;
