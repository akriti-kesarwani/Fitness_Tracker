import React from 'react';
import { useNavigate } from 'react-router-dom';
import './WorkoutHistory.css';

export interface WorkoutSession {
  id: string;
  exercise: 'squat' | 'pushup';
  startTime: Date;
  endTime: Date;
  duration: number;
}

interface Props {
  sessions: WorkoutSession[];
  onDeleteSession?: (id: string) => void;
}

const WorkoutHistory: React.FC<Props> = ({ sessions, onDeleteSession }) => {
  const navigate = useNavigate();

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleString();
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleBackClick = () => {
    navigate('/');
  };

  if (sessions.length === 0) {
    return (
      <div className="workout-history empty">
        <h2>Workout History</h2>
        <p>No workouts recorded yet. Start exercising!</p>
        <button className="back-button" onClick={handleBackClick}>
          Back to Exercises
        </button>
      </div>
    );
  }

  return (
    <div className="workout-history">
      <div className="history-header">
        <h2>Workout History</h2>
        <button className="back-button" onClick={handleBackClick}>
          Back to Exercises
        </button>
      </div>
      <div className="history-list">
        {sessions.map((session) => (
          <div key={session.id} className="history-item">
            <div className="history-content">
              <div className="exercise-type">
                {session.exercise === 'pushup' ? 'Push-ups' : 'Squats'}
              </div>
              <div className="session-details">
                <span className="session-time">
                  {formatDate(session.startTime)}
                </span>
                <span className="session-duration">
                  Duration: {formatDuration(session.duration)}
                </span>
              </div>
            </div>
            {onDeleteSession && (
              <button 
                className="delete-button"
                onClick={() => onDeleteSession(session.id)}
                aria-label={`Delete ${session.exercise} session from ${formatDate(session.startTime)}`}
              >
                ×
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkoutHistory;