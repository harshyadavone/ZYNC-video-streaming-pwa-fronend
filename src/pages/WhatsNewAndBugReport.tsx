import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { SparklesIcon } from "../components/ui/Icons";

interface Feature {
  id: string;
  title: string;
  description: string;
  status: "New" | "Coming Soon" | "In Progress";
}

const features: Feature[] = [
  {
    id: "1",
    title: "Video Owner actions",
    description: "Owner of the video can update delete videos.",
    status: "Coming Soon",
  },
  {
    id: "2",
    title: "Dark Mode",
    description: "Toggle between light and dark themes.",
    status: "In Progress",
  },
  {
    id: "3",
    title: "Categories",
    description: "Switch the video categories like youtube.",
    status: "Coming Soon",
  },
];

// interface PollOption {
//   id: string;
//   title: string;
//   votes: number;
// }

// const pollOptions: PollOption[] = [
//   { id: "poll1", title: "Social Sharing", votes: 0 },
//   { id: "poll2", title: "Advanced Analytics", votes: 0 },
//   { id: "poll3", title: "Collaborative Workspaces", votes: 0 },
// ];

const FeatureItem: React.FC<{ feature: Feature }> = ({ feature }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      layout
      className="border-b border-border last:border-b-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.button
        layout
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 text-left focus:outline-none"
      >
        <span className="font-medium text-foreground">{feature.title}</span>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-muted-foreground">
            {feature.status}
          </span>
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight size={16} className="text-muted-foreground" />
          </motion.div>
        </div>
      </motion.button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial="collapsed"
            animate="expanded"
            exit="collapsed"
            variants={{
              expanded: { opacity: 1, height: "auto" },
              collapsed: { opacity: 0, height: 0 },
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <p className="pb-3 text-sm text-muted-foreground">
              {feature.description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

const FeatureList: React.FC = () => (
  <motion.div layout className="space-y-1">
    <AnimatePresence initial={false}>
      {features.map((feature) => (
        <FeatureItem key={feature.id} feature={feature} />
      ))}
    </AnimatePresence>
  </motion.div>
);

// const FeaturePoll: React.FC = () => {
//   const [options, setOptions] = useState(pollOptions);

//   const handleVote = (id: string) => {
//     setOptions(options.map(option =>
//       option.id === id ? { ...option, votes: option.votes + 1 } : option
//     ));
//   };

//   const totalVotes = options.reduce((sum, option) => sum + option.votes, 0);

//   return (
//     <div className="space-y-2">
//       {options.map((option) => (
//         <motion.button
//           key={option.id}
//           onClick={() => handleVote(option.id)}
//           className="w-full text-left focus:outline-none"
//           whileTap={{ scale: 0.99 }}
//         >
//           <div className="flex justify-between text-sm mb-1">
//             <span className="text-foreground">{option.title}</span>
//             <span className="text-muted-foreground">{option.votes} votes</span>
//           </div>
//           <div className="h-2 bg-accent rounded-full overflow-hidden">
//             <motion.div
//               className="h-full bg-primary"
//               initial={{ width: 0 }}
//               animate={{ width: `${(option.votes / Math.max(totalVotes, 1)) * 100}%` }}
//               transition={{ duration: 0.5 }}
//             />
//           </div>
//         </motion.button>
//       ))}
//     </div>
//   );
// };

const WhatsNewAndBugReport: React.FC = () => {
  return (
    <div className="max-w-xl mx-auto p-4 space-y-8 mt-10">
      <section>
        <div className="flex itmes-center justify-start gap-3">
          <SparklesIcon className="text-primary h-7 w-7" />
          <h2 className="text-xl font-semibold text-foreground mb-4">
            What's New
          </h2>
        </div>
        <FeatureList />
      </section>

      {/* <section>
        <h2 className="text-xl font-semibold text-foreground mb-4">Feature Poll</h2>
        <FeaturePoll />
      </section> */}

      <footer className="pt-4 border-t border-border">
        <motion.button
          onClick={() =>
            window.open("https://instagram.com/harshyadavone", "_blank")
          }
          className="w-full py-2 text-sm text-primary bg-primary/5 rounded-md hover:bg-primary/10 transition-colors"
          whileTap={{ scale: 0.99 }}
        >
          Report a Bug
        </motion.button>
      </footer>
    </div>
  );
};

export default WhatsNewAndBugReport;
