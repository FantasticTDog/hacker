import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import FunctionList from './components/FunctionList';
import CodeDisplay from './components/CodeDisplay';
import Shop from './components/Shop';
import InitializationSequence from './components/InitializationSequence';
import LevelUpModal from './components/LevelUpModal';
import { useCodeGenerator } from './hooks/useCodeGenerator';
import { useGameStore } from './stores/gameStore';

const App = () => {
  const {
    visibleText,
    isFocused,
    charsPerLine,
    isInitialized,
    handleInitializationComplete,
    handleClick,
    handleBlur,
  } = useCodeGenerator();

  const { 
    winningFunction, 
    showLevelUpModal, 
    levelUpData,
    hideLevelUpModal 
  } = useGameStore();

  if (!isInitialized) {
    return <InitializationSequence 
      onComplete={handleInitializationComplete} 
      targetFunction={winningFunction}
    />;
  }

  return (
    <div className="app">
      <Dashboard />
      <div className="main-content">
        <div className="left-panel">
          <FunctionList />
          <Shop />
        </div>
        <CodeDisplay 
          visibleText={visibleText}
          isFocused={isFocused}
          charsPerLine={charsPerLine}
          onFocus={handleClick}
          onBlur={handleBlur}
        />
      </div>
      
      <LevelUpModal
        isVisible={showLevelUpModal}
        hackedFunction={levelUpData?.hackedFunction || ''}
        newLevel={levelUpData?.newLevel || 1}
        onContinue={hideLevelUpModal}
      />
    </div>
  );
};

export default App;