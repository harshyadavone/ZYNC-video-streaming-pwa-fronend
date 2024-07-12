import React from "react";
import CommentItem from "./CommentItem";

interface CommentListProps {
  comments: any[];
  videoId: number;
  onReply: (content: string, parentId: number, replyToUsername: string) => void;
  owner?: number;
}

const CommentList: React.FC<CommentListProps> = ({
  comments,
  videoId,
  onReply,
  owner,
}) => {
  return (
    <div>
      {comments.map((comment) => (
        <CommentItem
          key={comment.id}
          comment={comment}
          videoId={videoId}
          onReply={onReply}
          owner={owner as number}
        />
      ))}
    </div>
  );
};

export default CommentList;
