import { useRef, FormEvent, useState } from "react";
import { Priority, Task } from "../types";
import Button from "./ui/Button";
import Card from "./ui/Card";

type TaskFormProps = {
  onSubmit: (task: Pick<Task, "name" | "priority">) => void;
};

export const TaskForm = ({ onSubmit }: TaskFormProps) => {
  const [taskName, setTaskName] = useState("");
  const [priority, setPriority] = useState<Priority | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [nameError, setNameError] = useState("");
  const [priorityError, setPriorityError] = useState("");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let hasError = false;

    if (!taskName.trim()) {
      setNameError("Please enter task name");
      hasError = true;
    } else {
      setNameError("");
    }

    if (!priority) {
      setPriorityError("Please select a priority");
      hasError = true;
    } else {
      setPriorityError("");
    }

    if (hasError || priority == null) return;

    onSubmit({ name: taskName, priority });
    setTaskName("");
    setPriority(null);

    inputRef.current?.focus();
  };

  return (
    <Card>
      <h2 className="text-xl font-bold mb-2 text-gray-900 dark:text-gray-100">
        Add New Task
      </h2>

      <form onSubmit={handleSubmit} className="flex gap-2 items-start">
        {/* Task name field */}
        <div className="flex flex-col grow">
          <input
            ref={inputRef}
            name="task-name"
            type="text"
            placeholder="Enter task here..."
            value={taskName}
            onChange={(event) => setTaskName(event.target.value)}
            className=" p-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          />

          {nameError ? (
            <p className="mt-1 text-xs text-red-500">{nameError}</p>
          ) : null}
        </div>

        {/* Priority field */}
        <div className="flex flex-col">
          <select
            name="priority"
            value={priority ?? ""}
            onChange={(event) => setPriority(event.target.value as Priority)}
            className="p-1.5 text-sm border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
          >
            <option value="">Select</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          {priorityError ? (
            <p className="mt-1 text-xs text-red-500">{priorityError}</p>
          ) : null}
        </div>

        {/* Submit button */}
        <Button variant="primary" type="submit">
          Add Task
        </Button>
      </form>
    </Card>
  );
};
