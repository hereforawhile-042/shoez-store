import {
  Package,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Loader2,
} from "lucide-react";
import { useContext, useEffect, useState, useCallback } from "react";
import { CartContext } from "../../context/Contexts";
import AddProductModal from "../../components/AddProductModal";
import supabase from "../../lib/supabase";
import { toast } from "react-toastify";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [stats, setStats] = useState([
    { label: "Total Products", value: "0", icon: Package, change: "0%" },
    { label: "Total Orders", value: "0", icon: ShoppingBag, change: "0%" },
    { label: "Customers", value: "0", icon: Users, change: "0%" },
    { label: "Revenue", value: 0, icon: TrendingUp, change: "0%" },
  ]);

  const { formatCurrency } = useContext(CartContext);

  const calculateStats = useCallback((currentProducts, currentOrders) => {
    const totalRevenue = currentOrders.reduce(
      (sum, order) => sum + (Number(order.amount) || 0),
      0
    );
    // simplistic customer count
    const uniqueCustomers = new Set(
      currentOrders.map((o) => o.customer_email || o.customer_name)
    ).size;

    setStats([
      {
        label: "Total Products",
        value: currentProducts.length.toString(),
        icon: Package,
        change: "+0%",
      },
      {
        label: "Total Orders",
        value: currentOrders.length.toString(),
        icon: ShoppingBag,
        change: "+0%",
      },
      {
        label: "Customers",
        value: uniqueCustomers.toString(),
        icon: Users,
        change: "+0%",
      },
      {
        label: "Revenue",
        value: totalRevenue,
        icon: TrendingUp,
        change: "+0%",
      },
    ]);
  }, []);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // Fetch Products
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (productsError) throw productsError;

      // Fetch Orders
      const { data: ordersData, error: ordersError } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (ordersError) {
        console.error("Error fetching orders:", ordersError);
      }

      const fetchedProducts = productsData || [];
      const fetchedOrders = ordersData || [];

      setProducts(fetchedProducts);
      setOrders(fetchedOrders);
      calculateStats(fetchedProducts, fetchedOrders);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to fetch dashboard data");
    } finally {
      setLoading(false);
    }
  }, [calculateStats]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleAddProduct = async (formData) => {
    try {
      toast.info(editingProduct ? "Updating product..." : "Adding product...");
      let imageUrl = editingProduct ? editingProduct.image : "";

      if (formData.image) {
        const file = formData.image;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("products")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("products")
          .getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }

      if (editingProduct) {
        // Update existing product
        const { data: updatedProduct, error: updateError } = await supabase
          .from("products")
          .update({
            name: formData.name,
            category: formData.category,
            brand: formData.brand,
            price: parseFloat(formData.price),
            stock: parseInt(formData.stock),
            status: formData.status,
            short_description: formData.shortDescription,
            sizes: formData.sizes,
            gender: formData.gender,
            type: formData.type,
            image: imageUrl,
          })
          .eq("id", editingProduct.id)
          .select()
          .single();

        if (updateError) throw updateError;

        const updatedProducts = products.map((p) =>
          p.id === editingProduct.id ? updatedProduct : p
        );
        setProducts(updatedProducts);
        calculateStats(updatedProducts, orders);
        toast.success("Product updated successfully!");
      } else {
        // Insert new product
        const { data: newProduct, error: insertError } = await supabase
          .from("products")
          .insert([
            {
              name: formData.name,
              category: formData.category,
              brand: formData.brand,
              price: parseFloat(formData.price),
              stock: parseInt(formData.stock),
              status: formData.status,
              short_description: formData.shortDescription,
              sizes: formData.sizes,
              gender: formData.gender,
              type: formData.type,
              image: imageUrl,
            },
          ])
          .select()
          .single();

        if (insertError) throw insertError;

        const updatedProducts = [newProduct, ...products];
        setProducts(updatedProducts);
        calculateStats(updatedProducts, orders);
        toast.success("Product added successfully!");
      }

      setIsAddModalOpen(false);
      setEditingProduct(null);
      return true;
    } catch (error) {
      console.error("Error saving product:", error);
      toast.error("Failed to save product: " + error.message);
      return false;
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;

      const updatedProducts = products.filter((p) => p.id !== id);
      setProducts(updatedProducts);
      calculateStats(updatedProducts, orders);
      toast.success("Product deleted");
    } catch (error) {
      console.error("Error deleting product:", error);
      toast.error("Failed to delete product");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingProduct(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "In Stock":
        return "bg-green-100 text-green-800";
      case "Low Stock":
        return "bg-yellow-100 text-yellow-800";
      case "Out of Stock":
        return "bg-red-100 text-red-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Shipped":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="h-screen relative bg-gray-50 overflow-y-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Manage your shoe store inventory and orders
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
              Settings
            </button>
            <button
              onClick={() => {
                setEditingProduct(null);
                setIsAddModalOpen(true);
              }}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center gap-2 cursor-pointer"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="px-6">
          <nav className="flex gap-8">
            {["overview", "products", "orders", "customers"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize transition-colors ${
                  activeTab === tab
                    ? "border-blue-600 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "overview" && (
          <div className="space-y-6">
            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {stats.map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="bg-white rounded-lg shadow-sm p-6"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">
                        {stat.label}
                      </p>
                      <p className="text-2xl font-bold text-gray-900 mt-2">
                        {stat.label === "Revenue"
                          ? formatCurrency(stat.value)
                          : stat.value}
                      </p>
                      <p className="text-sm text-green-600 mt-1">
                        {stat.change} from last month
                      </p>
                    </div>
                    <div className="bg-black p-3 rounded-lg">
                      <stat.icon className="text-white" size={24} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">
                  Recent Orders
                </h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Product
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.length === 0 ? (
                      <tr>
                        <td
                          colSpan="5"
                          className="px-6 py-4 text-center text-gray-500"
                        >
                          No orders found.
                        </td>
                      </tr>
                    ) : (
                      orders.slice(0, 5).map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {order.customer_name ||
                              order.customer_email ||
                              "Guest"}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {/* Assuming items is a JSON array or we just show count */}
                            {Array.isArray(order.items)
                              ? `${order.items.length} items`
                              : "Order"}
                          </td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-900">
                            {formatCurrency(order.amount)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                                order.status
                              )}`}
                            >
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === "products" && (
          <div className="space-y-6">
            {/* Search / Filter */}
            <div className="bg-white rounded-lg shadow-sm p-4">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center gap-2">
                  <Filter size={18} />
                  Filter
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Category
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td
                        colSpan="6"
                        className="px-6 py-8 text-center text-gray-500"
                      >
                        No products found.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 flex items-center gap-3">
                          <div className="h-12 w-12 rounded-lg bg-gray-100 overflow-hidden flex items-center justify-center border">
                            {p.image ? (
                              <img
                                src={p.image}
                                alt={p.name}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span className="text-2xl">👟</span>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">
                              {p.name}
                            </p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {p.category}
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(p.price)}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {p.stock}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                              p.status
                            )}`}
                          >
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-3 text-gray-500">
                          <button className="hover:text-blue-600" title="View">
                            <Eye size={18} />
                          </button>
                          <button
                            className="hover:text-green-600"
                            title="Edit"
                            onClick={() => openEditModal(p)}
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            className="hover:text-red-600"
                            title="Delete"
                            onClick={() => handleDeleteProduct(p.id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "customers" && (
          <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Orders
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Total Spent
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {/* Logic to deduce customers from orders */}
                {Array.from(
                  new Set(
                    orders.map((o) => o.customer_email || o.customer_name)
                  )
                ).map((customerIdentifier, idx) => {
                  const customerOrders = orders.filter(
                    (o) =>
                      o.customer_email === customerIdentifier ||
                      o.customer_name === customerIdentifier
                  );
                  const totalSpent = customerOrders.reduce(
                    (sum, o) => sum + (Number(o.amount) || 0),
                    0
                  );
                  const customerName =
                    customerOrders[0]?.customer_name || "Guest";
                  const customerEmail =
                    customerOrders[0]?.customer_email || "N/A";

                  return (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {customerName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customerEmail}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {customerOrders.length}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {formatCurrency(totalSpent)}
                      </td>
                    </tr>
                  );
                })}
                {orders.length === 0 && (
                  <tr>
                    <td
                      colSpan="4"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No customers found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddProduct}
        initialData={editingProduct}
      />
    </div>
  );
}
