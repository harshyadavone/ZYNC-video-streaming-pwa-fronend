// components/TabNavigation.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface TabNavigationProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="border-b">
      <nav className="flex px-4" role="tablist">
        {tabs.map((tab) => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeTab === tab}
            aria-controls={`${tab.toLowerCase()}-panel`}
            className={`px-4 py-2 font-medium relative ${
              activeTab === tab
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => onTabChange(tab)}
          >
            {tab}
            {activeTab === tab && (
              <motion.div
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                layoutId="activeTab"
                initial={false}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 40,
                }}
              />
            )}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;