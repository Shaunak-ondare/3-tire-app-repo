const FILTERS = [
  { key: "all", label: "All Tasks", icon: "◈" },
  { key: "active", label: "Active", icon: "◯" },
  { key: "completed", label: "Completed", icon: "◉" },
];

export default function FilterBar({ activeFilter, onFilterChange }) {
  return (
    <div className="flex items-center gap-2 mb-6 bg-navy-600/50 border border-white/5 rounded-2xl p-1.5 w-fit">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          id={`filter-${f.key}`}
          onClick={() => onFilterChange(f.key)}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
            ${
              activeFilter === f.key
                ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25"
                : "text-slate-400 hover:text-white hover:bg-white/5"
            }`}
        >
          <span className="text-base">{f.icon}</span>
          {f.label}
        </button>
      ))}
    </div>
  );
}
