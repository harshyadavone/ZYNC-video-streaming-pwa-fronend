import { useSearchParams, Link } from "react-router-dom";
import ResetPasswordForm from "../components/ResetPasswordForm";

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const exp = Number(searchParams.get("exp"));
  const now = Date.now();
  const linkIsValid = code && exp && exp > now;

  return (
    <div className="flex min-h-screen justify-center">
      <div className="container mx-auto max-w-md py-12 px-6 text-center">
        {linkIsValid ? (
          <ResetPasswordForm code={code} />
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div className="flex items-center bg-red-100 text-red-700 px-4 py-3 rounded-md">
              <svg
                className="w-6 h-6 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M18.364 5.636a9 9 0 010 12.728 9 9 0 01-12.728 0 9 9 0 010-12.728 9 9 0 0112.728 0zM12 8v4m0 4h.01"
                />
              </svg>
              Invalid Link
            </div>
            <p className="text-gray-400">The link is either invalid or expired.</p>
            <Link to="/password/forgot" replace className="text-blue-500">
              Request a new password reset link
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
