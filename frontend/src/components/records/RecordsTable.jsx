import { Pencil, Trash2 } from "lucide-react";
import Button from "../ui/Button";
import { formatCurrency, formatDate, sentenceCase } from "../../utils/formatters";

function RecordsTable({ records, canManage, onEdit, onDelete }) {
  return (
    <div className="overflow-hidden rounded-[28px] border border-white/10 bg-slate-950/30">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/10 text-left">
          <thead className="bg-white/5 text-xs uppercase tracking-[0.18em] text-slate-400">
            <tr>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4">Category</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Amount</th>
              <th className="px-5 py-4">Notes</th>
              <th className="px-5 py-4">Owner</th>
              {canManage ? <th className="px-5 py-4 text-right">Actions</th> : null}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {records.map((record) => (
              <tr key={record._id} className="text-sm text-slate-200">
                <td className="px-5 py-4">{formatDate(record.date)}</td>
                <td className="px-5 py-4">{record.category}</td>
                <td className="px-5 py-4">{sentenceCase(record.type)}</td>
                <td className="px-5 py-4 font-medium text-white">{formatCurrency(record.amount)}</td>
                <td className="max-w-xs px-5 py-4 text-slate-400">{record.notes || "No notes"}</td>
                <td className="px-5 py-4">{record.user?.name || "System"}</td>
                {canManage ? (
                  <td className="px-5 py-4">
                    <div className="flex justify-end gap-2">
                      <Button variant="secondary" className="px-3 py-2" onClick={() => onEdit(record)}>
                        <Pencil size={14} />
                      </Button>
                      <Button variant="danger" className="px-3 py-2" onClick={() => onDelete(record)}>
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </td>
                ) : null}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecordsTable;
