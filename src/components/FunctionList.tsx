import React from 'react';
interface FunctionListProps {
  generatedFunctions: string[];
}

const FunctionList = ({ generatedFunctions }: FunctionListProps) => {
  return (
    <div className="function-list">
      <h3>Completed Hacks:</h3>
      {generatedFunctions.map((funcName, index) => (
        <div key={index} className={`function-item ${index === generatedFunctions.length - 1 ? 'wip' : 'completed'}`}>
          <span className="status-indicator">
            {index === generatedFunctions.length - 1 ? '🔄' : '✅'}
          </span>
          <span className="function-name">{funcName}</span>
        </div>
      ))}
    </div>
  );
};

export default FunctionList;
