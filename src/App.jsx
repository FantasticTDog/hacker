import { useState, useEffect } from 'react';
import './App.css';

const App = () => {
  const [displayText, setDisplayText] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const RANDOM_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?';
  const DISPLAY_FIELD_ID = 'hacker-display-field';

  const generateRandomChar = () => {
    return RANDOM_CHARS[Math.floor(Math.random() * RANDOM_CHARS.length)];
  };

  const handleKeyPress = (event) => {
    // Only respond to alphanumeric keys and space
    if (/^[a-zA-Z0-9\s]$/.test(event.key)) {
      const randomChar = generateRandomChar();
      setDisplayText(prev => prev + randomChar);
    }
  };

  const handleClick = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  useEffect(() => {
    if (isFocused) {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, [isFocused]);

  return (
    <div className="app">
      <div 
        id={DISPLAY_FIELD_ID}
        className={`hacker-display ${isFocused ? 'focused' : ''}`}
        onClick={handleClick}
        onBlur={handleBlur}
        tabIndex={0}
      >
        {displayText || 'Click here and start typing...'}
        {isFocused && <span className="cursor">|</span>}
      </div>
    </div>
  );
};

export default App;