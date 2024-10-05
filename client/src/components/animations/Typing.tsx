import React from "react";

const TypingIndicator: React.FC = () => {
  return (
    <div className="flex space-x-1.5 m-2 p-2 rounded-full bg-gray-100 max-w-fit">
      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce-1"></div>
      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce-2"></div>
      <div className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce-3"></div>
    </div>
  );
};

export default TypingIndicator;
