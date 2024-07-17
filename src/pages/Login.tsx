import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { login } from "../lib/api";

const Login: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const redirectUrl = location.state?.redirectUrl || "/";

  const {
    mutate: signIn,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      navigate(redirectUrl, {
        replace: true,
      });
    },
  });

  interface ErrorObject {
    message: string;
  }

  interface ErrorResponse {
    status: number;
    message: string;
    errors: ErrorObject[];
  }



  return (
    <div>
      {isError && (
        <div className="mb-4 text-red-500 text-center">
          {error instanceof Error ? (
            <div>{error.message}</div>
          ) : Array.isArray((error as unknown as ErrorResponse)?.errors) ? (
            (error as unknown as ErrorResponse).errors.map(
              ({ message }, index) => <div key={index}>{message}</div>
            )
          ) : (
            (error as unknown as ErrorResponse)?.message
          )}
        </div>
      )}

      <form
        className="space-y-6 group"
        onSubmit={(e) => {
          e.preventDefault();
          signIn({ email, password });
        }}
      >
        <div className="">
          <input
            type="email"
            autoFocus
            id="email"
            className="input w-full p-2 text-md rounded-md   border border-[#242424] placeholder:text-gray-200 text-gray-200    tracking-wider font-roboto focus:outline-none focus:ring-0  focus:ring-blue-500 focus:shadow-[0_0_5px_rgba(10,140,121,0.5)] transition-shadow duration-400 ease-in-out hover:shadow-[0_0_2px_rgba(10,140,121,0.5)]"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="">
          <input
            type="password"
            id="password"
            className="input w-full p-2 text-md rounded-md  border border-[#242424] placeholder:text-gray-200 text-gray-200    tracking-wider font-roboto focus:outline-none focus:ring-0 focus:ring-blue-500 focus:shadow-[0_0_5px_rgba(10,140,121,0.5)] transition-shadow duration-400 ease-in-out hover:shadow-[0_0_2px_rgba(10,140,121,0.5)]"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <p className="mt-1 text-right">
            <Link
              to="/password/forgot"
              className="text-emerald-400 text-pretty tracking-wide font-medium hover:text-opacity-75 duration-200 "
            >
              Forgot Password?
            </Link>
          </p>
        </div>

        <button
          type="submit"
          className="w-full py-1.5 text-lg font-medium text-gray-950 bg-gray-200 rounded-md    hover:opacity-90 duration-300"
          disabled={!email || password.length < 6}
        >
          {isPending ? (
            <div className="flex items-center justify-center">Logging in</div>
          ) : (
            "Log in"
          )}
        </button>
      </form>
      <p className="mt-4 text-center text-pretty tracking-wide text-gray-300">
        Don't have an account?{" "}
        <Link
          to="/register"
          className="text-emerald-400 text-pretty tracking-wide font-medium hover:text-opacity-75 duration-200 "
        >
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;
