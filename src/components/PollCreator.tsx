import React, { useState } from "react";
import { Button } from "./ui/button";
import { X, Plus } from "lucide-react";
import { toast } from "sonner";

interface PollCreatorProps {
  onCreatePoll: (pollData: { question: string; options: string[] }) => void;
  onClose: () => void;
}

const PollCreator: React.FC<PollCreatorProps> = ({ onCreatePoll, onClose }) => {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleAddOption = () => {
    if (options.length < 4) {
      setOptions([...options, ""]);
    } else {
      toast.error("You can add up to 4 options.");
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    } else {
      toast.error("You need at least 2 options.");
    }
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const filteredOptions = options.filter((option) => option.trim() !== "");
    if (!question.trim()) {
      toast.error("Please enter a question.");
      return;
    }
    if (filteredOptions.length < 2) {
      toast.error("Please provide at least two options.");
      return;
    }
    onCreatePoll({
      question,
      options: filteredOptions,
    });
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 group">
      <div>
        {/* <label htmlFor="question" className="block text-sm font-medium mb-1">
          Poll Question
        </label> */}
        <input
          id="question"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter your poll question"
          className="flex-grow py-2.5 w-full  border focus:border-gray-800 pl-3 focus:border-l-green-600 p-2 bg-inherit rounded-xl text-secondary-foreground resize-none focus:outline-none text-sm transition-colors duration-300"
          required
        />
      </div>
      {options.map((option, index) => (
        <div key={index} className="flex items-center space-x-2">
          <input
            value={option}
            onChange={(e) => handleOptionChange(index, e.target.value)}
            placeholder={`Option ${index + 1}`}
            className="flex-grow py-2.5 w-full  border focus:border-gray-800 pl-3 focus:border-l-green-600 p-2 bg-inherit rounded-xl text-secondary-foreground resize-none focus:outline-none text-sm transition-colors duration-300"
            required
          />
          {index > 1 && (
            <Button
              type="button"
              onClick={() => handleRemoveOption(index)}
              variant="ghost"
              size="icon"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      ))}
      <div className="flex justify-between">
        <Button
          variant={"link"}
          type="button"
          onClick={handleAddOption}
          className="flex items-center underline-none  p-2 text-sm "
          disabled={options.length >= 4}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Option
        </Button>
        <button
            type="submit"
        className="max-w-[250px] bg-primary/70 rounded-lg text-white/90 font-medium  p-2 px-8 "
        >
            Create Poll
        </button>
      </div>
    </form>
  );
};

export default PollCreator;
