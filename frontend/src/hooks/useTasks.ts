import { useCallback, useEffect, useState } from "react";
import { Task, FilterValue } from "../types";
import {
  NewTaskData,
  taskApi,
  UpdateTaskData,
  TaskStats,
  GetTasksParams
} from "../services/taskApi";

const useTasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Backend query state
  const [query, setQuery] = useState<GetTasksParams>({
    done: false // default = active tasks
  });

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await taskApi.getAllTasks(query);
      setTasks(response.data);
    } catch {
      setError("Failed to fetch tasks");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [query]);

  // Fetch stats
  const fetchStats = useCallback(async () => {
    try {
      const data = await taskApi.getTaskStats();
      setStats(data);
    } catch {
      setStats(null);
    }
  }, []);

  useEffect(() => {
    fetchTasks();
    fetchStats();
  }, [fetchTasks, fetchStats]);

  const addTask = useCallback(
    async (taskData: NewTaskData) => {
      const newTask = await taskApi.createTask(taskData);
      fetchTasks();
      fetchStats();
      return newTask;
    },
    [fetchTasks, fetchStats]
  );

  const updateTask = useCallback(
    async (id: number, updates: UpdateTaskData) => {
      const updatedTask = await taskApi.updateTask(id, updates);
      fetchTasks();
      fetchStats();
      return updatedTask;
    },
    [fetchTasks, fetchStats]
  );

  const deleteTask = useCallback(
    async (id: number) => {
      await taskApi.deleteTask(id);
      fetchTasks();
      fetchStats();
    },
    [fetchTasks, fetchStats]
  );

  const toggleTask = useCallback(
    async (id: number) => {
      await taskApi.toggleTask(id);
      fetchTasks();
      fetchStats();
    },
    [fetchTasks, fetchStats]
  );

  return {
    tasks,
    stats,
    loading,
    error,
    addTask,
    updateTask,
    deleteTask,
    toggleTask,

    // UI → backend mapping (STRICTLY TYPED)
    setFilter: (filter: FilterValue) =>
      setQuery((q) => {
        if (filter === "all") {
          const { done, ...rest } = q;
          return rest;
        }
        return { ...q, done: filter === "done" };
      }),

    setSearch: (search: string) =>
      setQuery((q) => ({
        ...q,
        q: search.trim() || undefined
      })),

    setSort: (
      sortBy: GetTasksParams["sortBy"],
      order: GetTasksParams["order"]
    ) =>
      setQuery((q) => ({
        ...q,
        sortBy,
        order
      })),

    refetch: fetchTasks
  };
};

export default useTasks;
