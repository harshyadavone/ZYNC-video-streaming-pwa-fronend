import { Loader2 } from "lucide-react";
import "../index.css";

const Loader = () => {
  return (
    <div className="flex justify-center items-center">
      <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
    </div>
  );
};

export default Loader;