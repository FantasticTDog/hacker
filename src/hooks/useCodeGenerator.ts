import { useState, useEffect, useCallback } from 'react';
import codeSnippets from '../database/codeSnippets';
import topics from '../database/topics';
import functionVerbs from '../database/functionVerbs';
import functionNouns from '../database/functionNouns';

const INITIL_SPEED = 1;
const INITIAL_COMPLEXITY = 3;

export const useCodeGenerator = () => {
  const [visibleText, setVisibleText] = useState('');
  const [currentCodeBlock, setCurrentCodeBlock] = useState<string>('');
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [charsPerLine, setCharsPerLine] = useState(INITIL_SPEED);
  const [currentTopicWords, setCurrentTopicWords] = useState<string[]>([]);
  const [generatedFunctions, setGeneratedFunctions] = useState<string[]>([]);
  const [maxBlockLength, setMaxBlockLength] = useState(INITIAL_COMPLEXITY);

  const DISPLAY_FIELD_ID = 'hacker-display-field';

  const getRandomTopicWords = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const shuffled = [...randomTopic].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const generateRandomSnippet = (topicWords: string[]) => {
    const randomSnippet = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    return randomSnippet.apply(null, topicWords);
  };

  const generateFunctionName = (topicWord: string) => {
    const capitalizedTopicWord = topicWord.charAt(0).toUpperCase() + topicWord.slice(1);
    const randomNoun = functionNouns[Math.floor(Math.random() * functionNouns.length)];
    const capitalizedNoun = randomNoun.charAt(0).toUpperCase() + randomNoun.slice(1);
    const functionName = `${functionVerbs[Math.floor(Math.random() * functionVerbs.length)]}${capitalizedTopicWord}${capitalizedNoun}`;
    const functionString = `\nfunction ${functionName}() {`;
    
    setGeneratedFunctions(prev => [...prev, functionName]);
    
    return functionString;
  };

  const generateCodeBlock = () => {
    const topicWords = getRandomTopicWords();
    const blockSize = Math.floor(Math.random() * maxBlockLength) + 1; // 1 to maxBlockLength
    const codeBlock: string[] = [];
    
    // Generate a function name and add it to the block
    const functionName = generateFunctionName(topicWords[0]);
    codeBlock.push(functionName);
    
    for (let i = 0; i < blockSize; i++) {
      const snippet = generateRandomSnippet(topicWords);
      codeBlock.push(snippet);
    }
    
    // Close the function
    codeBlock.push('}');
    
    const codeBlockString = codeBlock.join("\n");
    return { topicWords, codeBlockString };
  };

  const startNewSnippet = useCallback(() => {
    if (currentCodeBlock.length === 0 || currentBlockIndex >= currentCodeBlock.length) {
      const { topicWords, codeBlockString } = generateCodeBlock();
      setCurrentTopicWords(topicWords);
      setCurrentCodeBlock(codeBlockString);
      setCurrentBlockIndex(0);
    }
    setIsTyping(true);
  }, [currentCodeBlock.length, currentBlockIndex]);

  const typeNextCharacter = useCallback(() => {
    if (currentBlockIndex < currentCodeBlock.length) {
      const remainingChars = currentCodeBlock.length - currentBlockIndex;
      const charsToAdd = Math.min(charsPerLine, remainingChars);
      const newChars = currentCodeBlock.substring(currentBlockIndex, currentBlockIndex + charsToAdd);
      
      setVisibleText(prev => prev + newChars);
      setCurrentBlockIndex(prev => prev + charsToAdd);
    } else {
      setVisibleText(prev => prev + '\n');
      setIsTyping(false);
    }
  }, [currentBlockIndex, currentCodeBlock, charsPerLine]);

  const handleKeyPress = useCallback((event: KeyboardEvent) => {
    if (event.key === '+' || event.key === '=') {
      event.preventDefault();
      setCharsPerLine(prev => Math.min(prev + 1, 10));
      return;
    }
    
    if (event.key === '-') {
      event.preventDefault();
      setCharsPerLine(prev => Math.max(prev - 1, 1));
      return;
    }
    
    if (/^[a-zA-Z0-9\s]$/.test(event.key)) {
      if (!isTyping) {
        startNewSnippet();
      } else {
        typeNextCharacter();
      }
    }
  }, [isTyping, startNewSnippet, typeNextCharacter]);

  const handleClick = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    const displayElement = document.getElementById(DISPLAY_FIELD_ID);
    if (displayElement) {
      displayElement.scrollTop = displayElement.scrollHeight;
    }
  }, [visibleText]);

  useEffect(() => {
    if (isFocused) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isFocused, handleKeyPress]);

  return {
    visibleText,
    isFocused,
    charsPerLine,
    generatedFunctions,
    maxBlockLength,
    handleClick,
    handleBlur
  };
};
