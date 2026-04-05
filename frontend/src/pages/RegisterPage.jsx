import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    requestedRole: "viewer",
  });
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
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/app", { replace: true });
    } catch (apiError) {
      setError(apiError.response?.data?.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-8">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(34,197,94,0.16),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(56,189,248,0.18),_transparent_32%)]" />
      <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <section className="hidden rounded-[32px] border border-white/10 bg-white/5 p-10 backdrop-blur lg:block">
          <p className="text-sm uppercase tracking-[0.3em] text-emerald-300/70">Create Access</p>
          <h1 className="mt-6 max-w-xl text-5xl font-semibold leading-tight text-white">
            Register a finance workspace account with the exact role-based permissions you need.
          </h1>
          <div className="mt-10 space-y-4">
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-slate-200">
              Viewer: dashboard-only access
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-slate-200">
              Analyst: dashboard plus read-only records
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/40 p-5 text-slate-200">
              Admin: full records and user management
            </div>
          </div>
        </section>

        <section className="panel panel-strong rounded-[32px] p-8 sm:p-10">
          <p className="text-sm uppercase tracking-[0.3em] text-sky-300/70">Register</p>
          <h2 className="mt-4 text-3xl font-semibold text-white">Create your account</h2>
          <p className="mt-3 text-sm text-slate-400">
            Public registration creates a viewer account. If you need analyst or admin access, an existing admin must upgrade your account after signup.
          </p>

          <form className="mt-8 grid gap-5" onSubmit={handleSubmit}>
            <label className="grid gap-2 text-sm text-slate-300">
              Full name
              <Input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Alex Morgan"
                required
              />
            </label>
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
            <div className="grid gap-5 md:grid-cols-2">
              <label className="grid gap-2 text-sm text-slate-300">
                Password
                <Input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create password"
                  required
                />
              </label>
              <label className="grid gap-2 text-sm text-slate-300">
                I want to log in as
                <Select name="requestedRole" value={form.requestedRole} onChange={handleChange}>
                  <option value="viewer">Viewer</option>
                  <option value="analyst">Analyst</option>
                  <option value="admin">Admin</option>
                </Select>
              </label>
            </div>

            {form.requestedRole !== "viewer" ? (
              <div className="rounded-2xl border border-amber-400/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-100">
                Your account will still be created as <strong>viewer</strong>. Ask an admin to change your role to {form.requestedRole} from the Admin Panel.
              </div>
            ) : (
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-100">
                Viewer accounts can sign in immediately after registration and access the dashboard.
              </div>
            )}

            {error ? (
              <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
                {error}
              </div>
            ) : null}

            <Button type="submit" disabled={loading} className="mt-2 w-full py-3">
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>

          <p className="mt-6 text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-emerald-300 hover:text-emerald-200">
              Sign in
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}

export default RegisterPage;
