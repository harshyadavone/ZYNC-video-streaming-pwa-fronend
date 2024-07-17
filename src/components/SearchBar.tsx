import React, {
  useState,
  useCallback,
  useMemo,
  useRef,
  useEffect,
} from "react";
import { Search, Mic, X } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useSearchTitle } from "../hooks/useSearchVideos";
import { toast } from "sonner";
import VoiceSearchModal from "./VoiceSearchModal";

interface IconButtonProps {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const IconButton: React.FC<IconButtonProps> = React.memo(
  ({ onClick, className, children }) => (
    <button
      onClick={onClick}
      className={`p-2 text-muted-foreground hover:text-foreground transition-colors duration-200 ${
        className || ""
      }`}
    >
      {children}
    </button>
  )
);

interface SearchBarProps {
  onMobileSearchClick?: () => void;
}

interface Video {
  id: string;
  title: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onMobileSearchClick }) => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [shouldSearch, setShouldSearch] = useState<boolean>(false);
  const resultClickedRef = useRef<boolean>(false);

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
      navigate(`/search/${encodeURIComponent(searchTerm.trim())}`);
    }
    setIsSearchOpen(false);
  }, [searchTerm, navigate]);

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
      setShouldSearch(true);
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error", event.error);
      if (event.error !== "aborted") {
        toast.error("Speech recognition error: " + event.error);
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
  }, [setSearchTerm, handleSearch]);

  useEffect(() => {
    if (shouldSearch) {
      handleSearch();
      setShouldSearch(false);
    }
  }, [shouldSearch, handleSearch]);

  const handleCloseModal = () => {
    if (recognitionRef.current) {
      recognitionRef.current.abort();
      recognitionRef.current = null;
    }
    setIsModalOpen(false);
    setIsListening(false);
  };

  const containerClasses = useMemo(() => {
    return `flex items-center bg-card transition-all duration-300 ease-in-out ${
      isFocused
        ? "ring-1 ring-gray-800 rounded-t-3xl shadow-emerald-800 shadow-sm"
        : "rounded-full"
    }`;
  }, [isFocused]);

  const { title, isLoading } = useSearchTitle(searchTerm);

  const handleFocus = useCallback(() => {
    setIsFocused(true);
    setIsSearchOpen(searchTerm !== "");
  }, [searchTerm]);

  const handleBlur = useCallback(() => {
    setTimeout(() => {
      if (!resultClickedRef.current) {
        setIsFocused(false);
        setIsSearchOpen(false);
      }
      resultClickedRef.current = false;
    }, 200);
  }, []);

  const handleResultClick = useCallback((title: string) => {
    resultClickedRef.current = true;
    setSearchTerm(title);
    setShouldSearch(true);
  }, []);

  return (
    <div className="relative w-full max-w-[600px] flex items-center">
      <div className={`${containerClasses} flex-grow`}>
        <input
          ref={inputRef}
          type="text"
          placeholder={isListening ? "Listening..." : "Search"}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
          }}
          className="w-full px-4 py-2 bg-transparent text-foreground placeholder-muted-foreground focus:outline-none hidden sm:block"
        />
        <div className="sm:hidden w-full" onClick={onMobileSearchClick}>
          <div className="px-4 py-2 text-muted-foreground">Search</div>
        </div>
        {searchTerm && (
          <IconButton onClick={handleClearSearch} className="hidden sm:block">
            <X size={18} />
          </IconButton>
        )}
        <div className="h-6 w-[1px] bg-border mx-2"></div>
        <IconButton onClick={handleSearch} className="mr-2 hover:text-primary">
          <Search size={20} />
        </IconButton>
      </div>

      {isFocused && isSearchOpen && (
        <div className="absolute top-[34px] left-0 w-full max-w-[556px] mt-2 bg-card rounded-b-2xl shadow-emerald-800 z-10 ring-1 ring-gray-800 shadow-md">
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
          {!isLoading && title && title.length > 0 && (
            <ul className="py-2">
              {title.map((video: Video) => (
                <li
                  key={video.id}
                  className="py-2 px-4 hover:bg-[#0f0f0f] transition-colors duration-200"
                >
                  <Link
                    to={`/search/${encodeURIComponent(video.title)}`}
                    className="flex items-center gap-2"
                    onMouseDown={(e) => e.preventDefault()} // Prevent blur
                    onClick={() => handleResultClick(video.title)}
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
      )}

      <IconButton
        onClick={handleVoiceSearch}
        className={`ml-2 p-2 ${
          isListening ? "bg-red-500" : "bg-accent"
        } text-accent-foreground rounded-full hover:bg-accent/90 transition-all duration-200 ease-in-out hover:shadow-md hidden sm:flex relative overflow-hidden`}
      >
        <Mic size={20} className={`${isListening ? "text-white" : ""} z-10`} />
        {isListening && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          </span>
        )}
      </IconButton>
      <VoiceSearchModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default React.memo(SearchBar);
