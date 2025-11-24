import { Search, X } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useNavigate } from "react-router";
import supabase from "@/lib/supabase";

const SearchBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchProducts = async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .or(
            `name.ilike.%${query}%,brand.ilike.%${query}%,category.ilike.%${query}%`
          )
          .limit(5);

        if (error) throw error;
        setResults(data || []);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(searchProducts, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
    setIsOpen(false);
    setQuery("");
    setResults([]);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      setQuery("");
    }
  };

  return (
    <>
      {/* Search Trigger Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
      >
        <Search size={18} className="text-gray-500" />
        <span className="text-sm text-gray-500">Search products...</span>
        <kbd className="px-2 py-1 text-xs bg-white rounded border border-gray-300">
          ⌘K
        </kbd>
      </button>

      {/* Mobile Search Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden p-2 bg-black rounded-full"
      >
        <Search size={18} className="text-white" />
      </button>

      {/* Search Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Search Container */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed top-4 md:top-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] md:w-full max-w-2xl z-50 px-0 md:px-4"
            >
              <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="flex items-center gap-3 p-4 border-b">
                  <Search size={20} className="text-gray-400" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Search for products, brands, categories..."
                    className="flex-1 outline-none text-lg"
                  />
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Search Results */}
                <div className="max-h-96 overflow-y-auto">
                  {loading && (
                    <div className="p-8 text-center text-gray-500">
                      Searching...
                    </div>
                  )}

                  {!loading && query.length >= 2 && results.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No products found for "{query}"
                    </div>
                  )}

                  {!loading && results.length > 0 && (
                    <div className="divide-y">
                      {results.map((product) => (
                        <motion.button
                          key={product.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          onClick={() => handleProductClick(product.id)}
                          className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className="h-16 w-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {product.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                              {product.brand} • {product.category}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">
                              ₦{product.price.toLocaleString()}
                            </p>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                product.status === "In Stock"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {product.status}
                            </span>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {query.length < 2 && (
                    <div className="p-8 text-center text-gray-400 text-sm">
                      Type at least 2 characters to search
                    </div>
                  )}
                </div>

                {/* Quick Actions */}
                {query.length >= 2 && results.length > 0 && (
                  <div className="p-4 bg-gray-50 border-t">
                    <button
                      onClick={() => {
                        navigate(`/products?search=${query}`);
                        setIsOpen(false);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View all results for "{query}" →
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default SearchBar;
