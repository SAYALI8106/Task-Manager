import { ButtonHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "edit"
  | "save"
  | "cancel"
  | "delete"
  | "toggle"
  | "tab"
  | "changeMode";

type ButtonProps = {
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const BASE_BUTTON_CLASSES = `px-3 py-1.5 rounded text-sm font-medium transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-900`;

const BUTTON_VARIANT_CLASS_NAMES: Record<ButtonVariant, string> = {
  primary: "bg-sky-500 text-white hover:bg-sky-400 focus:ring-sky-400",
  edit: "bg-indigo-500 text-white hover:bg-indigo-600 focus:ring-indigo-400",
  save: "bg-green-500 text-white hover:bg-green-600 focus:ring-green-400",
  cancel:
    "bg-gray-300 text-gray-900 hover:bg-gray-400 focus:ring-gray-400 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600",
  delete: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  toggle:
    "bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-400",
  tab: "bg-gray-200 text-blue-500 hover:bg-gray-300 focus:ring-blue-400 dark:bg-gray-700 dark:text-sky-400 dark:hover:bg-gray-600",
  changeMode:
    "bg-gray-500 text-white hover:bg-gray-600 dark:bg-gray-600 dark:hover:bg-gray-700 focus:ring-gray-400"
};

const Button = ({
  variant = "primary",
  disabled,
  className = "",
  children,
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${BASE_BUTTON_CLASSES} ${BUTTON_VARIANT_CLASS_NAMES[variant]}${disabled ? "cursor-not-allowed" : "cursor-pointer"} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
