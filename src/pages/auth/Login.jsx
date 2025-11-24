import Layout from "@/layout/layout";
import { Button } from "@/components/ui/button";
import supabase from "../../lib/supabase";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "react-toastify";

const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const signIn = async (email, password) => {
    try {
      setLoading(true);
      let { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        throw error;
      }
      toast.success(`welcome ${data.user.user_metadata.full_name}`)
    } catch (error) {
      toast.warn(error.message);
      setLoading(false);
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = (e) => {
    e.preventDefault();
    signIn(email, password);
  };

  return (
    <Layout>
      <main className="mx-auto max-w-md px-4 py-12">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back! Please enter your details.
        </p>

        <form onSubmit={onSubmit} className="mt-8 space-y-4" noValidate>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder="you@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" name="password" type="password" placeholder="••••••••" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>

          <div className="flex items-center justify-between text-sm">
            <a href="/forgot-password" className="underline underline-offset-4 text-muted-foreground">
              Forgot password?
            </a>
          </div>

          <Button type="submit" className={`w-full ${loading ? "opacity-15" : "opacity-100"}`} disabled={loading==true} >{loading ? "signing in.." : "Sign in"}</Button>

          <p className="text-center text-sm text-muted-foreground">
            Don’t have an account?{" "}
            <a href="/register" className="underline underline-offset-4">Create one</a>
          </p>
        </form>
      </main>
    </Layout>
  );
};

export default Login;
