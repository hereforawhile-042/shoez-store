import { useState, useEffect, useContext } from "react";
import Layout from "../layout/layout";
import supabase from "../lib/supabase";
import { CartContext } from "@/context/Contexts";
import {
  Package,
  User,
  LogOut,
  ShoppingBag,
  MapPin,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("orders");
  const { formatCurrency } = useContext(CartContext);
  const navigate = useNavigate();

  const getUser = async () => {
    try {
      const { data } = await supabase.auth.getUser();
      const currentUser = data.user;
      setUser(currentUser);

      if (currentUser) {
        fetchOrders(currentUser.email);
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async (email) => {
    try {
      // Fetch orders where customer_email matches
      // Note: In a real app, you might link by user_id if available in orders table
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("customer_email", email)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/login";
  };

  useEffect(() => {
    getUser();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  const isGuest = !user;
  const displayName = isGuest
    ? "Guest User"
    : user?.user_metadata?.full_name || "User";
  const email = isGuest ? "guest@example.com" : user.email;

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Processing":
        return "bg-blue-100 text-blue-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Layout noPadding={true}>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-sm p-6 sticky top-24">
                <div className="flex flex-col items-center text-center mb-8">
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4 text-3xl font-bold text-gray-500 uppercase">
                    {displayName.charAt(0)}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {displayName}
                  </h2>
                  <p className="text-sm text-gray-500">{email}</p>
                </div>

                <nav className="space-y-2">
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === "orders"
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <ShoppingBag size={20} />
                    <span>My Orders</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                      activeTab === "profile"
                        ? "bg-black text-white"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    <User size={20} />
                    <span>Profile Settings</span>
                  </button>
                  {/* Placeholder for future features */}
                  <button
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 cursor-not-allowed"
                    disabled
                  >
                    <MapPin size={20} />
                    <span>Addresses (Coming Soon)</span>
                  </button>

                  <div className="pt-4 mt-4 border-t border-gray-100">
                    {isGuest ? (
                      <Button
                        onClick={() => navigate("/login")}
                        className="w-full flex items-center justify-center gap-2"
                      >
                        <User size={18} /> Sign In
                      </Button>
                    ) : (
                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut size={20} />
                        <span>Sign Out</span>
                      </button>
                    )}
                  </div>
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-sm min-h-[500px] p-8"
              >
                {activeTab === "orders" && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Order History
                    </h3>
                    {orders.length === 0 ? (
                      <div className="text-center py-20">
                        <Package className="mx-auto h-16 w-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900">
                          No orders yet
                        </h3>
                        <p className="text-gray-500 mb-6">
                          Start shopping to see your orders here.
                        </p>
                        <Button onClick={() => navigate("/products")}>
                          Start Shopping
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {orders.map((order) => (
                          <div
                            key={order.id}
                            className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-shadow"
                          >
                            <div className="bg-gray-50 px-6 py-4 flex flex-wrap items-center justify-between gap-4">
                              <div className="flex gap-8">
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-medium">
                                    Order Placed
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {new Date(
                                      order.created_at
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-500 uppercase font-medium">
                                    Total Amount
                                  </p>
                                  <p className="text-sm font-medium text-gray-900">
                                    {formatCurrency(order.amount)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4">
                                <span
                                  className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                    order.status
                                  )}`}
                                >
                                  {order.status}
                                </span>
                                <p className="text-xs text-gray-500">
                                  #{order.id.slice(0, 8)}
                                </p>
                              </div>
                            </div>
                            <div className="px-6 py-6">
                              <div className="flex items-center gap-4">
                                <div className="h-16 w-16 bg-gray-100 rounded-lg flex items-center justify-center">
                                  <ShoppingBag className="text-gray-400" />
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {Array.isArray(order.items)
                                      ? `${order.items.length} Items`
                                      : "Order Details"}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">
                                    {Array.isArray(order.items)
                                      ? order.items
                                          .map((i) => i.name)
                                          .join(", ")
                                          .slice(0, 50) +
                                        (order.items.length > 1 ? "..." : "")
                                      : "View details for more info"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "profile" && (
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-6">
                      Profile Settings
                    </h3>
                    <div className="max-w-xl space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            value={displayName}
                            disabled
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email Address
                          </label>
                          <input
                            type="email"
                            value={email}
                            disabled
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            User ID
                          </label>
                          <input
                            type="text"
                            value={user?.id || "N/A"}
                            disabled
                            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-200 text-gray-500 cursor-not-allowed"
                          />
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg text-sm text-blue-700">
                        To update your profile details, please contact support.
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export { Profile };
