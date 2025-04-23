import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import ExerciseSelector, { Exercise } from './components/ExerciseSelector';
import PoseDetector from './components/PoseDetector';
import ThemeToggle from './components/ThemeToggle';
import MotivationalQuote from './components/MotivationalQuote';
import AnimatedBackground from './components/AnimatedBackground';
import WorkoutTimer from './components/WorkoutTimer';
import WorkoutHistory, { WorkoutSession } from './components/WorkoutHistory';
import './App.css';

const App = () => {
  const navigate = useNavigate();
  // Initialize theme from localStorage or system preference
  const [isDarkMode, setIsDarkMode] = React.useState(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return false;
  });
  const [selectedExercise, setSelectedExercise] = React.useState<Exercise | null>(null);
  const [workoutSessions, setWorkoutSessions] = React.useState<WorkoutSession[]>(() => {
    const saved = localStorage.getItem('workoutSessions');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'startTime' || key === 'endTime') {
        return new Date(value);
      }
      return value;
    }) : [];
  });
  const [currentSessionStart, setCurrentSessionStart] = React.useState<Date | null>(null);

  React.useEffect(() => {
    localStorage.setItem('workoutSessions', JSON.stringify(workoutSessions));
  }, [workoutSessions]);

  const handleExerciseStart = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setCurrentSessionStart(new Date());
  };

  const handleExerciseStop = () => {
    if (selectedExercise && currentSessionStart) {
      const endTime = new Date();
      const duration = Math.floor((endTime.getTime() - currentSessionStart.getTime()) / 1000);
      
      const newSession: WorkoutSession = {
        id: Date.now().toString(),
        exercise: selectedExercise,
        startTime: currentSessionStart,
        endTime,
        duration
      };
      
      setWorkoutSessions(prev => [...prev, newSession]);
      setSelectedExercise(null);
      setCurrentSessionStart(null);
      navigate('/history');
    }
  };

  const handleDeleteSession = (id: string) => {
    setWorkoutSessions(prev => prev.filter(session => session.id !== id));
  };

  React.useEffect(() => {
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(prev => !prev);
  };

  return (
    <div className={`app ${isDarkMode ? 'dark' : 'light'}`}>
      <AnimatedBackground />
      <ThemeToggle isDarkMode={isDarkMode} onToggle={handleThemeToggle} />
      <MotivationalQuote />
      <Routes>
        <Route
          path="/"
          element={
            selectedExercise ? (
              <>
                <PoseDetector exercise={selectedExercise} onStop={handleExerciseStop} />
                <WorkoutTimer isActive={true} onSessionEnd={handleExerciseStop} />
              </>
            ) : (
              <ExerciseSelector onSelectExercise={handleExerciseStart} />
            )
          }
        />
        <Route
          path="/history"
          element={<WorkoutHistory sessions={workoutSessions} onDeleteSession={handleDeleteSession} />}
        />
      </Routes>
    </div>
  );
};

export default App;