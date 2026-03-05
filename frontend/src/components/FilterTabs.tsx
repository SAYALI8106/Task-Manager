import { FilterValue } from "../types";
import Button from "./ui/Button";

type FilterTabsProps = {
  value: FilterValue;
  onChange: (value: FilterValue) => void;
  tabs: { label: string; value: FilterValue }[];
};

export const FilterTabs = ({ value, onChange, tabs }: FilterTabsProps) => {
  return (
    <div className="flex gap-3">
      {tabs.map((tab) => {
        const isActive = value === tab.value;

        return (
          <Button
            key={tab.value}
            variant="tab"
            type="button"
            onClick={() => onChange(tab.value)}
            className={`p-2 rounded-xl text-sm font-medium transition-colors
              ${
                isActive
                  ? "bg-sky-500 text-white"
                  : "bg-gray-200 text-blue-500 hover:bg-gray-300"
              }
              dark:${
                isActive
                  ? "bg-sky-600 text-white"
                  : "bg-gray-700 text-sky-400 hover:bg-gray-600"
              }
            `}
          >
            {tab.label}
          </Button>
        );
      })}
    </div>
  );
};
