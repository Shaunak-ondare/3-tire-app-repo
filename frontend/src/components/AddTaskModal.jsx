import { useState, useEffect } from "react";

const PRIORITIES = ["low", "medium", "high"];
const CATEGORIES = ["General", "Work", "Personal", "Shopping", "Health", "Finance", "Study"];

const EMPTY_FORM = {
  title: "",
  description: "",
  priority: "medium",
  category: "General",
  is_completed: false,
};

export default function AddTaskModal({ isOpen, editTodo, onClose, onSave }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editTodo) {
      setForm({
        title: editTodo.title || "",
        description: editTodo.description || "",
        priority: editTodo.priority || "medium",
        category: editTodo.category || "General",
        is_completed: editTodo.is_completed || false,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editTodo, isOpen]);

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (form.title.length > 200) e.title = "Max 200 characters.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSaving(true);
    try {
      await onSave(form);
      onClose();
    } catch {
      setErrors({ submit: "Failed to save. Please try again." });
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative w-full max-w-lg animate-scale-in">
        <div className="card p-8 border border-white/10 shadow-glow">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-violet-300 to-fuchsia-300 bg-clip-text text-transparent">
              {editTodo ? "Edit Task" : "New Task"}
            </h2>
            <button
              id="modal-close-btn"
              onClick={onClose}
              className="p-2 text-slate-500 hover:text-white hover:bg-white/10 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <form id="task-form" onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Title <span className="text-red-400">*</span>
              </label>
              <input
                id="task-title"
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="What needs to be done?"
                className={`input-field ${errors.title ? "border-red-500" : ""}`}
              />
              {errors.title && <p className="text-red-400 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1.5">
                Description
              </label>
              <textarea
                id="task-description"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Add some details..."
                rows={3}
                className="input-field resize-none"
              />
            </div>

            {/* Priority + Category row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      type="button"
                      id={`priority-${p}`}
                      onClick={() => setForm({ ...form, priority: p })}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all duration-200 border
                        ${form.priority === p
                          ? p === "high"
                            ? "bg-red-500/30 border-red-500 text-red-300"
                            : p === "medium"
                            ? "bg-amber-500/30 border-amber-500 text-amber-300"
                            : "bg-emerald-500/30 border-emerald-500 text-emerald-300"
                          : "bg-white/5 border-white/10 text-slate-500 hover:border-white/20"
                        }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1.5">Category</label>
                <select
                  id="task-category"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="input-field"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c} className="bg-[#13132a]">{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {errors.submit && (
              <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-xl">{errors.submit}</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={onClose} className="btn-ghost flex-1">
                Cancel
              </button>
              <button
                id="task-submit-btn"
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? "Saving..." : editTodo ? "Save Changes" : "Add Task"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
