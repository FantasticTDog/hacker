import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { upgradesSpeed, upgradesComplexity } from '../database/upgrades';
import getRandomFunctionName, { FunctionNameParts } from '../utils/getRandomFunctionName';
import formatFunctionName from '../utils/formatFunctionName';
import functionVerbs from '../database/functionVerbs';
import functionNouns from '../database/functionNouns';
import topics from '../database/topics';

const INITIALIZED = true
const INITIAL_SPEED = 20
const INITIAL_COMPLEXITY = 1
const MAX_FUNCTIONS_HISTORY = 250
const MAX_TEXT_LENGTH = 3000

interface GameState {
  // Core game state
  money: number;
  gameWon: boolean;
  isInitialized: boolean;
  
  // Upgrades
  speedUpgradesBought: number;
  complexityUpgradesBought: number;
  charsPerLine: number;
  blockLength: number;
  
  // Code generation
  visibleText: string;
  currentCodeBlock: string;
  currentBlockIndex: number;
  generatedFunctions: Array<{ functionName: string; isPartialMatch: boolean }>;
  totalFunctionsHacked: number;
  
  // Target function
  winningFunction: string;
  winningFunctionParts: FunctionNameParts;
  
  // Data arrays
  functionVerbs: string[];
  functionNouns: string[];
  topics: string[][];
  topicsLevel: number;
  
  // Actions
  completeFunction: (functionName: string) => void;
  buySpeedUpgrade: () => void;
  buyComplexityUpgrade: () => void;
  setInitialized: () => void;
  winGame: () => void;
  addToVisibleText: (text: string) => void;
  setCurrentCodeBlock: (block: string) => void;
  incrementBlockIndex: (amount: number) => void;
  setWinningFunction: (functionName: string) => void;
  setWinningFunctionParts: (parts: FunctionNameParts) => void;
  addGeneratedFunction: (functionName: string, isPartialMatch?: boolean) => void;
  resetBlockIndex: () => void;
  setMoney: (amount: number) => void;
  
  // Array reduction actions
  removeVerb: () => void;
  removeNoun: () => void;
  removeTopic: () => void;
  
  // Level progression
  advanceLevel: () => void;
}

