import { useState, useEffect, useCallback } from 'react';
import { useGameStore } from '../stores/gameStore';
import { useProbability } from './useProbability';
import getRandomFunctionName, { FunctionNameParts } from '../utils/getRandomFunctionName';
import generateCodeBlock from '../utils/generateCodeBlock';
import formatFunctionName from '../utils/formatFunctionName';

export const useCodeGenerator = () => {
  const [isFocused, setIsFocused] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [currentFunctionParts, setCurrentFunctionParts] = useState<FunctionNameParts | null>(null);

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
    winningFunctionParts,
    functionVerbs,
    functionNouns,
    topics,
    completeFunction,
    buySpeedUpgrade,
    buyComplexityUpgrade,
    setInitialized,
    addToVisibleText,
    setCurrentCodeBlock,
    incrementBlockIndex,
    setWinningFunction,
    setWinningFunctionParts,
    addGeneratedFunction,
    resetBlockIndex,
  } = useGameStore();

  const probability = useProbability();

  const compareFunctionParts = useCallback((completedParts: FunctionNameParts) => {
    if (!winningFunctionParts) return;
    
    const matches: string[] = [];
    
    if (completedParts.verb === winningFunctionParts.verb) {
      matches.push(`Verb: "${completedParts.verb}"`);
    }
    
    if (completedParts.topic === winningFunctionParts.topic) {
      matches.push(`Topic: "${completedParts.topic}"`);
    }
    
    if (completedParts.noun === winningFunctionParts.noun) {
      matches.push(`Noun: "${completedParts.noun}"`);
    }
    
    if (matches.length > 0) {
      console.log(`🎯 Partial match found: ${matches.join(', ')}`);
    }
  }, [winningFunctionParts]);

  useEffect(() => {
    const winningParts = getRandomFunctionName(functionVerbs, functionNouns, topics);
    setWinningFunction(formatFunctionName(winningParts));
    setWinningFunctionParts(winningParts);
  }, [setWinningFunction, setWinningFunctionParts, functionVerbs, functionNouns, topics]);

  const startNewSnippet = useCallback(() => {
    if (
      currentCodeBlock.length === 0 ||
      currentBlockIndex >= currentCodeBlock.length
    ) {
      const { codeBlockString, functionName, functionParts } = generateCodeBlock(
        visibleText,
        blockLength,
        functionVerbs,
        functionNouns,
        topics
      );
      setCurrentCodeBlock(codeBlockString);
      resetBlockIndex();
      addGeneratedFunction(functionName);
      setCurrentFunctionParts(functionParts);

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
    visibleText,
    blockLength,
    resetBlockIndex,
    setCurrentCodeBlock,
    setCurrentFunctionParts,
    functionVerbs,
    functionNouns,
    topics,
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

        // Compare function parts with winning function
        if (currentFunctionParts) {
          compareFunctionParts(currentFunctionParts);
        }

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
    currentFunctionParts,
    compareFunctionParts,
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
