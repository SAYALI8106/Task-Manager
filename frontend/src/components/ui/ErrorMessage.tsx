type ErrorMessageProps = {
  message: string;
};
const ErrorMessage = ({ message }: ErrorMessageProps) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-lg p-4 mb-4">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-red-700 dark:text-red-300">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default ErrorMessage;
