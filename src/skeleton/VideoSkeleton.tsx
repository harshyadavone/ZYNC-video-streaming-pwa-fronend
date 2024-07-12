type Props = {
  grid: string;
};

const VideoSkeleton = ({ grid }: Props) => {
  return (
    <div className={`mb-8 grid grid-cols-1 md:grid-cols-${grid} gap-4 mt-5 `}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
        <div key={index}>
          <div className="bg-card p-4 rounded-lg text-center animate-pulse">
            <div
              className={`"bg-card h-${
                grid === "4" ? "32" : "40"
              } w-16 rounded-lg mb-2`}
            ></div>
          </div>
          <div className="flex gap-4 ">
            <div className="bg-card h-10 w-10  lg:h-10 lg:w-10 rounded-full mt-2"></div>
            <div className="flex-1">
              <div
                className={`bg-card h-4 w-${
                  grid === "4" ? "48" : "60"
                } rounded-sm mt-2`}
                about="title"
              />
              <div
                className={`bg-card h-4 w-${
                  grid === "4" ? "40" : "52"
                } rounded-sm mt-2`}
                about="channel Name"
              />
            </div>
            {/* TODO: Not sure about that */}
            {/* <div className="bg-card h-6 w-6 rounded-full mt-4 mr-4" /> */}
          </div>
        </div>
      ))}
    </div>
  );
};

export default VideoSkeleton;
