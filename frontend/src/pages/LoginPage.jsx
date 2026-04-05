import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/app", { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(56,189,248,0.18),_transparent_28%),radial-gradient(circle_at_bottom,_rgba(34,197,94,0.16),_transparent_32%)]" />
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="hidden rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur lg:block">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/70">Pulse Finance</p>
          <h1 className="mt-6 max-w-lg text-5xl font-semibold leading-tight text-white">
            Control analytics, ledger operations, and admin workflows from one secure console.
          </h1>
          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            {[
              "JWT-protected auth flow",
              "Role-based route enforcement",
              "Live records management for admins",
              "Dashboard analytics powered by the backend",
            ].map((item) => (
              <div key={item} className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-slate-200">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="panel panel-strong rounded-[32px] p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Sign In</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Welcome back</h2>
          <p className="mt-3 text-sm text-slate-400">
            Enter your account details to access the finance dashboard.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm text-slate-300">
              Email
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Password
              <Input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
            </label>

            {error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <Button type="submit" disabled={loading} className="mt-2 w-full py-3">
              {loading ? "Signing in..." : "Access dashboard"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Need an account?{" "}
            <Link to="/register" className="font-medium text-emerald-300 hover:text-emerald-200">
              Register here
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default LoginPage;
