import { useState, useEffect, useCallback } from 'react';
import codeSnippets from '../database/codeSnippets';
import topics from '../database/topics';
import { useGameStore } from '../stores/gameStore';
import { useProbability } from './useProbability';
import getRandomFunctionName from '../utils/getRandomFunctionName';
import { formatFunctionName } from '../utils/formatFunctionName';

export const useCodeGenerator = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const DISPLAY_FIELD_ID = 'hacker-display-field';

  // Get state from Zustand store
  const {
    money,
    gameWon,
    isInitialized,
    speedUpgradesBought,
    complexityUpgradesBought,
    charsPerLine,
    blockLength,
    visibleText,
    currentCodeBlock,
    currentBlockIndex,
    generatedFunctions,
    winningFunction,
    completeFunction,
    buySpeedUpgrade,
    buyComplexityUpgrade,
    setInitialized,
    addToVisibleText,
    setCurrentCodeBlock,
    incrementBlockIndex,
    setWinningFunction,
    addGeneratedFunction,
    resetBlockIndex,
  } = useGameStore();

  // Get probability calculation
  const probability = useProbability();

  // Generate winning function on component mount
  useEffect(() => {
    setWinningFunction(formatFunctionName(getRandomFunctionName()));
  }, [setWinningFunction]);

  const getRandomTopicWords = () => {
    const randomTopic = topics[Math.floor(Math.random() * topics.length)];
    const shuffled = [...randomTopic].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  };

  const generateRandomSnippet = (topicWords: string[]) => {
    const randomSnippet =
      codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    return randomSnippet.apply(null, topicWords);
  };

  const generateCodeBlock = () => {
    const topicWords = getRandomTopicWords();
    const codeBlock: string[] = [];

    // Check if this is the very first function (when visibleText is empty)
    const isFirstFunction = visibleText.length === 0;

    // Generate a function name and add it to the block
    const functionParts = getRandomFunctionName(topicWords[0]);
    const functionName = formatFunctionName(functionParts);
    const functionString = `${
      isFirstFunction ? '' : '\n'
    }function ${functionName}() {`;

    codeBlock.push(functionString);

    for (let i = 0; i < blockLength; i++) {
      const snippet = generateRandomSnippet(topicWords);
      codeBlock.push(snippet);
    }

    // Close the function
    codeBlock.push('}');

    const codeBlockString = codeBlock.join('\n');
    return { codeBlockString, functionName };
  };

  const startNewSnippet = useCallback(() => {
    if (
      currentCodeBlock.length === 0 ||
      currentBlockIndex >= currentCodeBlock.length
    ) {
      const { codeBlockString, functionName } = generateCodeBlock();
      setCurrentCodeBlock(codeBlockString);
      resetBlockIndex();
      // Add the function name to the list when we start generating it
      addGeneratedFunction(functionName);

      // Immediately start typing the first characters
      const charsToAdd = Math.min(charsPerLine, codeBlockString.length);
      const newChars = codeBlockString.substring(0, charsToAdd);
      addToVisibleText(newChars);
      incrementBlockIndex(charsToAdd);
    }
    setIsTyping(true);
  }, [
    currentCodeBlock.length,
    currentBlockIndex,
    charsPerLine,
    addGeneratedFunction,
    addToVisibleText,
    incrementBlockIndex,
  ]);

  const typeNextCharacter = useCallback(() => {
    if (currentBlockIndex < currentCodeBlock.length) {
      const remainingChars = currentCodeBlock.length - currentBlockIndex;
      const charsToAdd = Math.min(charsPerLine, remainingChars);
      const newChars = currentCodeBlock.substring(
        currentBlockIndex,
        currentBlockIndex + charsToAdd
      );

      addToVisibleText(newChars);
      incrementBlockIndex(charsToAdd);
    } else {
      addToVisibleText('\n');
      setIsTyping(false);

      // Complete the function (this handles money and win condition)
      if (generatedFunctions.length > 0) {
        const lastFunction = generatedFunctions[generatedFunctions.length - 1];
        completeFunction(lastFunction);

        // Check win condition
        if (lastFunction === winningFunction && !gameWon) {
          alert(
            `🎉 HACKER VICTORY! You successfully hacked: ${winningFunction}! 🎉`
          );
        }
      }
    }
  }, [
    currentBlockIndex,
    currentCodeBlock,
    charsPerLine,
    generatedFunctions,
    winningFunction,
    gameWon,
    addToVisibleText,
    incrementBlockIndex,
    completeFunction,
  ]);

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (/^[a-zA-Z0-9\s]$/.test(event.key)) {
        if (!isTyping) {
          startNewSnippet();
        } else {
          typeNextCharacter();
        }
      }
    },
    [isTyping, startNewSnippet, typeNextCharacter]
  );

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

  const handleInitializationComplete = useCallback(() => {
    setInitialized();
  }, [setInitialized]);

  return {
    visibleText,
    isFocused,
    charsPerLine,
    generatedFunctions,
    blockLength,
    money,
    speedUpgradesBought,
    complexityUpgradesBought,
    winningFunction,
    gameWon,
    isInitialized,
    buySpeedUpgrade,
    buyComplexityUpgrade,
    handleInitializationComplete,
    handleClick,
    handleBlur,
    probability,
  };
};
