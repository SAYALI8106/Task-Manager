import { TaskItem } from "./TaskItem";
import { Task } from "../types";

type TaskListProps = {
  tasks: Task[];
  onDelete: (taskId: number) => void;
  onToggleDone: (taskId: number) => void;
  updateTask: (task: Task) => void;
};

export const TaskList = ({
  tasks,
  onDelete,
  onToggleDone,
  updateTask
}: TaskListProps) => {
  return tasks.map((task) => (
    <TaskItem
      key={task.id}
      task={task}
      onDelete={onDelete}
      onToggleDone={onToggleDone}
      updateTask={updateTask}
    />
  ));
};
