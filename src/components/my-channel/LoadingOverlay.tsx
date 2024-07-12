import React from "react";
import { Loader2 } from "lucide-react";

// interface LoadingOverlayProps {
//   message: string;
// }

const LoadingOverlay: React.FC = () => {
  return (
    <div className="fixed  inset-0 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-background rounded-lg shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary text-center" />
        {/* <p className="mt-2 text-sm text-foreground">{message}</p> */}
      </div>
    </div>
  );
};

export default LoadingOverlay;
