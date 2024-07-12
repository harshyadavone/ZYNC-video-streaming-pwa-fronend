import React, {
  useState,
  ChangeEvent,
  FormEvent,
  useMemo,
  useEffect,
  useCallback,
} from "react";
import { timeAgo } from "../lib/formatters";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Loader2 } from "lucide-react";
import { Upload04Icon } from "./ui/Icons";
import { Link } from "react-router-dom";
import VideoTab from "./VideoTab";
import { Channel, useGetMyChannel } from "../hooks/my-channel/useGetMychannel";
import { updateChannelMutation } from "../hooks/my-channel/useUpdateChannel";
import { toast } from "sonner";
import { useCreateChannelMutation } from "../hooks/my-channel/useCreateMyChannel";

interface EditForm {
  name: string;
  description: string;
  slug: string;
  channelProfileImage: File | null;
  bannerImage: File | null;
}
const initialEditForm = {
  name: "",
  description: "",
  slug: "",
  channelProfileImage: null,
  bannerImage: null,
};

const MyChannel: React.FC = () => {
  const { data: channelData, isLoading, isError, error } = useGetMyChannel();
  const [activeTab, setActiveTab] = useState<"videos" | "playlists">("videos");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>(initialEditForm);

  const closeDialog = useCallback(() => {
    setIsFormOpen(false);
  }, []);

  const {
    mutate: updateMutation,
    isError: isChannelUpdatingError,
    isSuccess: isChannelUpdatingSuccess,
    isPending: isChannelUpdating,
  } = updateChannelMutation(closeDialog);

  const {
    mutate: createMutation,
    isError: isChannelCreatingError,
    isSuccess: isChannelCreatingSuccess,
    isPending: isChannelCreating,
  } = useCreateChannelMutation(closeDialog);

  const channel: Channel | null = useMemo(
    () => channelData?.channel || null,
    [channelData]
  );

  const handleEditClick = useCallback(() => {
    if (channel) {
      setEditForm({
        name: channel.name,
        description: channel.description,
        slug: channel.slug,
        channelProfileImage: null,
        bannerImage: null,
      });
    } else {
      setEditForm(initialEditForm);
    }
    setIsFormOpen(true);
  }, [channel]);

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setEditForm((prev) => ({ ...prev, [name]: value }));
    },
    []
  );

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files) {
      setEditForm((prev) => ({ ...prev, [name]: files[0] }));
    }
  }, []);

  const handleSubmit = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      const formData = new FormData();
      Object.entries(editForm).forEach(([key, value]) => {
        if (value instanceof File) {
          formData.append(key, value);
        } else if (typeof value === "string") {
          formData.append(key, value);
        }
      });
      if (channel) {
        updateMutation(formData);
      } else {
        createMutation(formData);
      }
    },
    [channel, editForm, updateMutation, createMutation]
  );

  useEffect(() => {
    if (isChannelUpdatingSuccess) {
      toast.success("Channel Updated!");
    }
    if (isChannelUpdatingError) {
      toast.error("Something went wrong while updating the channel");
    }
    if (isChannelCreatingSuccess) {
      toast.success("Channel Updated!");
    }
    if (isChannelCreatingError) {
      toast.error("Something went wrong while updating the channel");
    }
  }, [
    isChannelUpdatingSuccess,
    isChannelUpdatingError,
    isChannelCreatingSuccess,
    isChannelCreatingError,
  ]);

  const renderContent = () => {
    if (isLoading) return <div className="text-center p-8">Loading...</div>;

    if (isError) {
      if (
        error instanceof Error &&
        error.message.includes("Channel Not found")
      ) {
        return (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold mb-4">
              You don't have a channel yet
            </h2>
            <Button onClick={handleEditClick}>Create a New Channel</Button>
            {renderChannelForm("Create Channel")}
          </div>
        );
      }
      return (
        <div className="text-center p-8">
          Error:{" "}
          {error instanceof Error
            ? error.message
            : "Failed to fetch channel data"}
        </div>
      );
    }

    if (!channel) {
      return (
        <div className="bg-background text-foreground min-h-screen p-4 md:p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">
              You don't have a channel yet
            </h1>
            <Button onClick={handleEditClick}>Create a New Channel</Button>
          </div>
          {renderChannelForm("Create Channel")}
        </div>
      );
    }

    return (
      <div className="bg-background text-foreground min-h-screen p-4 md:p-8">
        {(isChannelUpdating || isChannelCreating) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-background p-4 rounded-lg shadow-lg">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="mt-2 text-sm text-foreground">
                {channel ? "Updating channel..." : "Creating channel..."}
              </p>
            </div>
          </div>
        )}
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center relative">
            <div
              className="w-full h-28 md:h-60 bg-cover bg-center mb-4 rounded-lg relative"
              style={{
                backgroundImage: `url(${channel.bannerImage})`,
              }}
            ></div>
            <div className="relative inline-block">
              <img
                src={channel.channelProfileImage}
                alt={channel.name}
                className="w-32 h-32 mx-auto mb-4 rounded-full object-cover -mt-14 border-4 border-background"
              />
            </div>
            <h1 className="text-4xl font-bold mb-2">{channel.name}</h1>
            <p className="text-muted-foreground mb-4">{channel.description}</p>
            <div className="flex items-center justify-center">
              <Button
                onClick={handleEditClick}
                className="mr-2"
                variant={"ghost"}
              >
                Update Channel
              </Button>
              <Link to={`/my-channel/${channel.id}/upload`}>
                <Button className="text-black gap-2">
                  <Upload04Icon /> Upload Video
                </Button>
              </Link>
            </div>
          </div>

          <div className="mb-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-card p-4 rounded-lg text-center">
              <h3 className="font-semibold">Total Videos</h3>
              <p>{channel._count.videos}</p>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <h3 className="font-semibold">Total Playlists</h3>
              <p>{channel._count.playlists || "0"}</p>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <h3 className="font-semibold">Subscribers</h3>
              <p>{channel._count.subscribers || "0"}</p>
            </div>
            <div className="bg-card p-4 rounded-lg text-center">
              <h3 className="font-semibold">Created</h3>
              <p>{timeAgo(channel.createdAt)}</p>
            </div>
          </div>

          <div className="mb-4 border-b">
            <TabButton label="Videos" value="videos" />
            <TabButton label="Playlists" value="playlists" />
          </div>

          {activeTab === "videos" && <VideoTab channelId={channel.id} />}
          {activeTab === "playlists" && <div>Playlist tab content here</div>}

          {renderChannelForm("Update Channel")}
        </div>
      </div>
    );
  };

  const TabButton: React.FC<{
    label: string;
    value: "videos" | "playlists";
  }> = useCallback(
    ({ label, value }) => (
      <button
        className={`px-4 py-2 font-semibold ${
          activeTab === value
            ? "border-b-2 border-primary text-primary"
            : "text-muted-foreground"
        }`}
        onClick={() => setActiveTab(value)}
      >
        {label}
      </button>
    ),
    [activeTab]
  );

  const renderChannelForm = useCallback(
    (title: string) => {
      return (
        <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{title}</DialogTitle>
              <DialogDescription>
                {channel
                  ? "Make changes to your channel here."
                  : "Create your new channel here."}{" "}
                Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium">
                  Channel Name
                </label>
                <Input
                  id="name"
                  name="name"
                  value={editForm.name}
                  onChange={handleInputChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  name="description"
                  value={editForm.description}
                  onChange={handleInputChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="slug" className="block text-sm font-medium">
                  Slug
                </label>
                <Input
                  id="slug"
                  name="slug"
                  value={editForm.slug}
                  onChange={handleInputChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="channelProfileImage"
                  className="block text-sm font-medium"
                >
                  Channel Profile Image
                </label>
                <Input
                  id="channelProfileImage"
                  name="channelProfileImage"
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="bannerImage"
                  className="block text-sm font-medium"
                >
                  Banner Image
                </label>
                <Input
                  id="bannerImage"
                  name="bannerImage"
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                {channel ? "Save Changes" : "Create Channel"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      );
    },
    [
      isFormOpen,
      channel,
      editForm,
      handleInputChange,
      handleFileChange,
      handleSubmit,
    ]
  );

  return renderContent();
};

export default MyChannel;
