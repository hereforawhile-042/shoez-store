import Layout from "@/layout/layout";
import { useParams } from "react-router";
import { useState, useEffect, useContext, useCallback } from "react";
import supabase from "@/lib/supabase";
import { CartContext } from "@/context/Contexts";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState(null);
  const { addToCart } = useContext(CartContext);

  const fetchProduct = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setProduct({
        ...data,
        shortDescription: data.short_description,
        sizes: Array.isArray(data.sizes) ? data.sizes : [],
      });
    } catch (error) {
      console.error("Error fetching product:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleAddToCart = () => {
    if (!product) return;
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    addToCart({
      ...product,
      size: selectedSize,
    });
    toast.success("Added to cart!");
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "NGN",
      maximumFractionDigits: 0,
    }).format(value);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-[60vh]">
          <Loader2 className="animate-spin" size={40} />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="p-8 text-center">
          <h2 className="text-2xl font-bold">Product not found</h2>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-6xl mx-auto p-6 grid md:grid-cols-2 gap-10">
        <div className="flex justify-center items-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full max-w-md rounded-xl shadow-md object-cover"
          />
        </div>
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-neutral-600 text-lg">{product.brand}</p>
          <p className="text-2xl font-semibold text-green-600">
            {formatCurrency(product.price)}
          </p>
          <p className="text-neutral-700">{product.shortDescription}</p>

          {product.sizes && product.sizes.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Available Sizes</h3>
              <div className="flex gap-2 flex-wrap">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`px-4 py-2 border rounded-lg transition ${
                      selectedSize === size
                        ? "bg-black text-white border-black"
                        : "hover:bg-gray-100 border-gray-300"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2 items-center mt-4">
            <button
              onClick={handleAddToCart}
              className="w-9/12 px-6 py-3 bg-black text-white rounded-3xl hover:bg-neutral-800 transition"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
