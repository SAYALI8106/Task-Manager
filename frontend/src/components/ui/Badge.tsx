import { Priority } from "../../types";

const PRIORITY_BADGE_CLASS_NAMES = {
  high: "bg-red-50 text-red-500 dark:bg-red-900/20 dark:text-red-400",
  medium:
    "bg-yellow-50 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400",
  low: "bg-green-50 text-green-500 dark:bg-green-900/20 dark:text-green-400"
};

type BadgeProps = {
  priority: Priority;
};

const Badge = ({ priority }: BadgeProps) => (
  <span
    className={`px-2 py-1 rounded text-xs font-bold w-fit transition-colors ${PRIORITY_BADGE_CLASS_NAMES[priority]}`}
  >
    {priority.charAt(0).toUpperCase() + priority.slice(1)}
  </span>
);

export default Badge;
