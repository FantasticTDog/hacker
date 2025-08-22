import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { upgradesSpeed, upgradesComplexity } from '../database/upgrades';
import topics from '../database/topics';
import functionVerbs from '../database/functionVerbs';
import functionNouns from '../database/functionNouns';

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
  generatedFunctions: string[];
  
  // Target function
  winningFunction: string;
  
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
  addGeneratedFunction: (functionName: string) => void;
  resetBlockIndex: () => void;
  setMoney: (amount: number) => void;
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
      isInitialized: false,
      speedUpgradesBought: 0,
      complexityUpgradesBought: 0,
      charsPerLine: 1,
      blockLength: 1,
      visibleText: '',
      currentCodeBlock: '',
      currentBlockIndex: 0,
      generatedFunctions: [],
      winningFunction: '',

      // Actions
      completeFunction: (functionName: string) => {
        const { blockLength, winningFunction, gameWon } = get();
        const moneyEarned = getMoneyPerFunction(blockLength);
        
        set((state) => ({
          money: state.money + moneyEarned,
          gameWon: !gameWon && functionName === winningFunction
        }));
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
      
      addToVisibleText: (text: string) => set((state) => ({ 
        visibleText: state.visibleText + text 
      })),
      
      setCurrentCodeBlock: (block: string) => set({ currentCodeBlock: block }),
      
      incrementBlockIndex: (amount: number) => set((state) => ({ 
        currentBlockIndex: state.currentBlockIndex + amount 
      })),
      
      setWinningFunction: (functionName: string) => set({ winningFunction: functionName }),
      
      addGeneratedFunction: (functionName: string) => set((state) => ({
        generatedFunctions: [...state.generatedFunctions, functionName]
      })),
      
      resetBlockIndex: () => set({ currentBlockIndex: 0 }),
      
      setMoney: (amount: number) => set({ money: amount }),
  
  // Reset all state to initial values
  resetGame: () => {
    // Generate a new winning function for the reset game
    const generateWinningFunction = () => {
      const randomTopic = topics[Math.floor(Math.random() * topics.length)];
      const randomTopicWord = randomTopic[Math.floor(Math.random() * randomTopic.length)];
      const capitalizedTopicWord = randomTopicWord.charAt(0).toUpperCase() + randomTopicWord.slice(1);
      const randomVerb = functionVerbs[Math.floor(Math.random() * functionVerbs.length)];
      const randomNoun = functionNouns[Math.floor(Math.random() * functionNouns.length)];
      const capitalizedNoun = randomNoun.charAt(0).toUpperCase() + randomNoun.slice(1);
      return `${randomVerb}${capitalizedTopicWord}${capitalizedNoun}`;
    };

    set({
      money: 0,
      gameWon: false,
      isInitialized: false,
      speedUpgradesBought: 0,
      complexityUpgradesBought: 0,
      charsPerLine: 1,
      blockLength: 1,
      visibleText: '',
      currentCodeBlock: '',
      currentBlockIndex: 0,
      generatedFunctions: [],
      winningFunction: generateWinningFunction(),
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
