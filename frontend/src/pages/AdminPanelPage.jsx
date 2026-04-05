import { useEffect, useState } from "react";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Modal from "../components/ui/Modal";
import Select from "../components/ui/Select";
import Skeleton from "../components/ui/Skeleton";
import { useToast } from "../context/ToastContext";
import { usersApi } from "../services/api";
import { formatDate, sentenceCase } from "../utils/formatters";

const createInitialForm = {
  name: "",
  email: "",
  password: "",
  role: "viewer",
};

function AdminPanelPage() {
  const { pushToast } = useToast();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(createInitialForm);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await usersApi.getUsers();
      setUsers(response);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const createUser = async (event) => {
    event.preventDefault();
    setCreating(true);
    try {
      await usersApi.createUser(form);
      pushToast({ type: "success", title: "User created", message: "The account is ready to use." });
      setForm(createInitialForm);
      setOpen(false);
      await loadUsers();
    } finally {
      setCreating(false);
    }
  };

  const updateRole = async (id, role) => {
    await usersApi.updateRole(id, role);
    pushToast({ type: "success", title: "Role updated", message: "User permissions were refreshed." });
    await loadUsers();
  };

  const updateStatus = async (id, isActive) => {
    await usersApi.updateStatus(id, isActive);
    pushToast({ type: "success", title: "Status updated", message: "Account activity state changed." });
    await loadUsers();
  };

  return (
    <div className="grid gap-4">
      <section className="panel rounded-[28px] p-5">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-400">User governance</p>
            <h3 className="text-xl font-semibold text-white">Manage roles and account status</h3>
          </div>
          <Button onClick={() => setOpen(true)}>Append user</Button>
        </div>
      </section>

      {loading ? (
        <Skeleton className="h-[420px]" />
      ) : (
        <section className="panel rounded-[28px] p-5">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-white/10 text-left">
              <thead className="text-xs uppercase tracking-[0.18em] text-slate-400">
                <tr>
                  <th className="px-4 py-4">Name</th>
                  <th className="px-4 py-4">Email</th>
                  <th className="px-4 py-4">Role</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((user) => (
                  <tr key={user._id} className="text-sm text-slate-200">
                    <td className="px-4 py-4 font-medium text-white">{user.name}</td>
                    <td className="px-4 py-4">{user.email}</td>
                    <td className="px-4 py-4">
                      <Select
                        className="max-w-[160px]"
                        value={user.role}
                        onChange={(event) => updateRole(user._id, event.target.value)}
                      >
                        <option value="viewer">Viewer</option>
                        <option value="analyst">Analyst</option>
                        <option value="admin">Admin</option>
                      </Select>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        type="button"
                        onClick={() => updateStatus(user._id, !user.isActive)}
                        className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
                          user.isActive
                            ? "bg-emerald-500/15 text-emerald-200"
                            : "bg-rose-500/15 text-rose-200"
                        }`}
                      >
                        {user.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="px-4 py-4">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <Modal
        open={open}
        title="Create user"
        description="Provision a new platform user with an initial role."
        onClose={() => setOpen(false)}
      >
        <form className="grid gap-4" onSubmit={createUser}>
          <label className="grid gap-2 text-sm text-slate-300">
            Name
            <Input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              required
            />
          </label>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm text-slate-300">
              Email
              <Input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                required
              />
            </label>
            <label className="grid gap-2 text-sm text-slate-300">
              Password
              <Input
                type="password"
                value={form.password}
                onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                required
              />
            </label>
          </div>
          <label className="grid gap-2 text-sm text-slate-300">
            Role
            <Select
              value={form.role}
              onChange={(event) => setForm((current) => ({ ...current, role: event.target.value }))}
            >
              {["viewer", "analyst", "admin"].map((role) => (
                <option key={role} value={role}>
                  {sentenceCase(role)}
                </option>
              ))}
            </Select>
          </label>
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={creating}>
              {creating ? "Creating..." : "Create user"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default AdminPanelPage;
