import React from 'react';

interface DashboardProps {
  totalFunctions: number;
  currentSpeed: number;
  blockLength: number;
  money: number;
  winningFunction: string;
  gameWon: boolean;
}

const Dashboard = ({ totalFunctions, currentSpeed, blockLength, money, winningFunction, gameWon }: DashboardProps) => {
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
      </div>
      <div className="metric">
        <span className="metric-label">Total Functions Hacked:</span>
        <span className="metric-value">{Math.max(totalFunctions - 1, 0)}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Bitcoin Stash:</span>
        <span className="metric-value">₿ {Math.round(money * 100) / 100}</span>
      </div>
      <div className="metric">
        <span className="metric-label">Speed:</span>
        <span className="metric-value">{renderProgressBar(currentSpeed)}</span>
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
    </div>
  );
};

export default Dashboard;
