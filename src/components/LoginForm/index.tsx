import { PasswordInput, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";
import { useForm } from "@mantine/form";

const passwordMinLength = 6;

interface LoginFormProps {
  onLogin: (username: string, password: string) => void;
  onRegister: (username: string, password: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onRegister }) => {
  const [isLogin, setIsLogin] = useState(true);

  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      username: "",
      password: "",
    },
    validate: {
      username: (value) => (value !== "" ? null : "Invalid username"),
      password: (value) =>
        !isLogin && value.length < passwordMinLength
          ? `Password must be at least ${passwordMinLength} characters long`
          : null,
    },
  });

  const handleSubmit = (values: { username: string; password: string }) => {
    const { username, password } = values;
    if (isLogin) {
      onLogin(username, password);
    } else {
      onRegister(username, password);
    }
  };

  return (
    <form
      className="mx-auto max-w-md rounded-lg border-4 border-gray-700 bg-white p-6"
      onSubmit={form.onSubmit(handleSubmit)}
    >
      <h2 className="mb-6 text-2xl font-bold">
        {isLogin ? "Login" : "Register"}
      </h2>
      <div className="mb-4">
        <TextInput
          id="username"
          label="Username"
          required
          {...form.getInputProps("username")}
        />
      </div>
      <div className="mb-6">
        <PasswordInput
          id="password"
          label="Password"
          required
          {...form.getInputProps("password")}
        />
      </div>
      <button
        type="submit"
        className="rounded bg-blue-500 px-4 py-2 text-white transition-all hover:bg-blue-600"
      >
        {isLogin ? "Login" : "Register"}
      </button>
      <p className="mt-4">
        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
        <button
          type="button"
          className="text-blue-500 transition-all hover:text-blue-700"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Register" : "Login"}
        </button>
      </p>
    </form>
  );
};

export default LoginForm;
