import { useEffect, useState } from "react";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Select from "../ui/Select";

const emptyState = {
  amount: "",
  type: "expense",
  category: "",
  date: "",
  notes: "",
};

function RecordForm({ initialValues, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(emptyState);

  useEffect(() => {
    if (initialValues) {
      setForm({
        amount: initialValues.amount ?? "",
        type: initialValues.type ?? "expense",
        category: initialValues.category ?? "",
        date: initialValues.date ? initialValues.date.slice(0, 10) : "",
        notes: initialValues.notes ?? "",
      });
    } else {
      setForm(emptyState);
    }
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const submit = (event) => {
    event.preventDefault();
    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
  };

  return (
    <form className="grid gap-4" onSubmit={submit}>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          Amount
          <Input name="amount" type="number" min="0" step="0.01" value={form.amount} onChange={handleChange} required />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Type
          <Select name="type" value={form.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </Select>
        </label>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <label className="grid gap-2 text-sm text-slate-300">
          Category
          <Input name="category" value={form.category} onChange={handleChange} required />
        </label>
        <label className="grid gap-2 text-sm text-slate-300">
          Date
          <Input name="date" type="date" value={form.date} onChange={handleChange} required />
        </label>
      </div>
      <label className="grid gap-2 text-sm text-slate-300">
        Notes
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={4}
          className="w-full rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60"
        />
      </label>
      <div className="flex justify-end gap-3">
        <Button variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save record"}
        </Button>
      </div>
    </form>
  );
}

export default RecordForm;
