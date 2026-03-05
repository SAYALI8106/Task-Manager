import { TaskForm } from "./components/TaskForm";
import { TaskList } from "./components/TaskList";
import { Stats } from "./components/Stats";
import { ConfirmDialog } from "./components/ConfirmDialog";
import { FilterTabs } from "./components/FilterTabs";

import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FilterValue, Task } from "./types";
import Button from "./components/ui/Button";
import Card from "./components/ui/Card";
import useDarkMode from "./hooks/useDarkMode";
import useTasks from "./hooks/useTasks";
import ErrorMessage from "./components/ui/ErrorMessage";
import LoadingSpinner from "./components/ui/LoadingSpinner";
import { User } from "./types";
import { useAuth } from "./contexts/AuthContext";
import Login from "./components/Login";
import Register from "./components/Register";

const CONFETTI_DURATION_IN_SECONDS = 8;

const App = () => {
  const { isDark, toggle } = useDarkMode();
  const { user, logout } = useAuth();
  const [showLogin, setShowLogin] = useState(true);

  if (!user) {
    return showLogin ? (
      <Login onToggleForm={() => setShowLogin(false)} />
    ) : (
      <Register onToggleForm={() => setShowLogin(true)} />
    );
  }

  return (
    <AuthenticatedApp
      user={user}
      logout={logout}
      isDark={isDark}
      toggle={toggle}
    />
  );
};

