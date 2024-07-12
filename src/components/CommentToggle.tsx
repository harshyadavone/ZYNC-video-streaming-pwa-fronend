// CommentToggle.tsx
import React from 'react';

interface CommentToggleProps {
  commentCount: number;
  onClick: () => void;
}

const CommentToggle: React.FC<CommentToggleProps> = ({ commentCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
    >
      View all {commentCount} comments
    </button>
  );
};

export default CommentToggle;