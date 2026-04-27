const PRIORITY_CONFIG = {
  high: {
    badge: "badge-high",
    label: "HIGH",
    icon: "🔴",
    border: "border-l-red-500",
    glow: "hover:shadow-[0_0_20px_rgba(239,68,68,0.15)]",
  },
  medium: {
    badge: "badge-medium",
    label: "MED",
    icon: "🟡",
    border: "border-l-amber-400",
    glow: "hover:shadow-[0_0_20px_rgba(245,158,11,0.15)]",
  },
  low: {
    badge: "badge-low",
    label: "LOW",
    icon: "🟢",
    border: "border-l-emerald-400",
    glow: "hover:shadow-[0_0_20px_rgba(52,211,153,0.15)]",
  },
};

export default function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const p = PRIORITY_CONFIG[todo.priority] || PRIORITY_CONFIG.medium;
  const dateStr = new Date(todo.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  return (
    <div
      className={`card border-l-4 ${p.border} ${p.glow}
        flex items-start gap-4 p-5 transition-all duration-300 animate-slide-up
        ${todo.is_completed ? "opacity-50" : "opacity-100"}`}
    >
      {/* Checkbox */}
      <button
        id={`toggle-${todo.id}`}
        onClick={() => onToggle(todo)}
        className={`mt-0.5 flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300
          ${
            todo.is_completed
              ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 border-violet-500"
              : "border-slate-600 hover:border-violet-500"
          }`}
      >
        {todo.is_completed && (
          <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <h3
            className={`font-semibold text-base leading-snug transition-all duration-300
              ${todo.is_completed ? "line-through text-slate-500" : "text-slate-100"}`}
          >
            {todo.title}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            <span className={p.badge}>{p.label}</span>
          </div>
        </div>

        {todo.description && (
          <p className="text-slate-500 text-sm mt-1 line-clamp-2">{todo.description}</p>
        )}

        <div className="flex items-center gap-3 mt-3 flex-wrap">
          <span className="text-xs text-slate-600 bg-white/5 px-2.5 py-1 rounded-full">
            {todo.category}
          </span>
          <span className="text-xs text-slate-600">{dateStr}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-2 flex-shrink-0">
        <button
          id={`edit-${todo.id}`}
          onClick={() => onEdit(todo)}
          className="p-1.5 text-slate-500 hover:text-violet-400 hover:bg-violet-500/10 rounded-lg transition-all duration-200"
          title="Edit"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          id={`delete-${todo.id}`}
          onClick={() => onDelete(todo.id)}
          className="p-1.5 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
          title="Delete"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}
