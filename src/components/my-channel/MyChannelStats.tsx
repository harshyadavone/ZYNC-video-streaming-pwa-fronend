// components/ChannelStats.tsx
import React from 'react';
import { Channel } from '../../hooks/my-channel/useGetMychannel';
import { timeAgo } from '../../lib/formatters';

interface ChannelStatsProps {
  channel: Channel;
}

const ChannelStats: React.FC<ChannelStatsProps> = ({ channel }) => (
  <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4 px-4">
    <StatItem title="Total Videos" value={channel._count.videos} />
    <StatItem title="Total Playlists" value={channel._count.playlists || 0} />
    <StatItem title="Subscribers" value={channel._count.subscribers || 0} />
    <StatItem title="Created" value={timeAgo(channel.createdAt)} />
  </div>
);

const StatItem: React.FC<{ title: string; value: number | string }> = ({ title, value }) => (
  <div className="bg-card p-4 rounded-lg text-center">
    <h3 className="font-semibold">{title}</h3>
    <p>{value}</p>
  </div>
);

export default ChannelStats;