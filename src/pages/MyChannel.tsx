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
  const [isSubmitting, setIsSubmitting] = useState(false);

  const tabs = ["Videos", "Playlists", "About"];

  const { editForm, handleInputChange, handleFileChange } = useChannelForm(
    channelData?.channel
  );

  const closeCreateDialog = useCallback(() => {
    setIsCreateFormOpen(false);
  }, []);

  // const closeEditDialog = useCallback(() => {
  //   setIsEditFormOpen(false);
  // }, []);

  const {
    mutateAsync: updateMutation,
  } = updateChannelMutation();
  const { mutateAsync: createMutation } =
    useCreateChannelMutation(closeCreateDialog);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value instanceof File || typeof value === "string") {
          formData.append(key, value);
        }
      });

      try {
        if (channelData?.channel) {
          await updateMutation(formData);
        } else {
          await createMutation(formData);
        }

        // Close the dialog only after successful update/create
        setIsEditFormOpen(false);
        setIsCreateFormOpen(false);
      } catch (error) {
        console.error("Error updating/creating channel:", error);
        // Handle error (e.g., show error message to user)
      } finally {
        setIsSubmitting(false);
      }
    },
    [editForm, channelData?.channel, updateMutation, createMutation]
  );



  if (isLoading) return <MyChannelSkeleton />;
  if (!channelData) return <LoadingOverlay />;
  if (error) return <ErrorDisplay message={error.message} />;

  return (
    <div className="w-full mx-auto py-8 ">
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
            <PlaylistsTab
              channelId={String(channelData.channel.id)}
              channel={channelData.channel}
            />
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
            isSubmitting={isSubmitting}
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