const getMoneyPerFunction = (blockLength: number) => {
  return Math.round(Math.pow(2, blockLength - 1) * 10) / 10;
};

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      // Initial state
      money: 0,
      gameWon: false,
      isInitialized: INITIALIZED,
      speedUpgradesBought: 0,
      complexityUpgradesBought: 0,
      charsPerLine: INITIAL_SPEED,
      blockLength: INITIAL_COMPLEXITY,
      visibleText: '',
      currentCodeBlock: '',
      currentBlockIndex: 0,
      generatedFunctions: [],
      totalFunctionsHacked: 0,
      winningFunction: '',
      winningFunctionParts: { verb: '', topic: '', noun: '' },
      functionVerbs: functionVerbs,
      functionNouns: functionNouns,
      topics: topics[0],
      topicsLevel: 0,

      // Actions
      completeFunction: (functionName: string) => {
        const { blockLength, winningFunction } = get();
        const moneyEarned = getMoneyPerFunction(blockLength);
        
        set((state) => ({
          money: state.money + moneyEarned
        }));
        
        // Check if this is the winning function
        if (functionName === winningFunction) {
          get().advanceLevel();
        }
      },

      buySpeedUpgrade: () => {
        const { speedUpgradesBought, money } = get();
        const nextUpgrade = upgradesSpeed[speedUpgradesBought];
        
        if (nextUpgrade && money >= nextUpgrade.cost) {
          set((state) => ({
            money: state.money - nextUpgrade.cost,
            speedUpgradesBought: state.speedUpgradesBought + 1,
            charsPerLine: state.charsPerLine + nextUpgrade.increaseBy
          }));
        }
      },

      buyComplexityUpgrade: () => {
        const { complexityUpgradesBought, money } = get();
        const nextUpgrade = upgradesComplexity[complexityUpgradesBought];
        
        if (nextUpgrade && money >= nextUpgrade.cost) {
          set((state) => ({
            money: state.money - nextUpgrade.cost,
            complexityUpgradesBought: state.complexityUpgradesBought + 1,
            blockLength: state.blockLength + nextUpgrade.increaseBy
          }));
        }
      },

      setInitialized: () => set({ isInitialized: true }),
      winGame: () => set({ gameWon: true }),
      
      addToVisibleText: (text: string) => set((state) => {
        const newVisibleText = state.visibleText + text;
        
        // Keep only the last MAX_TEXT_LENGTH characters
        const trimmedText = newVisibleText.length > MAX_TEXT_LENGTH 
          ? newVisibleText.slice(-MAX_TEXT_LENGTH)
          : newVisibleText;
        
        return { 
          visibleText: trimmedText 
        };
      }),
      
      setCurrentCodeBlock: (block: string) => set({ currentCodeBlock: block }),
      
      incrementBlockIndex: (amount: number) => set((state) => ({ 
        currentBlockIndex: state.currentBlockIndex + amount 
      })),
      
      setWinningFunction: (functionName: string) => set({ winningFunction: functionName }),
      setWinningFunctionParts: (parts: FunctionNameParts) => set({ winningFunctionParts: parts }),
      
      addGeneratedFunction: (functionName: string, isPartialMatch: boolean = false) => set((state) => {
        const newGeneratedFunctions = [...state.generatedFunctions, { functionName, isPartialMatch }];
        
        // Keep only the last MAX_FUNCTIONS_HISTORY functions
        const trimmedFunctions = newGeneratedFunctions.length > MAX_FUNCTIONS_HISTORY 
          ? newGeneratedFunctions.slice(-MAX_FUNCTIONS_HISTORY)
          : newGeneratedFunctions;
        
        return {
          generatedFunctions: trimmedFunctions,
          totalFunctionsHacked: state.totalFunctionsHacked + 1
        };
      }),
      
      resetBlockIndex: () => set({ currentBlockIndex: 0 }),
      
      setMoney: (amount: number) => set({ money: amount }),
      
      // Array reduction actions
      removeVerb: () => {
        const { winningFunctionParts, functionVerbs } = get();
        // Filter out the winning verb
        const availableVerbs = functionVerbs.filter(v => v !== winningFunctionParts.verb);
        console.log('remaining Verbs:', availableVerbs.length - 1)
        if (availableVerbs.length > 0) {
          // Remove a random verb from the available ones
          const randomIndex = Math.floor(Math.random() * availableVerbs.length);
          const verbToRemove = availableVerbs[randomIndex];
          set((state) => ({
            functionVerbs: state.functionVerbs.filter(v => v !== verbToRemove)
          }));
        }
      },
      
      removeNoun: () => {
        const { winningFunctionParts, functionNouns } = get();
        // Filter out the winning noun
        const availableNouns = functionNouns.filter(n => n !== winningFunctionParts.noun);
        console.log('remaining Nouns:', availableNouns.length - 1)
        if (availableNouns.length > 0) {
          // Remove a random noun from the available ones
          const randomIndex = Math.floor(Math.random() * availableNouns.length);
          const nounToRemove = availableNouns[randomIndex];
          set((state) => ({
            functionNouns: state.functionNouns.filter(n => n !== nounToRemove)
          }));
        }
      },

      removeTopic: () => {
        const { winningFunctionParts, topics } = get();
        // Filter out the winning topic
        const availableTopics = topics.filter(topicArray => 
          !topicArray.includes(winningFunctionParts.topic)
        );
        console.log('remaining Topics:', availableTopics.length - 1)
        if (availableTopics.length > 0) {
          // Remove a random topic array from the available ones
          const randomIndex = Math.floor(Math.random() * availableTopics.length);
          const topicArrayToRemove = availableTopics[randomIndex];
          set((state) => ({
            topics: state.topics.filter(t => t !== topicArrayToRemove)
          }));
        }
            },
      
      advanceLevel: () => {
        const { topicsLevel } = get();
        const newLevel = topicsLevel + 1;
        
        if (topics[newLevel]) {
          const winningParts = getRandomFunctionName(functionVerbs, functionNouns, topics[newLevel]);
          set({
            topicsLevel: newLevel,
            topics: topics[newLevel],
            winningFunction: formatFunctionName(winningParts),
            winningFunctionParts: winningParts,
            functionVerbs: functionVerbs,
            functionNouns: functionNouns,
          });
        }
      },
      
      resetGame: () => {
    const winningParts = getRandomFunctionName(functionVerbs, functionNouns, topics[0]);
    set({
      money: 0,
      gameWon: false,
      // keep this for debugging. Don't want to see the initialization sequence
      isInitialized: INITIALIZED,
      speedUpgradesBought: 0,
      complexityUpgradesBought: 0,
      charsPerLine: INITIAL_SPEED,
      blockLength: INITIAL_COMPLEXITY,
      visibleText: '',
      currentCodeBlock: '',
      currentBlockIndex: 0,
      generatedFunctions: [],
      totalFunctionsHacked: 0,
      winningFunction: formatFunctionName(winningParts),
      winningFunctionParts: winningParts,
      functionVerbs: functionVerbs,
      functionNouns: functionNouns,
      topics: topics[0], // Only store level 0 topics
      topicsLevel: 0,
    });
  },
    }),
    {
      name: 'hacker-game-storage',
      partialize: (state) => ({
        money: state.money,
        speedUpgradesBought: state.speedUpgradesBought,
        complexityUpgradesBought: state.complexityUpgradesBought,
        charsPerLine: state.charsPerLine,
        blockLength: state.blockLength,
        generatedFunctions: state.generatedFunctions,
      })
    }
  )
);
