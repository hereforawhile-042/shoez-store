import Layout from "@/layout/layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import supabase from "../../lib/supabase";
import { Eye, EyeOff, Mail, LockKeyhole, User2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router";
import { NavLink } from "react-router";
import Image from "../../assets/images/photo-1560769629-975ec94e6a86.avif";
import { toast } from "react-toastify";

const fadeIn = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Register() {
  const [showPwd, setShowPwd] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors] = useState({});
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const signUp = async (email, password, name) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
          },
        },
      });
      if (error) throw error;
      toast.success("Account created! Please check your email to verify.");
      // navigate('/login'); // Optional: redirect to login
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      toast.error("Please fill in all fields");
      return;
    }
    signUp(email, password, name);
  };

  return (
    <Layout noPadding={true}>
      <div className="relative w-full overflow-hidden bg-linear-to-b from-slate-50 via-white to-slate-50">
        <main className="mx-auto grid w-full max-w-5xl grid-cols-1 items-stretch gap-0 px-4 py-10 md:grid-cols-2 md:py-12">
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
            className="order-2 hidden h-11/12 w-full select-none md:order-1 md:block"
          >
            <div className="relative h-full w-full rounded-2xl overflow-hidden">
              <NavLink
                to="/"
                className="absolute text-3xl mt-6 ml-4 font-extrabold uppercase text-black"
              >
                Shoez<span className="text-red-600">.</span>
              </NavLink>
              <img
                src={Image}
                alt="Running shoes on display"
                className="h-full w-full object-cover"
                loading="eager"
              />
              <div className="absolute" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-white/90">
                <p className="text-sm md:text-base">
                  Join the club. Track orders. Checkout faster.
                </p>
              </div>
            </div>
          </motion.aside>
          <motion.section
            variants={stagger}
            initial="hidden"
            animate="show"
            className="order-1 h-11/12 w-full md:order-2"
          >
            <motion.div
              variants={fadeIn}
              className="relative flex h-full flex-col bg-white rounded-2xl p-6 md:p-8"
            >
              <motion.header variants={fadeIn} className="mb-6 space-y-2">
                <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">
                  Create account
                </h1>
                <p className="text-sm text-muted-foreground">
                  Join the store to track orders and checkout faster.
                </p>
              </motion.header>

              <motion.form
                variants={stagger}
                onSubmit={onSubmit}
                className="space-y-4"
                noValidate
              >
                <motion.div variants={fadeIn} className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <User2 className="h-4 w-4 text-slate-400" />
                    </span>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      placeholder="Enter Name"
                      className="pl-9"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  {errors.name && (
                    <p id="name-error" className="text-xs text-red-600">
                      {errors.name}
                    </p>
                  )}
                </motion.div>
                <motion.div variants={fadeIn} className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <Mail className="h-4 w-4 text-slate-400" />
                    </span>
                    <Input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9"
                      placeholder="Enter email here"
                    />
                  </div>
                  {errors.email && (
                    <p id="email-error" className="text-xs text-red-600">
                      {errors.email}
                    </p>
                  )}
                </motion.div>
                <motion.div variants={fadeIn} className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <LockKeyhole className="h-4 w-4 text-slate-400" />
                    </span>
                    <Input
                      id="password"
                      name="password"
                      type={showPwd ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10 pl-9"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPwd((s) => !s)}
                      className="absolute inset-y-0 right-2 inline-flex items-center rounded-full p-2 text-slate-500 hover:bg-slate-100"
                      aria-label={showPwd ? "Hide password" : "Show password"}
                    >
                      {showPwd ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    {errors.password ? (
                      <p id="password-error" className="text-xs text-red-600">
                        {errors.password}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-500">
                        Use 8+ characters with letters & numbers
                      </p>
                    )}
                  </div>
                </motion.div>
                <motion.div variants={fadeIn} className="space-y-2">
                  <Label htmlFor="confirm">Confirm password</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                      <LockKeyhole className="h-4 w-4 text-slate-400" />
                    </span>
                    <Input
                      id="confirm"
                      name="confirm"
                      type={showConfirm ? "text" : "password"}
                      placeholder="••••••••"
                      className="pr-10 pl-9"
                      aria-invalid={!!errors.confirm}
                      aria-describedby={
                        errors.confirm ? "confirm-error" : undefined
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((s) => !s)}
                      className="absolute inset-y-0 right-2 inline-flex items-center rounded-full p-2 text-slate-500 hover:bg-slate-100"
                      aria-label={
                        showConfirm
                          ? "Hide confirm password"
                          : "Show confirm password"
                      }
                    >
                      {showConfirm ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {errors.confirm && (
                    <p id="confirm-error" className="text-xs text-red-600">
                      {errors.confirm}
                    </p>
                  )}
                </motion.div>

                {/* Submit */}
                <motion.div variants={fadeIn} className="mt-2">
                  <Button
                    type="submit"
                    className="w-full py-5 text-base cursor-pointer"
                    disabled={loading}
                  >
                    {loading ? "Creating account…" : "Create account"}
                  </Button>
                </motion.div>

                {/* Footer */}
                <motion.p
                  variants={fadeIn}
                  className="text-center text-sm text-muted-foreground"
                >
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 underline-offset-4 hover:underline"
                  >
                    Sign in
                  </Link>
                </motion.p>
              </motion.form>
            </motion.div>
          </motion.section>
        </main>
      </div>
    </Layout>
  );
}
