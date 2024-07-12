import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip";

interface PollOption {
  id: number;
  text: string;
  votes: { userId: number }[];
  _count: {
    votes: number;
  };
}

interface Poll {
  id: number;
  question: string;
  options: PollOption[];
  _count: {
    votes: number;
  };
}

interface PollDisplayProps {
  poll: Poll;
  onVote: (optionId: number) => void;
  userVote?: number;
}

const PollOption: React.FC<{
    option: PollOption;
    isVoted: boolean;
    percentage: number;
    onVote: () => void;
    userVote: number | undefined;
  }> = React.memo(({ option, isVoted, percentage, onVote, userVote }) => (
    <motion.button
      onClick={() => !userVote && onVote()}
      className={`w-full text-left py-1.5 bg-secondary/70 transition-all duration-300 rounded-md relative overflow-hidden ${
        isVoted ? 'ring-1 ring-primary' : ''
      }`}
      whileHover={!userVote ? { backgroundColor: 'hsl(var(--secondary))' } : {}}
      whileTap={!userVote ? { scale: 0.98 } : {}}
      disabled={userVote !== undefined}
      aria-pressed={isVoted}
      aria-label={`Vote for ${option.text}`}
    >
      <motion.div
        className="absolute inset-0 bg-primary/20"
        initial={{ width: 0 }}
        animate={{ width: `${percentage}%` }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      />
      <div className="flex justify-between items-center relative px-3">
        <span>{option.text}</span>
        <div className="flex items-center space-x-2">
          {isVoted && <CheckCircle2 className="w-4 h-4 text-primary" aria-hidden="true" />}
          <span className="text-sm text-muted-foreground">
            {percentage > 0 ? `${percentage.toFixed(1)}%` : ''}
          </span>
        </div>
      </div>
    </motion.button>
  ));
  
  PollOption.displayName = 'PollOption';

  const PollDisplay: React.FC<PollDisplayProps> = ({ poll, onVote, userVote }) => {
    const totalVotes = poll._count.votes;
  
    const options = useMemo(() => 
      poll.options.map((option) => {
        const percentage = totalVotes > 0 ? (option._count.votes / totalVotes) * 100 : 0;
        const isVoted = userVote === option.id;
        return { option, percentage, isVoted };
      }),
      [poll.options, totalVotes, userVote]
    );
  
    return (
      <div 
        className="bg-card text-card-foreground rounded-lg p-3.5 md:p-6 shadow-sm"
        role="region" 
        aria-labelledby="poll-question"
      >
        <h3 id="poll-question" className="text-lg font-medium mb-4">{poll.question}</h3>
        <div className="space-y-3">
          {options.map(({ option, percentage, isVoted }) => (
            <PollOption
              key={option.id}
              option={option}
              isVoted={isVoted}
              percentage={percentage}
              onVote={() => onVote(option.id)}
              userVote={userVote}
            />
          ))}
        </div>
        <div className="mt-4 flex justify-between items-center">
          <p className="text-sm text-muted-foreground" aria-live="polite">
            {totalVotes} vote{totalVotes !== 1 ? 's' : ''}
          </p>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">You can only vote once</span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Info className="w-4 h-4 text-muted-foreground cursor-help" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>Your vote is final and cannot be changed.</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>
    );
  };
  
  export default PollDisplay;
  