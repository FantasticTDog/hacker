import React, { useState, useEffect } from 'react';
import initProcesses from '../database/initProcesses';

interface InitializationSequenceProps {
  onComplete: () => void;
  targetFunction: string;
}

const INIT_STEPS = 5;
const TYPING_INTERVAL_MS = 25;

const getRandomSteps = () => {
  const randomSteps: string[] = [];
  for (let i = 0; i < INIT_STEPS; i++) {
    const randomIndex = Math.floor(Math.random() * initProcesses.length);
    randomSteps.push(initProcesses[randomIndex]);
  }
  return randomSteps.join('\n');
}

const InitializationSequence = ({ onComplete, targetFunction }: InitializationSequenceProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [initializationSteps] = useState(getRandomSteps());
  const [displayText, setDisplayText] = useState(initializationSteps);
  const [isTyping, setIsTyping] = useState(true);
  const [showMission, setShowMission] = useState(false);

  useEffect(() => {
    if (!targetFunction) return;
    
    setDisplayText('');
    setCurrentStep(0);
    setIsTyping(true);

    let charIndex = 0;
    let stepIndex = 0;
    const stepsArr = initializationSteps.split('\n');
    let currentStepChars = stepsArr[stepIndex] || '';
    let displayBuffer = '';
    let timeoutId: ReturnType<typeof setTimeout>;

    const typeChar = () => {
      if (charIndex < currentStepChars.length) {
        displayBuffer += currentStepChars[charIndex];
        setDisplayText(displayBuffer);
        charIndex++;
        timeoutId = setTimeout(typeChar, TYPING_INTERVAL_MS);
      } else {
        // Finished this step, add newline if not last
        if (stepIndex < stepsArr.length - 1) {
          displayBuffer += '\n';
        }
        setDisplayText(displayBuffer);
        setCurrentStep(stepIndex + 1);
        stepIndex++;
        if (stepIndex < stepsArr.length) {
          charIndex = 0;
          currentStepChars = stepsArr[stepIndex];
          timeoutId = setTimeout(typeChar, TYPING_INTERVAL_MS);
        } else {
          // All steps finished typing
          setIsTyping(false);
          // Show mission after a short delay
          setTimeout(() => {
            setShowMission(true);
            setDisplayText(prev => prev + '\n\n>> MISSION BRIEFING <<\nYour target function:\n\n' + targetFunction + '\n\nPress any key to begin hacking...');
          }, 400);
        }
      }
    };

    timeoutId = setTimeout(typeChar, TYPING_INTERVAL_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [initializationSteps, targetFunction]);

  useEffect(() => {
    if (!isTyping && showMission) {
      const handleContinue = (e: KeyboardEvent | MouseEvent) => {
        // Prevent multiple triggers
        if (typeof onComplete === 'function') {
          onComplete();
        }
      };

      window.addEventListener('keydown', handleContinue);
      window.addEventListener('mousedown', handleContinue);

      return () => {
        window.removeEventListener('keydown', handleContinue);
        window.removeEventListener('mousedown', handleContinue);
      };
    }
  }, [isTyping, showMission, onComplete]);


  return (
    <div className="init-sequence">
      <div className="init-header">
        <span className="init-title">HACKER OS v2.1.337</span>
        <span className="init-subtitle">Initializing secure environment...</span>
      </div>
      
      <div className="init-content">
        <div className="init-progress">
          <span className="progress-text">Loading modules: {currentStep}/{INIT_STEPS}</span>
          <div className="progress-bar">
            {Array.from({ length: INIT_STEPS }, (_, i) => (
              <div 
                key={i} 
                className={`progress-segment ${i < currentStep ? 'loaded' : 'pending'}`}
              />
            ))}
          </div>
        </div>
        
        <div className="init-log">
          {displayText}
          {isTyping && <span className="cursor">|</span>}
        </div>
      </div>
    </div>
  );
};

export default InitializationSequence;
