import React from 'react';

interface LevelUpModalProps {
  isVisible: boolean;
  hackedFunction: string;
  newLevel: number;
  onContinue: () => void;
}

const LevelUpModal = ({ isVisible, hackedFunction, newLevel, onContinue }: LevelUpModalProps) => {
  if (!isVisible) return null;

  return (
    <div className="level-up-modal-overlay">
      <div className="level-up-modal">
        <div className="modal-header">
          <h2>🎉 LEVEL UP! 🎉</h2>
        </div>
        <div className="modal-content">
          <div className="hack-success">
            <h3>🔥 HACK SUCCESSFUL! 🔥</h3>
            <p className="hacked-function">
              You successfully infiltrated and compromised:
            </p>
            <div className="function-display">
              <code>{hackedFunction}</code>
            </div>
            <p className="level-progression">
              🚀 <strong>Access Level {newLevel} Unlocked!</strong> 🚀
            </p>
            <p className="motivation">
              The system's defenses are adapting... but you're getting stronger too!
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="continue-button" onClick={onContinue}>
            🎯 CONTINUE HACKING 🎯
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelUpModal;
