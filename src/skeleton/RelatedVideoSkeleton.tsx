const RelatedVideoSkeleton = () => {
  return (
    <div className={`mb-8 grid grid-cols-1  gap-4 mt-5 `}>
      {[1, 2, 3, 4, 5, 6, 7, 8].map((index) => (
        <div key={index} className="flex flex-row gap-2">
          <div className="bg-card p-4 rounded-lg text-center animate-pulse">
            <div className={`"bg-card h-14 w-36 rounded-lg mb-2`} />
          </div>
          <div className="flex flex-col gap-4 ">
            <div className="">
              <div
                className={`bg-card h-4 w-36 md:w-60 rounded-sm mt-2`}
                about="title"
              />
              <div className="flex gap-2 items-center justify-start">
                <div
                  className={`bg-card h-4 w-32 md:w-48 rounded-sm mt-2`}
                  about="channel Name"
                />
              </div>
              <div
                className={`bg-card h-3 w-28 md:w-36 rounded-sm mt-2`}
                about="Views"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RelatedVideoSkeleton;
