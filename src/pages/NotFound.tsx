import React from 'react';
import { Link } from 'react-router-dom';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-primary dark:text-white">
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      <p className="mb-8 text-lg text-center">
        Oops! The page you are looking for does not exist.
      </p>
      <Link to="/" className="text-emerald-500 hover:underline">
        Go back to the homepage
      </Link>
    </div>
  );
};

export default NotFound;
