import React, { useState, useEffect } from 'react';
import './App.css';
import codeSnippets from './database/codeSnippets';
import topics from './database/topics';
import functionVerbs from './database/functionVerbs';
import functionNouns from './database/functionNouns';

const App = () => {
  const [visibleText, setVisibleText] = useState('');
  const [currentCodeBlock, setCurrentCodeBlock] = useState<string>('');
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [charsPerLine, setCharsPerLine] = useState(1);
  const [maxBlockLength, setMaxBlockLength] = useState(3);
  const [currentTopicWords, setCurrentTopicWords] = useState<string[]>([]);
  const [generatedFunctions, setGeneratedFunctions] = useState<string[]>([]);

  const DISPLAY_FIELD_ID = 'hacker-display-field';

  const getRandomTopicWords = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const shuffled = [...randomTopic].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3); // Get 3 random words from the topic
  };

  const generateRandomSnippet = (topicWords: string[]) => {
    const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    
    // Use apply to handle variable parameter counts
    return randomSnippet.apply(null, topicWords);
  };

  const generateFunctionName = (topicWord: string) => {
    const capitalizedTopicWord = topicWord.charAt(0).toUpperCase() + topicWord.slice(1);
    const randomNoun = functionNouns[Math.floor(Math.random() * functionNouns.length)];
    const capitalizedNoun = randomNoun.charAt(0).toUpperCase() + randomNoun.slice(1);
    const functionName = `${functionVerbs[Math.floor(Math.random() * functionVerbs.length)]}${capitalizedTopicWord}${capitalizedNoun}`;
    const functionString = `\nfunction ${functionName}() {`;
    
    // Add to tracking array
    setGeneratedFunctions(prev => [...prev, functionName]);
    
    return functionString;
  };

  const generateCodeBlock = () => {
    const topicWords = getRandomTopicWords();
    const blockSize = Math.floor(Math.random() * maxBlockLength) + 1;
    const codeBlock: string[] = [];
    
    for (let i = 0; i < blockSize; i++) {
      const snippet = generateRandomSnippet(topicWords);
      codeBlock.push(snippet);
    }
    const functionName = generateFunctionName(topicWords[0]);
    const codeBlockString = `${functionName}\n${codeBlock.join("\n")}\n}`;
    return { topicWords, codeBlockString };
  };

  const startNewSnippet = () => {
    // If we're starting fresh or finished the current block
    if (currentCodeBlock.length === 0 || currentBlockIndex >= currentCodeBlock.length) {
      const { topicWords, codeBlockString } = generateCodeBlock();
      setCurrentTopicWords(topicWords);
      setCurrentCodeBlock(codeBlockString);
      setCurrentBlockIndex(0);
    }
    setIsTyping(true);
  };

  const typeNextCharacter = () => {
    if (currentBlockIndex < currentCodeBlock.length) {
      // Add multiple characters based on charsPerLine
      const remainingChars = currentCodeBlock.length - currentBlockIndex;
      const charsToAdd = Math.min(charsPerLine, remainingChars);
      const newChars = currentCodeBlock.substring(currentBlockIndex, currentBlockIndex + charsToAdd);
      
      setVisibleText(prev => prev + newChars);
      setCurrentBlockIndex(prev => prev + charsToAdd);
    } else {
      // Block is complete, add newline and stop typing
      setVisibleText(prev => prev + '\n');
      setIsTyping(false);
    }
  };

  // Auto-scroll to bottom when visibleText changes
  useEffect(() => {
    const displayElement = document.getElementById(DISPLAY_FIELD_ID);
    if (displayElement) {
      displayElement.scrollTop = displayElement.scrollHeight;
    }
  }, [visibleText]);

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
  }, [isFocused, isTyping, currentBlockIndex]);

  return (
    <div className="app">
      <div className="function-list">
        <h3>Generated Functions:</h3>
        {generatedFunctions.map((funcName, index) => (
          <div key={index} className={`function-item ${index === generatedFunctions.length - 1 ? 'wip' : 'completed'}`}>
            <span className="status-indicator">
              {index === generatedFunctions.length - 1 ? '🔄' : '✅'}
            </span>
            <span className="function-name">{funcName}</span>
          </div>
        ))}
      </div>
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