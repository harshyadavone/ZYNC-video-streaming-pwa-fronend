import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { RegisterInput } from "../lib/api";
import API from "../config/apiClient";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const {
    mutate: createAccount,
    isPending = true,
    isError,
    error,
  } = useMutation<void, Error, RegisterInput>({
    mutationFn: async (data: RegisterInput) => API.post("/auth/register", data),

    onSuccess: () => {
      navigate("/login", {
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
        className="space-y-3 group"
        onSubmit={(e) => {
          e.preventDefault();
          createAccount({ email, password, confirmPassword });
        }}
      >
        <div className="">
          <div className="text-gray-300  font-semibold pb-1">Email</div>
          <input
            type="email"
            id="email"
            className="input w-full p-2 text-md rounded-md   border border-[#242424] placeholder:text-gray-200 text-gray-200    tracking-wider font-roboto focus:outline-none focus:ring-0  focus:ring-blue-500 focus:shadow-[0_0_5px_rgba(10,140,121,0.5)] transition-shadow duration-400 ease-in-out hover:shadow-[0_0_2px_rgba(10,140,121,0.5)]"
            // placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoFocus
          />
        </div>
        <div className="">
          <div className="text-gray-300  font-semibold pb-1">Password</div>
          <input
            type="password"
            id="password"
            className="input w-full p-2 text-md rounded-md  border border-[#242424] placeholder:text-gray-200 text-gray-200    tracking-wider font-roboto focus:outline-none focus:ring-0 focus:ring-blue-500 focus:shadow-[0_0_5px_rgba(10,140,121,0.5)] transition-shadow duration-400 ease-in-out hover:shadow-[0_0_2px_rgba(10,140,121,0.5)]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="pb-4">
          <div className="text-gray-300  font-semibold pb-1">
            Confirm Password
          </div>
          <input
            type="password"
            id="confirmPassword"
            className="input w-full p-2 text-md rounded-md  border border-[#242424] placeholder:text-gray-200 text-gray-200    tracking-wider font-roboto focus:outline-none focus:ring-0 focus:ring-blue-500 focus:shadow-[0_0_5px_rgba(10,140,121,0.5)] transition-shadow duration-400 hover:duration-300 hover:ease-in-out ease-in-out  hover:shadow-[0_0_2px_rgba(10,140,121,0.5)]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) =>
              e.key === "Enter" &&
              createAccount({ email, password, confirmPassword })
            }
          />
        </div>
        <button
          type="submit"
          className="w-full  py-1.5 text-lg font-medium text-gray-950 bg-gray-200 rounded-md hover:opacity-90 duration-300"
          disabled={
            !email || password.length < 6 || password !== confirmPassword
          }
        >
          {isPending ? (
            <div className="flex items-center justify-center">
              Creating account...
            </div>
          ) : (
            "Create Account"
          )}
        </button>
      </form>
      <p className="mt-4 text-center text-pretty tracking-wide text-gray-300">
        Already have an account?{" "}
        <Link
          to="/login"
          className="text-emerald-400 text-pretty tracking-wide font-medium hover:text-opacity-75 duration-200 "
        >
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
