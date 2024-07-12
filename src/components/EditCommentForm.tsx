import React, { useState, useEffect, useRef } from "react";
import { Navigation03Icon } from "./ui/Icons";

interface EditCommentFormProps {
  initialContent: string;
  onSubmit: (content: string) => void;
  onCancel: () => void;
}

const EditCommentForm: React.FC<EditCommentFormProps> = ({
  initialContent,
  onSubmit,
  onCancel,
}) => {
  const [content, setContent] = useState(initialContent);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.setSelectionRange(content.length, content.length);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim() && content !== initialContent) {
      onSubmit(content.trim());
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Escape') {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-2">
      <div className="relative">
        <label htmlFor="edit-comment" className="sr-only">Edit comment</label>
        <textarea
          id="edit-comment"
          ref={textareaRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          className="w-full bg-card/90 border p-2 rounded-xl text-secondary-foreground resize-none focus:outline-none focus:ring-1 focus:ring-card focus:border-transparent transition duration-200 text-sm"
          rows={3}
          aria-label="Edit comment"
        />
        <div className="absolute right-2 bottom-2 flex space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 text-sm text-muted-foreground hover:text-foreground transition duration-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!content.trim() || content === initialContent}
            className="p-2 disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none transition duration-200"
            aria-label="Submit edited comment"
          >
            <Navigation03Icon className="text-primary w-5 h-5" />
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditCommentForm;