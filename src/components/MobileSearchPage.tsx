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
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [shouldRedirect, setShouldRedirect] = useState<boolean>(false);

  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);
  const navigate = useNavigate();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchTerm(value);
      setIsSearchOpen(value !== "");
    },
    []
  );

  const handleClearSearch = useCallback(() => {
    setSearchTerm("");
    inputRef.current?.focus();
  }, []);

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      setShouldRedirect(true);
    }
  }, [searchTerm]);

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
      setShouldRedirect(true);
    };

    recognition.onerror = (event: any) => {
      console.error(event.error, "error");
      if (event.error !== "aborted") {
        toast.error(event.error + "error");
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
  }, [handleSearch]);

  useEffect(() => {
    if (shouldRedirect && searchTerm.trim()) {
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
      onClose();
    }
  }, [shouldRedirect, searchTerm, navigate, onClose]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

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
      <div className="flex items-center p-4 border-b border-border">
        <button onClick={onClose} className="mr-4 text-muted-foreground">
          <ArrowLeft size={24} />
        </button>
        <div className="flex-grow flex items-center bg-card rounded-full shadow-sm">
          <input
            ref={inputRef}
            type="text"
            placeholder={isListening ? "Listening..." : "Search"}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearch();
              }
            }}
            className="flex-grow px-4 py-2 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={handleClearSearch}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          onClick={handleSearch}
          className="ml-4 text-muted-foreground hover:text-foreground transition-colors duration-200"
        >
          <Search size={24} />
        </button>
      </div>
      <div className="flex-grow overflow-y-auto">
        {isLoading && (
          <div className="p-4 text-center text-muted-foreground">
            Loading...
          </div>
        )}
        {!isLoading && searchTerm && title && title.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No results found.
          </div>
        )}
        {!isLoading && isSearchOpen && title && title.length > 0 && (
          <ul className="py-2">
            {title.map((video: Video) => (
              <li
                key={video.id}
                className="py-2 px-4 hover:bg-[#0f0f0f] transition-colors duration-200"
              >
                <Link
                  to={`/search/${encodeURIComponent(video.title)}`}
                  className="flex items-center gap-2"
                  onClick={() => {
                    setIsSearchOpen(false);
                    setSearchTerm(video.title);
                    onClose();
                  }}
                >
                  <Search
                    size={18}
                    className="text-muted-foreground flex-shrink-0"
                  />
                  <span className="font-medium text-foreground truncate">
                    {video.title}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="p-4 border-t border-border">
        <button
          onClick={handleVoiceSearch}
          className={`w-full py-2 flex items-center justify-center ${
            isListening ? "bg-emerald-800" : "bg-accent"
          } text-accent-foreground rounded-full hover:bg-accent/90 transition-all duration-200 ease-in-out hover:shadow-md relative overflow-hidden`}
        >
          <Mic
            size={20}
            className={`${isListening ? "text-white" : ""} mr-2 z-10`}
          />
          Search with your voice
          {isListening && (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full  opacity-75"></span>
            </span>
          )}
        </button>
      </div>
      <VoiceSearchModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default MobileSearchPage;
