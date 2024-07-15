import React, { useState, useCallback, useRef, useEffect } from "react";
import { ArrowLeft, Search, Mic, X } from "lucide-react";
import { useSearchTitle } from "../hooks/useSearchVideos";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import VoiceSearchModal from "./VoiceSearchModal";

interface MobileSearchPageProps {
  onClose: () => void;
}

interface Video {
  id: string;
  title: string;
}

const MobileSearchPage: React.FC<MobileSearchPageProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchTerm(e.target.value);
    },
    []
  );

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  }, [searchTerm, navigate, onClose]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        handleSearch();
      }
    },
    [handleSearch]
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    inputRef.current?.focus();
  }, []);

  const handleVoiceSearch = useCallback(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.error("Voice recognition is not supported in your browser.");
      return;
    }

    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
      setIsModalOpen(false);
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognitionRef.current = recognition;
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsModalOpen(true);
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setSearchTerm(transcript);
      setIsModalOpen(false);
      setIsListening(false);
      navigate(`/search/${encodeURIComponent(transcript.trim())}`);
      onClose();
    };

    recognition.onerror = (event: any) => {
      console.error(event.error);
      if (event.error !== "aborted") {
        toast.error(`Error: ${event.error}`);
      }
      setIsModalOpen(false);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsModalOpen(false);
      setIsListening(false);
      recognitionRef.current = null;
    };

    recognition.start();
  }, [navigate, onClose]);

  const handleCloseModal = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsModalOpen(false);
    setIsListening(false);
  };

  const { title, isLoading } = useSearchTitle(searchTerm);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="fixed inset-0 bg-background z-50 flex flex-col">
      <div className="flex items-center p-2 border-b border-gray-200 dark:border-gray-700">
        <button
          onClick={onClose}
          className="mr-4 text-gray-600 dark:text-gray-400"
        >
          <ArrowLeft size={24} />
        </button>
        <div className="flex-grow flex items-center bg-card rounded-full">
          <input
            ref={inputRef}
            type="text"
            placeholder={isListening ? "Listening..." : "Search YouTube"}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            className="flex-grow px-4 py-2 bg-transparent text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none"
          />
          {searchTerm ? (
            <button
              onClick={handleClearSearch}
              className="absolute right-2 p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <X size={18} />
            </button>
          ) : (
            <button
              onClick={handleVoiceSearch}
              className="absolute right-2 p-2 mr-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors duration-200"
            >
              <Mic size={20} />
            </button>
          )}
        </div>
      </div>
      <div className="flex-grow overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <div className="animate-pulse">Searching for "{searchTerm}"...</div>
          </div>
        ) : searchTerm === "" ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">Search ZYNC</p>
            <p className="text-sm mt-2">
              Enter a search term to find videos, channels, and more
            </p>
          </div>
        ) : !title || title.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            <Search size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">
              No results found for "{searchTerm}"
            </p>
            <p className="text-sm mt-2">
              Try different keywords or check your spelling
            </p>
          </div>
        ) : (
          <>
            <div className="p-2 text-sm text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
              Showing results for "{searchTerm}"
            </div>
            <ul className="py-2">
              {title.map((video: Video) => (
                <li
                  key={video.id}
                  className="py-2 px-4 hover:bg-card/50 transition-colors duration-200"
                >
                  <Link
                    to={`/search/${encodeURIComponent(video.title)}`}
                    className="flex items-center gap-2"
                    onClick={() => {
                      setSearchTerm(video.title);
                      onClose();
                    }}
                  >
                    <Search
                      size={18}
                      className="text-gray-500 dark:text-gray-400 flex-shrink-0"
                    />
                    <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                      {video.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
      <VoiceSearchModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MobileSearchPage;
