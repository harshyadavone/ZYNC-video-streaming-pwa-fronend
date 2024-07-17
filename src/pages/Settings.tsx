import React, { useState, useRef, useCallback, useEffect } from "react";
import { CircleAlert, Edit, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import useAuth from "../hooks/useAuth";
import AnimatedOutlet from "../components/AnimatedOutlet";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import debounce from "lodash/debounce";
import { checkUsernameAvailability, editProfile } from "../lib/api";
import { PencilEdit02Icon } from "../components/ui/Icons";

const Settings = () => {
  const { user }: any = useAuth();
  const { email, verified, createdAt, username, avatar, bio } = user;

  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState(username);
  const [editedBio, setEditedBio] = useState(bio);
  const [newAvatar, setNewAvatar] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const queryClient = useQueryClient();

  const {
    data: usernameAvailability,
    refetch: checkUsername,
    isLoading: isCheckingUsername,
  } = useQuery({
    queryKey: ["usernameAvailability", editedUsername],
    queryFn: () => checkUsernameAvailability(editedUsername),
    enabled: false, // We'll manually trigger this query
  });

  const debouncedCheckUsername = useCallback(
    debounce((username: string) => {
      if (username !== user.username && username.length > 0) {
        checkUsername();
      }
    }, 300),
    [checkUsername, user.username]
  );

  useEffect(() => {
    debouncedCheckUsername(editedUsername);
  }, [editedUsername, debouncedCheckUsername]);

  const editProfileMutation = useMutation({
    mutationFn: editProfile,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["auth"] });
      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Failed to update profile:", error);
    },
  });

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    resetForm();
  };

  const resetForm = () => {
    setEditedUsername(username);
    setEditedBio(bio);
    setNewAvatar(null);
  };

  const handleAvatarClick = () => {
    if (isEditing) {
      fileInputRef.current?.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setNewAvatar(event.target.files[0]);
    }
  };

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedUsername(e.target.value);
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("username", editedUsername);
    formData.append("bio", editedBio);
    if (newAvatar) {
      formData.append("avatar", newAvatar);
    }

    editProfileMutation.mutate(formData);
  };
  const handleCancel = () => {
    setIsEditing(false);
    resetForm();
  };

  console.log(editProfileMutation.status);

  // @ts-ignore
  const isUsernameAvailable = usernameAvailability?.isAvailable;

  return (
    <div className="flex justify-center w-full md:p-6 md:mt-4 text-foreground bg-gradient-to-b from-background to-muted/20">
      <div className="w-full max-w-7xl">
        <div className="flex flex-col md:flex-row items-stretch justify-center bg-card p-10 rounded-xl shadow-lg border border-muted/30 backdrop-blur-sm">
          <div className="flex flex-col items-center w-full md:w-1/3 mb-8 md:mb-0 md:mr-12 space-y-8">
            <h2 className="text-4xl font-bold mb-8 bg-clip-text  ">
              My Account
            </h2>
            <div className="relative group">
              <Avatar
                className="h-40 w-40 mb-6 rounded-full group-hover:border-primary cursor-pointer shadow-xl transition-all duration-300"
                onClick={handleAvatarClick}
              >
                <AvatarImage
                  src={
                    newAvatar
                      ? URL.createObjectURL(newAvatar)
                      : avatar || "https://github.com/shadcn.png"
                  }
                  className="object-cover"
                />
                <AvatarFallback className="bg-muted text-4xl font-bold">
                  {username?.slice(0, 1).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Edit
                  className="absolute bottom-8 right-0 bg-primary text-primary-foreground rounded-full p-2 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100"
                  size={32}
                />
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept="image/*"
            />
            <div className="flex flex-col items-center space-y-4 w-full">
              {isEditing ? (
                <div className="w-full">
                  <Input
                    value={editedUsername}
                    onChange={handleUsernameChange}
                    className="text-xl text-center rounded-lg border-none focus-visible:ring-0"
                  />
                  {isCheckingUsername ? (
                    <div className="flex items-center justify center mt-1 gap-2">
                      <Loader2 className=" h-4 w-4 animate-spin" />
                      <p className="text-sm text-muted-foreground ">
                        Checking username...
                      </p>
                    </div>
                  ) : (
                    editedUsername !== username &&
                    editedUsername.length > 0 && (
                      <p
                        className={`text-sm mt-1 ${
                          isUsernameAvailable
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {isUsernameAvailable
                          ? "Username is available"
                          : "Username is taken"}
                      </p>
                    )
                  )}
                </div>
              ) : (
                <p className="text-3xl font-semibold">{username}</p>
              )}
              <div className="flex flex-col items-center text-center space-y-2">
                <p className="flex items-center gap-2 text-xl">
                  {!verified && (
                    <CircleAlert
                      className="text-yellow-500"
                      width={24}
                      height={24}
                    />
                  )}
                  <span className="font-medium">{email}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Member since:{" "}
                  <span className="font-medium">
                    {new Date(createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </span>
                </p>
              </div>
              {isEditing ? (
                <Textarea
                  value={editedBio}
                  onChange={(e) => setEditedBio(e.target.value)}
                  className="mt-4 w-full resize-none overflow-y-auto rounded-lg focus-visible:ring-0 focus-visible:outline-none "
                  placeholder="Enter your bio..."
                  rows={4}
                />
              ) : (
                <p className="mt-4 text-center text-muted-foreground italic">
                  {bio || "No bio provided"}
                </p>
              )}
              <div className="flex gap-4 mt-8">
                {isEditing ? (
                  <>
                    <Button
                      onClick={handleSave}
                      disabled={
                        editProfileMutation.isPending ||
                        (editedUsername !== username && !isUsernameAvailable)
                      }
                      variant="secondary"
                      className="flex items-center"
                    >
                      {editProfileMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      onClick={handleCancel}
                      variant="ghost"
                      disabled={editProfileMutation.isPending}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={handleEditToggle}
                    variant={"ghost"}
                    className="flex items-center justify-center gap-2"
                  >
                    <PencilEdit02Icon className="h-4 w-4" /> Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="hidden md:block w-px bg-muted/45 self-stretch mx-8"></div>

          <div className="flex flex-col w-full md:w-2/3">
            <div className="overflow-y-auto relative rounded-lg bg-card/50 backdrop-blur-sm shadow-inner overflow-x-hidden">
              <AnimatedOutlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
