import React, { useState, useRef, ChangeEvent, FormEvent } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Upload, Image, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { useNavigate, useParams } from "react-router-dom";
import { useVideoUpload } from "../hooks/useVideos";

interface UploadFormState {
  title: string;
  description: string;
  videoFile: File | null;
  thumbnailFile: File | null;
  privacy: Privacy | "";
  category: ContentCategory | "";
  tags: string[];
}

enum ContentCategory {
  EDUCATION = "EDUCATION",
  ENTERTAINMENT = "ENTERTAINMENT",
  MUSIC = "MUSIC",
  NEWS = "NEWS",
  TECHNOLOGY = "TECHNOLOGY",
}

enum Privacy {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  UNLISTED = "UNLISTED",
}

const UploadPage: React.FC = () => {
  const { channelId } = useParams();
  const [uploadForm, setUploadForm] = useState<UploadFormState>({
    title: "",
    description: "",
    videoFile: null,
    thumbnailFile: null,
    privacy: "",
    category: "",
    tags: [],
  });

  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [tagInput, setTagInput] = useState<string>("");
  const videoInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const {
    mutate: uploadVideo,
    isUploading,
    progress,
    isError,
    error,
    isComplete,
  } = useVideoUpload();

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUploadForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, files } = e.target;
    if (files && files[0]) {
      setUploadForm((prev) => ({ ...prev, [name]: files[0] }));

      if (name === "videoFile") {
        const videoURL = URL.createObjectURL(files[0]);
        setVideoPreview(videoURL);
      } else if (name === "thumbnailFile") {
        const imageURL = URL.createObjectURL(files[0]);
        setThumbnailPreview(imageURL);
      }
    }
  };

  const handlePrivacyChange = (value: Privacy) => {
    setUploadForm((prev) => ({ ...prev, privacy: value }));
  };

  const handleCategoryChange = (value: ContentCategory) => {
    setUploadForm((prev) => ({ ...prev, category: value }));
  };
  const handleAddTag = () => {
    if (tagInput.trim() && !uploadForm.tags.includes(tagInput.trim())) {
      setUploadForm((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput("");
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setUploadForm((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate required fields
    if (!uploadForm.title.trim()) {
      toast.error("Please enter a title for the video.");
      return;
    }
    if (!uploadForm.videoFile) {
      toast.error("Please select a video file to upload.");
      return;
    }
    if (!uploadForm.privacy) {
      toast.error("Please select a privacy setting.");
      return;
    }
    if (!uploadForm.category) {
      toast.error("Please select a category.");
      return;
    }
    if (uploadForm.tags.length === 0) {
      toast.error("Please add at least one tag.");
      return;
    }

    const formData = new FormData();
    formData.append("title", uploadForm.title);
    formData.append("description", uploadForm.description);
    formData.append("privacy", uploadForm.privacy);
    formData.append("category", uploadForm.category);
    formData.append("tags", JSON.stringify(uploadForm.tags));
    if (uploadForm.videoFile) formData.append("video", uploadForm.videoFile);
    if (uploadForm.thumbnailFile)
      formData.append("thumbnail", uploadForm.thumbnailFile);

    if (channelId) {
      uploadVideo({ channelId, formData });
    } else {
      toast.error("Channel ID is missing");
    }
  };

  const triggerFileInput = (inputRef: React.RefObject<HTMLInputElement>) => {
    inputRef.current?.click();
  };

  React.useEffect(() => {
    if (isComplete && !isError) {
      toast.success("Video uploaded successfully!");
      //Redirect user to /my-channel page
      navigate("/my-channel");
    }
  }, [isComplete, isError]);

  return (
    <div className="max-w-2xl mx-auto p-6  rounded-lg shadow-lg">
      {isUploading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="text-white text-center">
            <div
              className="google-spinner"
              style={{ width: "80px", height: "80px" }}
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
            <div className="mt-2 text-lg font-medium">
              Uploading {Math.round(progress)}%
            </div>
          </div>
        </div>
      )}
      <h1 className="text-3xl font-bold mb-6 text-center">Upload Your Video</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            Title
          </label>
          <Input
            id="title"
            name="title"
            value={uploadForm.title}
            onChange={handleInputChange}
            className="w-full"
            placeholder="Enter video title"
            required
          />
        </div>
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium mb-1"
          >
            Description
          </label>
          <Textarea
            id="description"
            name="description"
            value={uploadForm.description}
            onChange={handleInputChange}
            className="w-full"
            placeholder="Enter video description"
            rows={4}
          />
        </div>
        <div>
          <label htmlFor="videoFile" className="block text-sm font-medium mb-1">
            Video File
          </label>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              onClick={() => triggerFileInput(videoInputRef)}
              className="flex items-center"
            >
              <Upload className="mr-2 h-4 w-4" />
              Select Video
            </Button>
            <Input
              id="videoFile"
              name="videoFile"
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="hidden"
              ref={videoInputRef}
            />
            {uploadForm.videoFile && (
              <span className="text-sm text-gray-600">
                {uploadForm.videoFile.name}
              </span>
            )}
          </div>
          {videoPreview && (
            <video
              src={videoPreview}
              className="mt-2 max-w-full h-48 object-cover rounded"
              controls
            />
          )}
        </div>
        <div>
          <label
            htmlFor="thumbnailFile"
            className="block text-sm font-medium mb-1"
          >
            Thumbnail
          </label>
          <div className="flex items-center space-x-4">
            <Button
              type="button"
              onClick={() => triggerFileInput(thumbnailInputRef)}
              className="flex items-center"
            >
              <Image className="mr-2 h-4 w-4" />
              Select Thumbnail
            </Button>
            <Input
              id="thumbnailFile"
              name="thumbnailFile"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              ref={thumbnailInputRef}
            />
            {uploadForm.thumbnailFile && (
              <span className="text-sm text-gray-600">
                {uploadForm.thumbnailFile.name}
              </span>
            )}
          </div>
          {thumbnailPreview && (
            <img
              src={thumbnailPreview}
              alt="Thumbnail preview"
              className="mt-2 max-w-full h-48 object-cover rounded"
            />
          )}
        </div>
        <div>
          <label htmlFor="privacy" className="block text-sm font-medium mb-1">
            Privacy <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={handlePrivacyChange} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Privacy" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(Privacy).map((privacy) => (
                  <SelectItem key={privacy} value={privacy}>
                    {privacy}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium mb-1">
            Category <span className="text-red-500">*</span>
          </label>
          <Select onValueChange={handleCategoryChange} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {Object.values(ContentCategory).map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="tags" className="block text-sm font-medium mb-1">
            Tags
          </label>
          <div className="flex items-center space-x-2">
            <Input
              id="tags"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              placeholder="Add a tag without #"
              className="flex-grow"
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddTag();
                }
              }}
            />
            <Button
              type="button"
              onClick={handleAddTag}
              className="flex-shrink-0"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {uploadForm.tags.map((tag) => (
              <span
                key={tag}
                className="bg-card text-emerald-500 text-xs font-medium px-2.5 py-0.5 rounded flex items-center"
              >
                #{tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 text-emerald-600 hover:text-emerald-800"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
        <Button type="submit" className="w-full" disabled={isUploading}>
          {isUploading ? "Uploading..." : "Upload Video"}
        </Button>
      </form>
      {isError && (
        <div className="text-red-500 mt-4">
          Error: {(error as Error).message}
        </div>
      )}
    </div>
  );
};

export default UploadPage;
