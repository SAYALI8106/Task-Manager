import { useState } from "react";
import { toast } from "react-toastify";

import { Task } from "../types";
import Button from "./ui/Button";
import Badge from "./ui/Badge";

type TaskItemProps = {
  task: Task;
  onDelete: (taskId: number) => void;
  onToggleDone: (taskId: number) => void;
  updateTask: (task: Task) => void;
};

export const TaskItem = ({
  task,
  onDelete,
  onToggleDone,
  updateTask
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);

  const saveEdit = (updatedTask: Task) => {
    updateTask(updatedTask);
    setIsEditing(false);
    toast.success("Task updated successfully!");
  };

  return (
    <div
      className={`
        w-full
        flex
        gap-3
        justify-between
        p-4
        border
        border-gray-300
        dark:border-gray-700
        bg-white
        dark:bg-gray-800
        rounded-lg
        mb-3
        transition-colors
        ${task.done ? "opacity-40" : ""}
      `}
    >
      {isEditing ? (
        <EditTaskItem
          task={task}
          saveEdit={saveEdit}
          cancelEdit={() => setIsEditing(false)}
        />
      ) : (
        <ShowTaskItem
          task={task}
          onToggleDone={onToggleDone}
          startEdit={() => setIsEditing(true)}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

type ShowTaskItemProps = {
  task: Task;
  onToggleDone: (taskId: number) => void;
  onDelete: (taskId: number) => void;
  startEdit: () => void;
};

const ShowTaskItem = ({
  task,
  onToggleDone,
  startEdit,
  onDelete
}: ShowTaskItemProps) => {
  return (
    <>
      <div className="flex min-w-0 flex-col gap-3 break-words">
        <h3
          className={`
            font-semibold
            text-gray-900
            dark:text-gray-100
            ${task.done ? "line-through" : ""}
          `}
        >
          {task.name}
        </h3>
        <Badge priority={task.priority} />
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button variant="toggle" onClick={() => onToggleDone(task.id)}>
          {task.done ? "Undo" : "Done"}
        </Button>

        <Button variant="edit" onClick={startEdit} disabled={task.done}>
          Edit
        </Button>

        <Button variant="delete" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </div>
    </>
  );
};

type EditTaskItemProps = {
  task: Task;
  saveEdit: (task: Task) => void;
  cancelEdit: () => void;
};

const EditTaskItem = ({ task, saveEdit, cancelEdit }: EditTaskItemProps) => {
  const [name, setName] = useState(task.name);
  const [priority, setPriority] = useState<Task["priority"] | null>(
    task.priority
  );

  const handleSave = () => {
    if (name.trim() === "") {
      toast.error("Task name cannot be empty");
      return;
    }

    if (!priority) {
      toast.error("Please select a priority");
      return;
    }

    saveEdit({ ...task, name, priority });
  };

  return (
    <>
      <div className="flex min-w-0 flex-col gap-2">
        <input
          type="text"
          className="w-full p-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          value={name}
          autoFocus
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => (e.key === "Enter" ? handleSave() : null)}
        />

        <select
          className="w-fit p-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500
          "
          value={priority ?? ""}
          onChange={(e) => setPriority(e.target.value as Task["priority"])}
        >
          <option value="">Select</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      <div className="flex items-center justify-center gap-3">
        <Button variant="save" onClick={handleSave}>
          Save
        </Button>

        <Button
          variant="cancel"
          onClick={cancelEdit}
          className="bg-red-500 hover:bg-red-600 text-white"
        >
          Cancel
        </Button>
      </div>
    </>
  );
};
