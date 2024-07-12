import React from "react";

// Mock data
const mockData = [
  { id: 1, label: "Music" },
  { id: 2, label: "Gaming" },
  { id: 3, label: "Comedy" },
  { id: 4, label: "Technology" },
  { id: 5, label: "Travel" },
  { id: 6, label: "Food & Cooking" },
  { id: 7, label: "Sports" },
  { id: 8, label: "News & Politics" },
  { id: 9, label: "Education" },
  { id: 10, label: "Fashion & Beauty" },
  { id: 11, label: "Health & Fitness" },
  { id: 12, label: "Science & Innovation" },
  { id: 13, label: "Art & Culture" },
  { id: 14, label: "Entertainment" },
  { id: 15, label: "Lifestyle" },
  { id: 16, label: "DIY & Crafts" },
  { id: 17, label: "Business & Finance" },
  { id: 18, label: "Pets & Animals" },
  { id: 19, label: "Family & Parenting" },
  { id: 20, label: "Home & Garden" },
];

const SuggestionBar: React.FC = () => {
  return (
    <div className="relative">
      <div className="absolute top-0 bottom-0 left-0 w-12 bg-gradient-to-r from-[#0f0f0f] to-transparent z-999 pointer-events-none "></div>
      <div className="absolute top-0 bottom-0 right-0 w-12 bg-gradient-to-l from-[#0f0f0f] to-transparent pointer-events-none z-10"></div>
      <div className="flex space-x-3 overflow-x-scroll mb-4 py-2 px-2 no-scrollbar ">
        {mockData.map((suggestion) => (
          <button
            key={suggestion.id}
            className="px-3 py-1.5 rounded-lg bg-card hover:bg-[#3f3f3f] transition-colors duration-200 text-white text-sm font-medium whitespace-nowrap"
          >
            {suggestion.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SuggestionBar;
