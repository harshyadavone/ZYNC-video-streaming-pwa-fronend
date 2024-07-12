import React from "react";

const MyChannelSkeleton: React.FC = () => {
  return (
    <div className="bg-background text-foreground min-h-screen p-3 md:p-6 ">
      <div className="animate-pulse  mx-auto">
        <div className="mb-8 text-center relative">
          <div className="w-full h-28 md:h-60 bg-card mb-4 rounded-lg relative"></div>
          <div className="relative inline-block">
            <div className="w-32 border -mt-20 h-32 mx-auto mb-4 rounded-full bg-card"></div>
          </div>
          <h1 className="text-4xl mt-8 font-bold mb-2 bg-card h-10 rounded-lg"></h1>
          <p className="text-muted-foreground mb-4 bg-card h-6 rounded-lg"></p>
          <div className="flex  items-center justify-center">
            <div className="bg-card h-10 w-36 rounded-lg mr-2"></div>
            <div className="bg-card h-10 w-36 rounded-lg"></div>
          </div>
        </div>

        <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((index) => (
            <div key={index} className="bg-card p-4 rounded-lg text-center animate-pulse">
              <div className="bg-card h-8 w-16 rounded-lg mb-2"></div>
              <div className="bg-card h-6 w-12 rounded-lg"></div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-2 mb-2">
          <div className="px-4 font-semibold bg-card h-10 w-24 rounded-lg mr-2"></div>
          <div className="px-4 font-semibold bg-card h-10 w-24 rounded-lg"></div>
        </div>
        <div className="flex items-center gap-2 mb-4 border-b"></div>

        <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4, 5].map((index) => (
            <div key={index} className="bg-background text-foreground p-4 rounded-lg">
              <div className="bg-card h-40 mb-4 rounded-lg"></div>
              <div className="bg-card h-8 w-20 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MyChannelSkeleton;
