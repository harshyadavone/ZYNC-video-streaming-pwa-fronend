import { Outlet, useLocation } from "react-router-dom";

const Auth = () => {
  const params = useLocation();

  return (
    <>
      <div className="min-h-screen  flex items-center justify-between ">
        <div className="w-1/2 hidden md:block">
          <h2 className="text-2xl playwrite-no ">Do whatever you want</h2>
        </div>
        <div className="md:w-1/2 container mx-auto max-w-md">
          <div className=" p-8 rounded-lg">
            <h2 className="text-3xl font-bold mb-6 text-left text-emerald-500">
              {params.pathname === "/register" ? "Sign Up" : "Sign In"}
            </h2>
            <Outlet />
          </div>
        </div>
      </div>
    </>
  );
};

export default Auth;
