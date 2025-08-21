import React from 'react';
import './App.css';
import Dashboard from './components/Dashboard';
import FunctionList from './components/FunctionList';
import CodeDisplay from './components/CodeDisplay';
import { useCodeGenerator } from './hooks/useCodeGenerator';

const App = () => {
  const {
    visibleText,
    isFocused,
    charsPerLine,
    generatedFunctions,
    maxBlockLength,
    money,
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
        <FunctionList generatedFunctions={generatedFunctions} />
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