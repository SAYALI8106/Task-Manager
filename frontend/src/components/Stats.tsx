import { TaskStats } from "../services/taskApi";

type StatsProps = {
  stats: TaskStats | null;
};

export const Stats = ({ stats }: StatsProps) => {
  if (!stats) return null;

  const items = [
    { label: "TOTAL", value: stats.total },
    { label: "ACTIVE", value: stats.active },
    { label: "DONE", value: stats.done }
  ];

  return (
    <>
      {items.map(({ label, value }) => (
        <div
          key={label}
          className="bg-white dark:bg-gray-800 w-full flex flex-col justify-center items-center rounded-lg p-4 gap-2 shadow-lg transition-colors"
        >
          <h2 className="text-sky-500 dark:text-sky-400 font-bold text-2xl">
            {value}
          </h2>
          <span className="text-gray-500 dark:text-gray-400 font-bold text-lg">
            {label}
          </span>
        </div>
      ))}
    </>
  );
};
