import React from "react";

interface ErrorDisplayProps {
  message: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message }) => {
  return (
    <div className="text-center p-8">
      Error: {message}
    </div>
  );
};

export default ErrorDisplay;
