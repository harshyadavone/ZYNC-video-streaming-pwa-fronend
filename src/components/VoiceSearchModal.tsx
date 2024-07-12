import React from "react";
import { Mic } from "lucide-react";

interface VoiceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const VoiceSearchModal: React.FC<VoiceSearchModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
      <div className="bg-gray-900 p-8 rounded-2xl shadow-lg text-center relative overflow-hidden w-80">
        <h2 className="text-xl mb-8 font-normal text-gray-200">Listening...</h2>
        <div className="mb-8 relative">
          <div className="relative z-10 flex justify-center items-center">
            <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center shadow-lg">
              <Mic size={36} className="text-white" />
            </div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-32 h-32 bg-blue-500 bg-opacity-20 rounded-full animate-pulse"></div>
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-40 h-40 border-4 border-blue-500 rounded-full animate-ping opacity-75"></div>
          </div>
        </div>
        <p className="text-sm text-gray-400 mb-8">Speak now</p>
        <div className="flex justify-center space-x-1 mb-8">
          {[0, 1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-1 bg-blue-400 rounded-full"
              style={{
                height: '24px',
                animation: `soundWave 1.2s infinite ease-in-out ${i * 0.1}s`,
              }}
            ></div>
          ))}
        </div>
        <button
          onClick={onClose}
          className="px-6 py-2 bg-gray-800 text-gray-200 rounded-full hover:bg-gray-700 transition-colors text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default VoiceSearchModal;