import React, { useEffect, useRef } from 'react';
import { useGameStore } from '../stores/gameStore';

const FunctionList = () => {
  const { generatedFunctions } = useGameStore();
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [generatedFunctions]);

  return (
    <div className="function-list">
      <h3>Hacked Functions:</h3>
      <div className="function-list-content" ref={listRef}>
        {generatedFunctions.map((funcName, index) => (
          <div key={index} className={`function-item ${index === generatedFunctions.length - 1 ? 'wip' : 'completed'}`}>
            <span className="status-indicator">
              {index === generatedFunctions.length - 1 ? '🔄' : '✅'}
            </span>
            <span className="function-name">{funcName}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FunctionList;
