import React from 'react';
import './WorkoutTimer.css';

interface WorkoutTimerProps {
  isActive: boolean;
  onSessionEnd: () => void;
}

const WorkoutTimer: React.FC<WorkoutTimerProps> = ({ isActive, onSessionEnd }) => {
  const [time, setTime] = React.useState(0);
  const [isRunning, setIsRunning] = React.useState(false);

  React.useEffect(() => {
    let intervalId: number;

    if (isActive && !isRunning) {
      setIsRunning(true);
      setTime(0);
    } else if (!isActive && isRunning) {
      setIsRunning(false);
      onSessionEnd();
    }

    if (isRunning) {
      intervalId = window.setInterval(() => {
        setTime(prevTime => prevTime + 1);
      }, 1000);
    }

    return () => {
      if (intervalId) {
        window.clearInterval(intervalId);
      }
    };
  }, [isActive, isRunning, onSessionEnd]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="workout-timer">
      <div className="timer-display">
        <span className="time">{formatTime(time)}</span>
        <span className="label">Elapsed Time</span>
      </div>
    </div>
  );
};

export default WorkoutTimer;