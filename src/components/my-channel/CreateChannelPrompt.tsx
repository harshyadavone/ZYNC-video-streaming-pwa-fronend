// components/CreateChannelPrompt.tsx
import React from 'react';
import { Button } from '../ui/button';
import ChannelForm from './ChannelForm';

interface CreateChannelPromptProps {
  onCreateClick: () => void;
  isFormOpen: boolean;
  onFormClose: () => void;
  editForm: {
    name: string;
    description: string;
    slug: string;
    channelProfileImage: File | null;
    bannerImage: File | null;
  };
  onSubmit: (e: React.FormEvent) => void;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const CreateChannelPrompt: React.FC<CreateChannelPromptProps> = ({
  onCreateClick,
  isFormOpen,
  onFormClose,
  editForm,
  onSubmit,
  onInputChange,
  onFileChange,
}) => (
  <div className="text-center">
    <h2 className="text-xl font-semibold">You don't have a channel yet.</h2>
    <p className="mb-4">Create your own channel to start sharing videos and playlists.</p>
    <Button onClick={onCreateClick}>Create Channel</Button>
    <ChannelForm
      isOpen={isFormOpen}
      title="Create Channel"
      editForm={editForm}
      onClose={onFormClose}
      onSubmit={onSubmit}
      onInputChange={onInputChange}
      onFileChange={onFileChange}
    />
  </div>
);

export default CreateChannelPrompt;