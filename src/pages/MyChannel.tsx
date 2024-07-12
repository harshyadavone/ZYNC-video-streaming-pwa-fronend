import React, { useState, useCallback } from "react";
import { useGetMyChannel } from "../hooks/my-channel/useGetMychannel";
import LoadingOverlay from "../components/my-channel/LoadingOverlay";
import ErrorDisplay from "../components/my-channel/ErrorDisplay";
import ChannelStats from "../components/my-channel/MyChannelStats";
import TabNavigation from "../components/my-channel/TabNavigation";
import VideoTab from "../components/VideoTab";
import ChannelForm from "../components/my-channel/ChannelForm";
import { useChannelForm } from "../components/my-channel/useChannelForm";
import { useCreateChannelMutation } from "../hooks/my-channel/useCreateMyChannel";
import { updateChannelMutation } from "../hooks/my-channel/useUpdateChannel";
import CreateChannelPrompt from "../components/my-channel/CreateChannelPrompt";
import MyChannelSkeleton from "../skeleton/MyChannelSkeleton";
import MyChannelHeader from "../components/my-channel/MyChannelHeader";
import PlaylistsTab from "../components/PlaylistTab";

export interface EditForm {
  name: string;
  description: string;
  slug: string;
  channelProfileImage: string | File;
  bannerImage: string | File;
}

const MyChannel: React.FC = () => {
  const { data: channelData, isLoading, error } = useGetMyChannel();
  const [activeTab, setActiveTab] = useState("Videos");
  const [isEditFormOpen, setIsEditFormOpen] = useState(false);
  const [isCreateFormOpen, setIsCreateFormOpen] = useState(false);

  const tabs = ["Videos", "Playlists", "About"];


  const { editForm, handleInputChange, handleFileChange, resetForm } =
    useChannelForm(channelData?.channel);

  const closeCreateDialog = useCallback(() => {
    setIsCreateFormOpen(false);
  }, []);

  const closeEditDialog = useCallback(() => {
    setIsEditFormOpen(false);
  }, []);

  const { mutate: updateMutation } = updateChannelMutation(closeEditDialog);

  const { mutate: createMutation } =
    useCreateChannelMutation(closeCreateDialog);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value instanceof File || typeof value === "string") {
          formData.append(key, value);
        }
      });

      if (channelData?.channel) {
        updateMutation(formData);
      } else {
        createMutation(formData);
      }
      resetForm();
      setIsEditFormOpen(false);
      setIsCreateFormOpen(false);
    },
    [editForm, channelData?.channel, updateMutation, createMutation, resetForm]
  );

  if (isLoading) return <MyChannelSkeleton />;
  if (!channelData) return <LoadingOverlay />;
  if (error) return <ErrorDisplay message={error.message} />;

  return (
    <div className=" mx-auto py-8 ">
      {channelData?.channel ? (
        <>
          <MyChannelHeader
            channel={channelData.channel}
            onEditClick={() => setIsEditFormOpen(true)}
          />
          <ChannelStats channel={channelData.channel} />
          <TabNavigation
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
          {activeTab === "Videos" && (
            <VideoTab channelId={channelData.channel.id} />
          )}
          {activeTab === "Playlists" && (
           <PlaylistsTab channelId={String(channelData.channel.id)} channel={channelData.channel}/>
          // <p> Coming Soon </p>
          )}
          {activeTab === "About" && <div>About tab content goes here</div>}
          <ChannelForm
            isOpen={isEditFormOpen}
            title="Update Channel"
            editForm={editForm}
            onClose={() => setIsEditFormOpen(false)}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onFileChange={handleFileChange}
          />
        </>
      ) : (
        <CreateChannelPrompt
          onCreateClick={() => setIsCreateFormOpen(true)}
          isFormOpen={isCreateFormOpen}
          onFormClose={() => setIsCreateFormOpen(false)}
          editForm={editForm}
          onSubmit={handleSubmit}
          onInputChange={handleInputChange}
          onFileChange={handleFileChange}
        />
      )}
    </div>
  );
};

export default MyChannel;