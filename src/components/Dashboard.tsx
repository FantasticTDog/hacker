import React from 'react';
import { useGameStore } from '../stores/gameStore';
import { useProbability } from '../hooks/useProbability';

const Dashboard = () => {
  const { 
    generatedFunctions, 
    charsPerLine, 
    blockLength, 
    money, 
    winningFunction, 
    gameWon,
    resetGame
  } = useGameStore();
  
  const probability = useProbability();
  const renderProgressBar = (value: number, maxValue: number = 20) => {
    const segments = Math.min(value, maxValue);
    return (
      <div className="progress-bar">
        {Array.from({ length: maxValue }, (_, i) => (
          <div 
            key={i} 
            className={`progress-segment ${i < segments ? 'filled' : 'empty'}`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="dashboard">
      <h3>Hacker Performance Dashboard</h3>
      <div className="metric">
        <span className="metric-label">Target Function:</span>
        <span className="metric-value target-function">{winningFunction || 'Loading...'}</span>
        <span className="metric-value probability">{probability.percentage}% (1 / {probability.totalCombinations})</span>
      </div>
      <div className="metric">
        <span className="metric-label">Total Functions Hacked:</span>
        <span className="metric-value">{Math.max(generatedFunctions.length - 1, 0)}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Bitcoin Stash:</span>
        <span className="metric-value">₿ {Math.round(money * 100) / 100}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Speed:</span>
        <span className="metric-value">{renderProgressBar(charsPerLine)}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Complexity:</span>
        <span className="metric-value">{renderProgressBar(blockLength)}</span>
      </div>
      {gameWon && (
        <div className="victory-message">
          🎉 MISSION ACCOMPLISHED! 🎉
        </div>
      )}
      <div className="dashboard-actions">
        <button 
          className="reset-button" 
          onClick={() => {
            if (window.confirm('Are you sure you want to reset the game? This will clear all progress.')) {
              resetGame();
            }
          }}
        >
          🔄 Reset Game
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
