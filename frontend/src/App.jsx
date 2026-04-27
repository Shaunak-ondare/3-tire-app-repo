import { useState, useEffect, useCallback } from "react";
import Header from "./components/Header";
import FilterBar from "./components/FilterBar";
import TodoList from "./components/TodoList";
import AddTaskModal from "./components/AddTaskModal";
import { getTodos, getStats, createTodo, updateTodo, deleteTodo } from "./services/api";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, active: 0 });
  const [filter, setFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editTodo, setEditTodo] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [todosRes, statsRes] = await Promise.all([
        getTodos(filter === "all" ? null : filter),
        getStats(),
      ]);
      setTodos(todosRes.data);
      setStats(statsRes.data);
    } catch (err) {
      setError("Failed to connect to the backend. Make sure Flask is running on port 5000.");
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleToggle = async (todo) => {
    try {
      await updateTodo(todo.id, { is_completed: !todo.is_completed });
      fetchData();
    } catch { }
  };

  const handleSave = async (form) => {
    if (editTodo) {
      await updateTodo(editTodo.id, form);
    } else {
      await createTodo(form);
    }
    fetchData();
  };

  const handleDelete = async (id) => {
    try {
      await deleteTodo(id);
      fetchData();
    } catch { }
  };

  const handleEdit = (todo) => {
    setEditTodo(todo);
    setModalOpen(true);
  };

  const handleAddClick = () => {
    setEditTodo(null);
    setModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-navy-900" style={{ background: "radial-gradient(ellipse at top, #13132a 0%, #0b0b18 60%)" }}>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <Header stats={stats} onAddClick={handleAddClick} />

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-400 text-sm flex items-center gap-3 animate-fade-in">
            <span className="text-lg">⚠️</span>
            {error}
          </div>
        )}

        <FilterBar activeFilter={filter} onFilterChange={setFilter} />

        <TodoList
          todos={todos}
          loading={loading}
          onToggle={handleToggle}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      <AddTaskModal
        isOpen={modalOpen}
        editTodo={editTodo}
        onClose={() => { setModalOpen(false); setEditTodo(null); }}
        onSave={handleSave}
      />
    </div>
  );
}
