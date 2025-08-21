import React from 'react';
interface CodeDisplayProps {
  visibleText: string;
  isFocused: boolean;
  charsPerLine: number;
  onFocus: () => void;
  onBlur: () => void;
}

const CodeDisplay = ({ visibleText, isFocused, charsPerLine, onFocus, onBlur }: CodeDisplayProps) => {
  return (
    <div 
      id="hacker-display-field"
      className={`hacker-display ${isFocused ? 'focused' : ''}`}
      onClick={onFocus}
      onBlur={onBlur}
      tabIndex={0}
    >
      {visibleText || 'Click here and start typing...'}
      {isFocused && <span className="cursor">|</span>}
    </div>
  );
};

export default CodeDisplay;