type AuthenticatedAppProps = {
  user: User;
  logout: () => void;
  isDark: boolean;
  toggle: () => void;
};
const AuthenticatedApp = ({
  user,
  logout,
  isDark,
  toggle
}: AuthenticatedAppProps) => {
  const {
    tasks,
    stats,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,
    setFilter: setBackendFilter,
    setSearch,
    setSort,
    refetch
  } = useTasks();

  const { width, height } = useWindowSize();
  const [showConfetti, setShowConfetti] = useState(false);
  const confettiTimerRef = useRef<number | null>(null);
  const [deleteTaskId, setDeleteTaskId] = useState<Task["id"] | null>(null);
  const [filter, setFilter] = useState<FilterValue>("active");
  const [searchQuery, setSearchQuery] = useState("");
  type PrioritySort = "none" | "desc" | "asc";
  const [prioritySort, setPrioritySort] = useState<PrioritySort>("none");

  useEffect(() => {
    if (!showConfetti) return;

    if (confettiTimerRef.current) {
      clearTimeout(confettiTimerRef.current);
    }

    confettiTimerRef.current = setTimeout(() => {
      setShowConfetti(false);
      confettiTimerRef.current = null;
    }, CONFETTI_DURATION_IN_SECONDS * 1000);

    return () => {
      if (confettiTimerRef.current) {
        clearTimeout(confettiTimerRef.current);
        confettiTimerRef.current = null;
      }
    };
  }, [showConfetti]);

  const handleSubmit = async ({
    name,
    priority
  }: Pick<Task, "name" | "priority">) => {
    if (!name.trim() || !priority.trim()) return;

    await addTask({ name, priority });
    toast.success("Task added successfully!");
  };

  const confirmDelete = async () => {
    if (!deleteTaskId) return;

    await deleteTask(deleteTaskId);
    toast.success("Task deleted successfully");
    setDeleteTaskId(null);
  };
  const onToggleDone = async (taskId: number) => {
    const task = tasks.find((t) => t.id === taskId);

    if (task && !task.done && !showConfetti) {
      setShowConfetti(true);
    }

    await toggleTask(taskId);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col transition-colors">
      {showConfetti && <Confetti width={width} height={height} />}
      <ToastContainer />

      <ConfirmDialog
        open={deleteTaskId !== null}
        title="Confirm Delete"
        message="Are you sure you want to delete this task?"
      >
        <Button variant="delete" onClick={confirmDelete}>
          Yes, Delete
        </Button>
        <Button
          variant="cancel"
          className="bg-emerald-500 hover:bg-emerald-700"
          onClick={() => setDeleteTaskId(null)}
        >
          Cancel
        </Button>
      </ConfirmDialog>

      <header className="bg-gradient-to-r from-sky-500 to-blue-600 dark:from-sky-700 dark:to-blue-800 shadow-lg transition-colors">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-center gap-8">
          <div className="text-center sm:text-left">
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Task Manager
            </h1>
            <p className="text-sm mt-1 text-sky-100">
              Welcome , <span className="font-semibold">{user.name}</span> 👋
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="primary"
              onClick={toggle}
              className="rounded-full w-10 h-10 flex items-center justify-center text-lg hover:scale-110 transition-transform"
              aria-label="Toggle theme"
            >
              {isDark ? "☀️" : "🌙"}
            </Button>

            <Button
              variant="primary"
              onClick={logout}
              className="px-5 py-2 font-semibold hover:bg-red-500 transition-colors"
            >
              Logout
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 min-w-150 mx-auto px-4 my-8 flex flex-col gap-4 sm:max-w-150">
        <TaskForm onSubmit={handleSubmit} />

        <section className="flex gap-4 justify-between">
          <Stats stats={stats} />
        </section>

        <FilterTabs
          value={filter}
          onChange={(value) => {
            setFilter(value);
            setBackendFilter(value);
          }}
          tabs={[
            { label: "Active", value: "active" },
            { label: "Done", value: "done" },
            { label: "All", value: "all" }
          ]}
        />

        <Card>
          <h2 className="text-xl text-gray-900 dark:text-gray-100 font-bold flex gap-2">
            My Tasks {!loading && `(${tasks.length})`}
            <a className="cursor-pointer" onClick={refetch}>
              🔄
            </a>
          </h2>
          <div className="flex items-center justify-center gap-4 p-4">
            <div className="grow">
              <div className="flex items-center gap-2 rounded-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2 text-sm transition focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20">
                <span>🔍</span>
                <input
                  type="text"
                  className="grow outline-0 bg-transparent text-gray-900 dark:text-gray-100"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSearchQuery(value);
                    setSearch(value);
                  }}
                />
                {searchQuery && (
                  <button
                    className="flex items-center justify-center w-5.5 h-5.5 rounded-full bg-gray-200 dark:bg-gray-600 text-xs hover:bg-gray-300 dark:hover:bg-gray-500"
                    onClick={() => {
                      setSearchQuery("");
                      setSearch("");
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setPrioritySort((prev) => {
                  if (prev === "none") {
                    setSort("priority", "desc"); // High → Low
                    return "desc";
                  }

                  if (prev === "desc") {
                    setSort("priority", "asc"); // Low → High
                    return "asc";
                  }

                  // reset to default
                  setSort(undefined, undefined);
                  return "none";
                });
              }}
              className={`ml-3 rounded-md border px-2 py-0.5 text-xs font-medium transition-all
    ${
      prioritySort === "none"
        ? "border-sky-500 text-sky-600 dark:text-sky-400"
        : "bg-sky-500 text-white border-sky-500"
    }
  `}
            >
              Sort by Priority {prioritySort === "desc" && "⬇️"}
              {prioritySort === "asc" && "⬆️"}
            </button>
          </div>

          {loading ? (
            <LoadingSpinner message="Loading tasks..." />
          ) : error ? (
            <ErrorMessage message={error} />
          ) : tasks.length === 0 && searchQuery.trim() !== "" ? (
            <p className="text-sky-500 dark:text-sky-400">
              No tasks match your search.
            </p>
          ) : tasks.length === 0 ? (
            <p className="text-sky-500 dark:text-sky-400">
              No tasks available. Add a task!
            </p>
          ) : (
            <TaskList
              tasks={tasks}
              onDelete={(id) => setDeleteTaskId(id)}
              onToggleDone={onToggleDone}
              updateTask={(task) =>
                updateTask(task.id, {
                  name: task.name,
                  priority: task.priority
                })
              }
            />
          )}
        </Card>
      </main>

      <footer className="text-center bg-[#333] dark:bg-black p-4 text-2xl text-white transition-colors">
        Copyright &copy; {new Date().getFullYear()}. All rights reserved.
      </footer>
    </div>
  );
};

export default App;
