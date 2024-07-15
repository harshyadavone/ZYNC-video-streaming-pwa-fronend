import { Link } from "react-router-dom";

type Props = {
  channelName: string;
  channelId: string;
};

const ChannelLink = ({ channelName, channelId }: Props) => {
  return (
    <Link
      to={`/channel/${channelId}`}
      className="text-sm text-muted-foreground hover:text-white duration-300 cursor-pointer"
    >
      {channelName}
    </Link>
  );
};

export default ChannelLink;
