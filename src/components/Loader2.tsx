type Props = {
  sizeInPixels?: string;
};
const Loader2 = ({ sizeInPixels = "30px"}: Props) => {
  return (
    <div>
      {" "}
      <div className="text-white text-center">
        <div
          className="google-spinner"
          style={{
            width: `${sizeInPixels}`,
            height: `${sizeInPixels}`,
          }}
        >
          <svg className="circular" viewBox="25 25 50 50">
            <circle
              className="path"
              cx="50"
              cy="50"
              r="20"
              fill="none"
              strokeWidth="4"
              strokeMiterlimit="10"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Loader2;
