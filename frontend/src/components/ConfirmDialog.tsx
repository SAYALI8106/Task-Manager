import { ReactNode } from "react";

type ConfirmDialogProps = {
  open: boolean;
  title: string;
  message: string;
  children: ReactNode;
};

export const ConfirmDialog = ({
  open,
  title,
  message,
  children
}: ConfirmDialogProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-10">
      <div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 p-6 rounded-lg w-80 text-center shadow-lg transition-colors">
        <h3 className="font-bold text-lg mb-2">{title}</h3>
        <p className="text-sm text-gray-700 dark:text-gray-300">{message}</p>

        <div className="flex justify-between mt-4">{children}</div>
      </div>
    </div>
  );
};
