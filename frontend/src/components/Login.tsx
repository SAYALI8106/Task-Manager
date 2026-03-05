import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import Card from "./ui/Card";
import ErrorMessage from "./ui/ErrorMessage";
import Button from "./ui/Button";
import { isAxiosError } from "axios";

type LoginProps = {
  onToggleForm: () => void;
};

const Login = ({ onToggleForm }: LoginProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      await login({ email, password });
    } catch (e: unknown) {
      const defaultError = "Failed to login. Please try again later.";
      if (isAxiosError(e)) {
        setError(e.response?.data.message || defaultError);
      } else {
        setError(defaultError);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center dark:text-white">
          Login to Task Manager
        </h2>

        {error ? <ErrorMessage message={error} /> : null}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium mb-1 dark:text-gray-300"
            >
              Email
            </label>
            <input
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium mb-1 dark:text-gray-300"
            >
              Password
            </label>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              placeholder="**********"
            />
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Logging in..." : "Login"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600 dark:tex-gray-400">
          Don't have an account?{" "}
          <Button onClick={onToggleForm}>Register here</Button>
        </p>
      </Card>
    </div>
  );
};

export default Login;
