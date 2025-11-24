import { useContext, useMemo, useState } from "react";
import Layout from "@/layout/layout";
import { CartContext } from "@/context/Contexts";
import supabase from "@/lib/supabase";
import { toast } from "react-toastify";

const formatNGN = (value) =>
  new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN" }).format(
    value ?? 0
  );

const NIGERIA_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export default function Checkout() {
  const { cart, setCart } = useContext(CartContext);

  // ---------- Address / Contact form ----------
  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address1: "",
    address2: "",
    city: "",
    state: "",
    lga: "",
    landmark: "",
    notes: "",
    paymentMethod: "pay_on_delivery", // or "pay_now"
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  // super-light validation
  const errors = useMemo(() => {
    const e = {};
    if (!form.fullName.trim()) e.fullName = "Full name is required.";
    // Accept +234 or 0 leading; 10-15 digits
    if (!/^\+?\d[\d\s-]{9,14}$/.test(form.phone.trim()))
      e.phone = "Enter a valid phone number.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim()))
      e.email = "Enter a valid email.";
    if (!form.address1.trim()) e.address1 = "Address line is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state.trim()) e.state = "State is required.";
    if (!form.lga.trim()) e.lga = "LGA is required.";
    if (!form.paymentMethod) e.paymentMethod = "Select a payment method.";
    return e;
  }, [form]);

  // ---------- Cart helpers ----------
  // const increaseQty = (id) =>
  //   setCart((prev) =>
  //     prev.map((it) =>
  //       it.id === id ? { ...it, quantity: (it.quantity || 1) + 1 } : it
  //     )
  //   );

  // const decreaseQty = (id) =>
  //   setCart((prev) =>
  //     prev.map((it) =>
  //       it.id === id
  //         ? { ...it, quantity: Math.max(1, (it.quantity || 1) - 1) }
  //         : it
  //     )
  //   );

  const removeItem = (id) =>
    setCart((prev) => prev.filter((it) => it.id !== id));

  const totals = useMemo(() => {
    const subtotal = cart.reduce(
      (sum, item) => sum + (item.price || 0) * (item.quantity || 1),
      0
    );
    const itemCount = cart.reduce((n, item) => n + (item.quantity || 1), 0);
    return { subtotal, total: subtotal, itemCount };
  }, [cart]);

  // ---------- Submit ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (Object.keys(errors).length > 0 || cart.length === 0) {
      toast.error(
        "Please complete required fields and ensure your cart is not empty."
      );
      return;
    }

    try {
      const orderData = {
        customer_name: form.fullName.trim(),
        customer_email: form.email.trim(),
        customer_phone: form.phone.trim(),
        delivery_address: {
          address1: form.address1.trim(),
          address2: form.address2.trim(),
          city: form.city.trim(),
          state: form.state,
          lga: form.lga.trim(),
          landmark: form.landmark.trim(),
          notes: form.notes.trim(),
        },
        payment_method: form.paymentMethod,
        items: cart.map((it) => ({
          id: it.id,
          name: it.name,
          price: it.price,
          quantity: it.quantity || 1,
          size: it.size ?? null,
          image: it.image,
        })),
        amount: totals.total,
        status: "Processing",
      };

      const { error } = await supabase.from("orders").insert([orderData]);

      if (error) throw error;

      toast.success("Order placed successfully!");
      setCart([]);
      setForm({
        fullName: "",
        phone: "",
        email: "",
        address1: "",
        address2: "",
        city: "",
        state: "",
        lga: "",
        landmark: "",
        notes: "",
        paymentMethod: "pay_on_delivery",
      });
      // Optionally redirect to a success page
      // navigate('/order-success');
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("Failed to place order. Please try again.");
    }
  };

  return (
    <Layout noPadding={true}>
      <div className="mx-auto px-12 pb-6">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>

        {cart.length === 0 ? (
          <div className="rounded-2xl border p-10 text-center">
            <p className="text-lg">Your cart is empty.</p>
            <a
              href="/products"
              className="inline-block mt-4 px-5 py-3 rounded-xl bg-black text-white"
            >
              Continue Shopping
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Address & Contact Form */}
            <section className="lg:col-span-2">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-4">
                    Delivery Address
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1" htmlFor="fullName">
                        Full Name
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        value={form.fullName}
                        onChange={handleChange}
                        className={`w-full rounded-xl border px-3 py-2 ${
                          errors.fullName ? "border-red-500" : ""
                        }`}
                        placeholder="e.g., Jeremiah Egemonye"
                      />
                      {errors.fullName && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.fullName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" htmlFor="phone">
                        Phone
                      </label>
                      <input
                        id="phone"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className={`w-full rounded-xl border px-3 py-2 ${
                          errors.phone ? "border-red-500" : ""
                        }`}
                        placeholder="+234 801 234 5678"
                      />
                      {errors.phone && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" htmlFor="email">
                        Email
                      </label>
                      <input
                        id="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full rounded-xl border px-3 py-2 ${
                          errors.email ? "border-red-500" : ""
                        }`}
                        placeholder="you@example.com"
                      />
                      {errors.email && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1" htmlFor="address1">
                        Address Line 1
                      </label>
                      <input
                        id="address1"
                        name="address1"
                        value={form.address1}
                        onChange={handleChange}
                        className={`w-full rounded-xl border px-3 py-2 ${
                          errors.address1 ? "border-red-500" : ""
                        }`}
                        placeholder="House number, street name"
                      />
                      {errors.address1 && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.address1}
                        </p>
                      )}
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1" htmlFor="address2">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        id="address2"
                        name="address2"
                        value={form.address2}
                        onChange={handleChange}
                        className="w-full rounded-xl border px-3 py-2"
                        placeholder="Apartment, suite, floor, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm mb-1" htmlFor="city">
                        City/Town
                      </label>
                      <input
                        id="city"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        className={`w-full rounded-xl border px-3 py-2 ${
                          errors.city ? "border-red-500" : ""
                        }`}
                        placeholder="e.g., Lagos"
                      />
                      {errors.city && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.city}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" htmlFor="state">
                        State
                      </label>
                      <select
                        id="state"
                        name="state"
                        value={form.state}
                        onChange={handleChange}
                        className={`w-full rounded-xl border px-3 py-2 bg-white ${
                          errors.state ? "border-red-500" : ""
                        }`}
                      >
                        <option value="">Select a state</option>
                        {NIGERIA_STATES.map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                      {errors.state && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.state}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" htmlFor="lga">
                        LGA
                      </label>
                      <input
                        id="lga"
                        name="lga"
                        value={form.lga}
                        onChange={handleChange}
                        className={`w-full rounded-xl border px-3 py-2 ${
                          errors.lga ? "border-red-500" : ""
                        }`}
                        placeholder="e.g., Ikeja"
                      />
                      {errors.lga && (
                        <p className="text-xs text-red-600 mt-1">
                          {errors.lga}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm mb-1" htmlFor="landmark">
                        Nearest Landmark (Optional)
                      </label>
                      <input
                        id="landmark"
                        name="landmark"
                        value={form.landmark}
                        onChange={handleChange}
                        className="w-full rounded-xl border px-3 py-2"
                        placeholder="e.g., Opposite XYZ Mall"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1" htmlFor="notes">
                        Delivery Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        value={form.notes}
                        onChange={handleChange}
                        className="w-full rounded-xl border px-3 py-2 min-h-[90px]"
                        placeholder="Gate code, preferred delivery time, etc."
                      />
                    </div>
                  </div>
                </div>

                {/* <div className="border rounded-2xl p-6">
                  <h2 className="text-lg font-semibold mb-4">Payment Method</h2>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pay_now"
                        checked={form.paymentMethod === "pay_now"}
                        onChange={handleChange}
                      />
                      <span>Pay Now (Card/Transfer)</span>
                    </label>
                    <label className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="pay_on_delivery"
                        checked={form.paymentMethod === "pay_on_delivery"}
                        onChange={handleChange}
                      />
                      <span>Pay on Delivery</span>
                    </label>
                    {errors.paymentMethod && (
                      <p className="text-xs text-red-600">{errors.paymentMethod}</p>
                    )}
                  </div>
                </div> */}

                <div className="flex items-center justify-end gap-3">
                  <a href="/cart" className="px-4 py-3 rounded-xl border">
                    Back to Cart
                  </a>
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-black text-white disabled:opacity-50"
                    disabled={
                      cart.length === 0 || Object.keys(errors).length > 0
                    }
                  >
                    Confirm Order
                  </button>
                </div>
              </form>
            </section>

            {/* Order Summary */}
            <aside className="lg:col-span-1">
              <div className="border rounded-2xl p-6 sticky top-6">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>

                <div className="space-y-4">
                  <ul className="space-y-3 overflow-auto pr-1">
                    {cart.map((item) => (
                      <li key={item.id} className="flex items-start gap-3">
                        <img
                          src={item.image || "/placeholder-shoe.jpg"}
                          alt={item.name}
                          className="h-16 w-16 object-cover rounded-xl border"
                        />
                        <div className="flex-1">
                          <div className="flex justify-between gap-4">
                            <div>
                              <p className="font-medium leading-snug">
                                {item.name}
                              </p>
                              <p className="text-xs text-gray-500">
                                {item.size ? `Size: ${item.size} • ` : ""}
                                Unit: {item.quantity}
                              </p>
                            </div>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="text-xs text-red-600 hover:underline"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            {/* <div className="inline-flex items-center border rounded-xl overflow-hidden">
                              <button
                                onClick={() => decreaseQty(item.id)}
                                className="px-3 py-1.5"
                                aria-label="Decrease quantity"
                              >
                                −
                              </button>
                              <span className="px-3 py-1.5 border-x">{item.quantity || 1}</span>
                              <button
                                onClick={() => increaseQty(item.id)}
                                className="px-3 py-1.5"
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div> */}

                            <p className="font-semibold">
                              {formatNGN(
                                (item.price || 0) * (item.quantity || 1)
                              )}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Items ({totals.itemCount})</span>
                      <span>{formatNGN(totals.subtotal)}</span>
                    </div>
                    <hr className="my-2" />
                    <div className="flex justify-between text-base font-semibold">
                      <span>Total</span>
                      <span>{formatNGN(totals.total)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>
    </Layout>
  );
}
