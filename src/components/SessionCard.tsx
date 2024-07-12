import React from 'react';
import useDeleteSession from "../hooks/useDeleteSession";
import { XCircle } from 'lucide-react';
import { Button } from '../components/ui/button';

interface SessionCardProps {
  session: {
    _id: string;
    createdAt: string;
    userAgent: string;
    isCurrent: boolean;
  };
}

const SessionCard: React.FC<SessionCardProps> = ({ session }) => {
  const { _id, createdAt, userAgent, isCurrent } = session;

  const { deleteSession, isPending } = useDeleteSession(_id);

  return (
    <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
      <div className="flex-1">
        <p className="font-medium text-foreground mb-1">
          {new Date(createdAt).toLocaleString("en-US")}
          {isCurrent && " (current session)"}
        </p>
        <p className="text-sm text-muted-foreground">{userAgent}</p>
        <p className="text-xs text-muted-foreground">{_id}</p>
      </div>
      {!isCurrent && (
        <Button 
          variant="ghost" 
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={() => deleteSession()}
          disabled={isPending}
        >
          <XCircle className="w-5 h-5" />
        </Button>
      )}
    </div>
  );
};

export default SessionCard;