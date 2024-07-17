import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { motion } from "framer-motion";

const Auth = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const location = useLocation();

  // @ts-ignore
  if (user?.isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center  p-4">
      <div className="w-full max-w-4xl flex rounded-3xl overflow-hidden shadow-2xl">
        {/* Left side - Animated background */}
        <motion.div
          className="hidden lg:block lg:w-1/2 bg-card relative overflow-hidden"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="absolute inset-0 opacity-20"
            animate={{
              backgroundImage: [
                "radial-gradient(circle at 20% 30%, var(--primary) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 70%, var(--secondary) 0%, transparent 50%)",
                "radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 50%)",
              ],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <div className="relative z-10 flex flex-col items-center justify-center h-full  text-primary">
            <motion.h1
              className="text-4xl font-bold mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Welcome to the Future
            </motion.h1>
            <motion.p
              className="text-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Where innovation meets simplicity
            </motion.p>
          </div>
        </motion.div>

        {/* Right side - Sign In/Sign Up form */}
        <motion.div
          className="w-full lg:w-1/2 bg-card p-8 lg:p-12"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h2
            className="text-3xl font-bold mb-6 text-foreground"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {location.pathname === "/register" ? "Create Account" : "Sign In"}
          </motion.h2>
          <Outlet />
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
