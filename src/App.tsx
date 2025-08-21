import React, { useState, useEffect } from 'react';
import './App.css';
import codeSnippets from './database/codeSnippets';
import topics from './database/topics';

const App = () => {
  const [visibleText, setVisibleText] = useState('');
  const [currentSnippet, setCurrentSnippet] = useState('');
  const [currentSnippetIndex, setCurrentSnippetIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [charsPerLine, setCharsPerLine] = useState(1);

  const DISPLAY_FIELD_ID = 'hacker-display-field';

  const getRandomTopicWords = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const shuffled = [...randomTopic].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3); // Get 3 random words from the topic
  };

  const generateRandomSnippet = () => {
    const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    const topicWords = getRandomTopicWords();
    
    // Call the snippet function with the topic words
    // Use apply to handle variable parameter counts
    return randomSnippet.apply(null, topicWords);
  };

  const startNewSnippet = () => {
    const newSnippet = generateRandomSnippet();
    setCurrentSnippet(newSnippet);
    setCurrentSnippetIndex(0);
    setIsTyping(true);
  };

  const typeNextCharacter = () => {
    if (currentSnippetIndex < currentSnippet.length) {
      // Add multiple characters based on charsPerLine
      const remainingChars = currentSnippet.length - currentSnippetIndex;
      const charsToAdd = Math.min(charsPerLine, remainingChars);
      const newChars = currentSnippet.substring(currentSnippetIndex, currentSnippetIndex + charsToAdd);
      
      setVisibleText(prev => prev + newChars);
      setCurrentSnippetIndex(prev => prev + charsToAdd);
    } else {
      // Current snippet is complete, add newline and start new snippet
      setVisibleText(prev => prev + '\n');
      setIsTyping(false);
    }
  };

  const handleKeyPress = (event) => {
    // Handle charsPerLine adjustment
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      // setCharsPerLine(prev => Math.min(prev + 1, 10)); // Max 10 chars per line
      return;
    }
    
    if (event.key === '-') {
      event.preventDefault();
      // setCharsPerLine(prev => Math.max(prev - 1, 1)); // Min 1 char per line
      return;
    }
    
    // Only respond to alphanumeric keys and space
    if (/^[a-zA-Z0-9\s]$/.test(event.key)) {
      if (!isTyping) {
        // Start a new snippet
        startNewSnippet();
      } else {
        // Reveal the next character(s) of the current snippet
        typeNextCharacter();
      }
    }
  };

  const handleClick = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (isFocused) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isFocused, isTyping, currentSnippetIndex]);

  return (
    <div className="app">
      <div 
        id={DISPLAY_FIELD_ID}
        className={`hacker-display ${isFocused ? 'focused' : ''}`}
        onClick={handleClick}
        onBlur={handleBlur}
        tabIndex={0}
      >
        {visibleText || 'Click here and start typing...'}
        {isFocused && <span className="cursor">|</span>}
        {isFocused && (
          <div className="chars-per-line-indicator">
            Chars per keystroke: {charsPerLine}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;