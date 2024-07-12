import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { sendPasswordResetEmail } from "../lib/api";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const {
    mutate: sendPasswordReset,
    isPending: isLoading,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: sendPasswordResetEmail,
  });

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="container mx-auto max-w-md py-12 px-6 text-center">
        <h2 className="text-3xl mb-8 text-emerald-400 py-5 ">
          Reset your password
        </h2>
        <div className="rounded-lg p-10">
          {isError && (
            <div className="mb-3 text-red-400">
              {error?.message || "An error occurred"}
            </div>
          )}
          <div className="space-y-4">
            {isSuccess ? (
              <div className="flex items-center bg-green-100 text-emerald-500 px-4 py-3 rounded-md">
                Email sent! Check your inbox for further instructions.
              </div>
            ) : (
              <>
                <div className="form-control">
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
                <button
                  className="w-full  py-1.5 text-lg font-medium text-gray-950 bg-gray-200 rounded-md hover:opacity-90 duration-300"
                  disabled={!email}
                  onClick={() => sendPasswordReset(email)}
                >
                  {isLoading ? "Loading..." : "Reset Password"}
                </button>
              </>
            )}
            <p className="text-center text-sm text-gray-500">
              Go back to{" "}
              <Link
                to="/login"
                replace
                className="text-emerald-400 text-pretty tracking-wide font-medium hover:text-opacity-75 duration-200 "
              >
                Sign in
              </Link>
              &nbsp;or&nbsp;
              <Link
                to="/register"
                replace
                className="text-emerald-400 text-pretty tracking-wide font-medium hover:text-opacity-75 duration-200 "
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
