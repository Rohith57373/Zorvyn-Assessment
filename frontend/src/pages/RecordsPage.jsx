import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Modal from "../components/ui/Modal";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import Select from "../components/ui/Select";
import RecordsTable from "../components/records/RecordsTable";
import RecordForm from "../components/records/RecordForm";
import Skeleton from "../components/ui/Skeleton";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { recordsApi } from "../services/api";

const initialFilters = {
  search: "",
  type: "",
  category: "",
  startDate: "",
  endDate: "",
  page: 1,
  limit: 10,
};

function RecordsPage() {
  const { user } = useAuth();
  const { pushToast } = useToast();
  const [filters, setFilters] = useState(initialFilters);
  const [records, setRecords] = useState([]);
  const [meta, setMeta] = useState({ page: 1, pages: 1, total: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [activeRecord, setActiveRecord] = useState(null);
  const [saving, setSaving] = useState(false);

  const canManage = user.role === "admin";

  const loadRecords = async () => {
    setLoading(true);
    try {
      const response = await recordsApi.getRecords(filters);
      setRecords(response.data);
      setMeta(response.meta);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecords();
  }, [filters.page, filters.type, filters.category, filters.startDate, filters.endDate, filters.search]);

  const updateFilter = (event) => {
    const { name, value } = event.target;
    setFilters((current) => ({ ...current, [name]: value, page: 1 }));
  };

  const submitRecord = async (payload) => {
    setSaving(true);
    try {
      if (activeRecord) {
        await recordsApi.updateRecord(activeRecord._id, payload);
        pushToast({ type: "success", title: "Record updated", message: "Ledger entry saved successfully." });
      } else {
        await recordsApi.createRecord(payload);
        pushToast({ type: "success", title: "Record added", message: "New financial record created." });
      }
      setModalOpen(false);
      setActiveRecord(null);
      await loadRecords();
    } finally {
      setSaving(false);
    }
  };

  const deleteRecord = async (record) => {
    const confirmed = window.confirm(`Delete ${record.category} from the ledger?`);
    if (!confirmed) return;

    await recordsApi.deleteRecord(record._id);
    pushToast({ type: "success", title: "Record deleted", message: "The record was removed from active reporting." });
    await loadRecords();
  };

  return (
    <div className="grid gap-4">
      <section className="panel rounded-[28px] p-5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm text-slate-400">Ledger explorer</p>
            <h3 className="text-xl font-semibold text-white">
              {canManage ? "Manage and audit records" : "Read-only records view"}
            </h3>
          </div>
          {canManage ? (
            <Button onClick={() => setModalOpen(true)} className="gap-2">
              <Plus size={16} />
              Add record
            </Button>
          ) : null}
        </div>

        <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-5">
          <Input name="search" placeholder="Search notes or category" value={filters.search} onChange={updateFilter} />
          <Select name="type" value={filters.type} onChange={updateFilter}>
            <option value="">All types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </Select>
          <Input name="category" placeholder="Category" value={filters.category} onChange={updateFilter} />
          <Input name="startDate" type="date" value={filters.startDate} onChange={updateFilter} />
          <Input name="endDate" type="date" value={filters.endDate} onChange={updateFilter} />
        </div>
      </section>

      {loading ? (
        <Skeleton className="h-[420px]" />
      ) : (
        <>
          <RecordsTable
            records={records}
            canManage={canManage}
            onEdit={(record) => {
              setActiveRecord(record);
              setModalOpen(true);
            }}
            onDelete={deleteRecord}
          />
          <div className="flex items-center justify-between text-sm text-slate-400">
            <span>{meta.total} total records</span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                disabled={meta.page <= 1}
                onClick={() => setFilters((current) => ({ ...current, page: current.page - 1 }))}
              >
                Previous
              </Button>
              <span>
                Page {meta.page} / {meta.pages || 1}
              </span>
              <Button
                variant="secondary"
                disabled={meta.page >= meta.pages}
                onClick={() => setFilters((current) => ({ ...current, page: current.page + 1 }))}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      <Modal
        open={modalOpen}
        title={activeRecord ? "Edit record" : "Create record"}
        description="This form writes directly to the live records API."
        onClose={() => {
          setModalOpen(false);
          setActiveRecord(null);
        }}
      >
        <RecordForm
          initialValues={activeRecord}
          loading={saving}
          onCancel={() => {
            setModalOpen(false);
            setActiveRecord(null);
          }}
          onSubmit={submitRecord}
        />
      </Modal>
    </div>
  );
}

export default RecordsPage;
