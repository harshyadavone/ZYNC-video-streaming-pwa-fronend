import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "react-router-dom";
import { verifyEmail } from "../lib/api";

const VerifyEmail: React.FC = () => {
  const { code } = useParams<{ code: string }>();
  const { isLoading, isSuccess, isError } = useQuery({
    queryKey: ["emailVerification", code],
    queryFn: () => verifyEmail(code!),
  });

  return (
    <div className="flex min-h-screen justify-center mt-12">
      <div className="container mx-auto max-w-md py-12 px-6 text-center">
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <div className="flex flex-col items-center space-y-6">
            <div
              className={`flex items-center px-4 py-3 rounded-md ${
                isSuccess
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {isSuccess ? "Email Verified!" : "Invalid Link"}
            </div>
            {isError && (
              <p className="text-gray-400">
                The link is either invalid or expired.{" "}
                <Link to="/password/forgot" replace className="text-blue-500">
                  Get a new link
                </Link>
              </p>
            )}
            <Link to="/" replace className="text-blue-500">
              Back to home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
