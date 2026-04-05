import { useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { authApi } from "../services/api";
import { sentenceCase } from "../utils/formatters";

function ProfilePage() {
  const { user, logout } = useAuth();
  const { pushToast } = useToast();
  const [form, setForm] = useState({ currentPassword: "", newPassword: "" });
  const [loading, setLoading] = useState(false);

  const updatePassword = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await authApi.updatePassword(form);
      setForm({ currentPassword: "", newPassword: "" });
      pushToast({ type: "success", title: "Password updated", message: "Your password was changed successfully." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid gap-4 xl:grid-cols-[0.9fr_1.1fr]">
      <section className="panel rounded-[28px] p-5">
        <p className="text-sm text-slate-400">Account overview</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">{user.name}</h3>
        <div className="mt-6 space-y-4 text-sm">
          <div className="rounded-2xl bg-white/5 px-4 py-4">
            <p className="text-slate-400">Email</p>
            <p className="mt-1 text-white">{user.email}</p>
          </div>
          <div className="rounded-2xl bg-white/5 px-4 py-4">
            <p className="text-slate-400">Role</p>
            <p className="mt-1 text-white">{sentenceCase(user.role)}</p>
          </div>
          <div className="rounded-2xl bg-white/5 px-4 py-4">
            <p className="text-slate-400">Session</p>
            <p className="mt-1 text-white">Stored locally via JWT</p>
          </div>
        </div>
        <Button variant="secondary" className="mt-6 w-full" onClick={() => logout("You signed out of the finance dashboard.")}>
          Logout
        </Button>
      </section>

      <section className="panel rounded-[28px] p-5">
        <p className="text-sm text-slate-400">Security</p>
        <h3 className="mt-2 text-2xl font-semibold text-white">Update password</h3>
        <form className="mt-6 grid gap-4" onSubmit={updatePassword}>
          <label className="grid gap-2 text-sm text-slate-300">
            Current password
            <Input
              type="password"
              value={form.currentPassword}
              onChange={(event) => setForm((current) => ({ ...current, currentPassword: event.target.value }))}
              required
            />
          </label>
          <label className="grid gap-2 text-sm text-slate-300">
            New password
            <Input
              type="password"
              value={form.newPassword}
              onChange={(event) => setForm((current) => ({ ...current, newPassword: event.target.value }))}
              required
            />
          </label>
          <div className="flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update password"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default ProfilePage;
