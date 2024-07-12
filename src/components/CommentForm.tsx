// CommentForm.tsx
import React, { useState, useEffect, useRef } from "react";
import { Navigation03Icon } from "./ui/Icons";

interface CommentFormProps {
  onSubmit: (content: string) => void;
  placeholder?: string;
  buttonText?: string;
  autoFocus?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({
  onSubmit,
  placeholder = "Add a comment...",
  autoFocus = false,
}) => {
  const [content, setContent] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content.trim());
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="">
      <div className="fixed  w-full px-3 right-1 bottom-0 md:relative md:pb-5 ">
        <textarea
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className=" w-full  left-0 flex-grow overflow-y-auto bg-card border p-2 md:bg-card/90 rounded-xl text-secondary-foreground resize-none focus:outline-none  focus:ring-0 text-sm"
          placeholder={placeholder}
          rows={1}
        />
        <button
          type="submit"
          disabled={!content.trim()}
          onKeyPress={(e) =>
            e.key === "Enter" && console.log("Hello there its me Enter")
          }
          className="px-3 absolute right-2 py-2 md:pr-3 disabled:cursor-not-allowed  text-sm"
        >
          <Navigation03Icon className="text-primary" />
        </button>
      </div>
    </form>
  );
};

export default CommentForm;
