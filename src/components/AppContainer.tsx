import { Navigate, Outlet } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import TopBar from "./Topbar";

const AppContainer: React.FC = () => {
  const { user, isLoading } = useAuth();

  return isLoading ? (
    <div className="flex w-screen h-screen items-center justify-center ">
      <div className="spinner mb-4"></div>
    </div>
  ) : user ? (
    <div className=" min-h-screen">
      <TopBar />
      <Outlet />
    </div>
  ) : (
    <Navigate
      to="/login"
      replace
      state={{
        redirectUrl: window.location.pathname,
      }}
    />
  );
};

export default AppContainer;
