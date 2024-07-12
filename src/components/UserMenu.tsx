import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { logout } from "../lib/api";

const UserMenu: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { mutate: signOut } = useMutation({
    mutationFn: logout,
    onSettled: () => {
      queryClient.clear();
      navigate("/login", { replace: true });
    },
  });

  return (
    <div className="relative">
      <button className="absolute left-6 bottom-6"></button>
      <div className="absolute mt-2 right-0 w-48 bg-black border border-gray-200 rounded-md shadow-lg">
        <div
          className="py-2 px-4 cursor-pointer hover:bg-gray-900"
          onClick={() => navigate("/")}
        >
          Profile
        </div>
        <div
          className="py-2 px-4 cursor-pointer hover:bg-gray-900"
          onClick={() => navigate("/settings")}
        >
          Settings
        </div>
        <div
          className="py-2 px-4 cursor-pointer hover:bg-gray-900"
          onClick={() => signOut}
        >
          Logout
        </div>
      </div>
    </div>
  );
};

export default UserMenu;
