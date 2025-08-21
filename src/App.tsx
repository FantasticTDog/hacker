import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import FunctionList from './components/FunctionList';
import CodeDisplay from './components/CodeDisplay';
import Shop from './components/Shop';
import { useCodeGenerator } from './hooks/useCodeGenerator';

const App = () => {
  const {
    visibleText,
    isFocused,
    charsPerLine,
    generatedFunctions,
    maxBlockLength,
    money,
    speedUpgradesBought,
    complexityUpgradesBought,
    handleClick,
    handleBlur
  } = useCodeGenerator();

  return (
    <div className="app">
      <Dashboard 
        totalFunctions={generatedFunctions.length}
        currentSpeed={charsPerLine}
        maxBlockLength={maxBlockLength}
        money={money}
      />
      <div className="main-content">
        <div className="left-panel">
          <FunctionList generatedFunctions={generatedFunctions} />
          <Shop 
            speedUpgradesBought={speedUpgradesBought}
            complexityUpgradesBought={complexityUpgradesBought}
            money={money}
          />
        </div>
        <CodeDisplay 
          visibleText={visibleText}
          isFocused={isFocused}
          charsPerLine={charsPerLine}
          onFocus={handleClick}
          onBlur={handleBlur}
        />
      </div>
    </div>
  );
};

export default App;