import React from 'react';
import { calculateAngle } from '../utils/poseUtils';
import './PoseDetection.css';

interface PoseDetectionProps {
  exercise: 'squat' | 'pushup';
  onStop: () => void;
}

interface FormFeedback {
  message: string;
  type: 'success' | 'warning' | 'error';
}

interface Keypoints {
  hip: { x: number; y: number; z: number };
  knee: { x: number; y: number; z: number };
  ankle: { x: number; y: number; z: number };
  shoulder: { x: number; y: number; z: number };
  elbow: { x: number; y: number; z: number };
  wrist: { x: number; y: number; z: number };
}

const PoseDetection: React.FC<PoseDetectionProps> = ({ exercise, onStop }) => {
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);
  const [repCount, setRepCount] = React.useState(0);
  const [formFeedback, setFormFeedback] = React.useState<FormFeedback[]>([]);
  const [isCorrectForm, setIsCorrectForm] = React.useState(true);
  const [isInDownPosition, setIsInDownPosition] = React.useState(false);

  // Exercise-specific angle thresholds
  const thresholds = {
    squat: {
      kneeMin: 60,
      kneeMax: 170,
      hipMin: 50,
      hipMax: 160,
    },
    pushup: {
      elbowMin: 70,
      elbowMax: 160,
      shoulderMin: 40,
      shoulderMax: 90,
    }
  };

  const addFeedback = (message: string, type: FormFeedback['type']) => {
    setFormFeedback(prev => [...prev, { message, type }].slice(-3));
  };

  const checkSquatForm = (keypoints: Keypoints) => {
    const kneeAngle = calculateAngle(keypoints.hip, keypoints.knee, keypoints.ankle);
    const hipAngle = calculateAngle(keypoints.shoulder, keypoints.hip, keypoints.knee);

    if (kneeAngle < thresholds.squat.kneeMin) {
      addFeedback('Knees too bent - rise up slightly', 'warning');
      setIsCorrectForm(false);
      if (!isInDownPosition) {
        setIsInDownPosition(true);
      }
    } else if (kneeAngle > thresholds.squat.kneeMax) {
      addFeedback('Bend your knees more', 'warning');
      setIsCorrectForm(false);
      if (isInDownPosition) {
        setRepCount(prev => prev + 1);
        setIsInDownPosition(false);
      }
    } else if (hipAngle < thresholds.squat.hipMin) {
      addFeedback('Keep your back straighter', 'warning');
      setIsCorrectForm(false);
    } else if (hipAngle > thresholds.squat.hipMax) {
      addFeedback('Bend at your hips more', 'warning');
      setIsCorrectForm(false);
    } else {
      setIsCorrectForm(true);
      addFeedback('Good form!', 'success');
    }
  };

  const checkPushupForm = (keypoints: Keypoints) => {
    const elbowAngle = calculateAngle(keypoints.shoulder, keypoints.elbow, keypoints.wrist);
    const shoulderAngle = calculateAngle(keypoints.elbow, keypoints.shoulder, keypoints.hip);

    if (elbowAngle < thresholds.pushup.elbowMin) {
      addFeedback('Arms too bent - push up more', 'warning');
      setIsCorrectForm(false);
      if (!isInDownPosition) {
        setIsInDownPosition(true);
      }
    } else if (elbowAngle > thresholds.pushup.elbowMax) {
      addFeedback('Lower yourself more', 'warning');
      setIsCorrectForm(false);
      if (isInDownPosition) {
        setRepCount(prev => prev + 1);
        setIsInDownPosition(false);
      }
    } else if (shoulderAngle < thresholds.pushup.shoulderMin) {
      addFeedback('Keep your upper body higher', 'warning');
      setIsCorrectForm(false);
    } else if (shoulderAngle > thresholds.pushup.shoulderMax) {
      addFeedback('Lower your upper body', 'warning');
      setIsCorrectForm(false);
    } else {
      setIsCorrectForm(true);
      addFeedback('Good form!', 'success');
    }
  };

  React.useEffect(() => {
    const setupCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        addFeedback('Error accessing camera', 'error');
      }
    };

    setupCamera();

    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  React.useEffect(() => {
    const checkForm = (keypoints: Keypoints) => {
      if (exercise === 'squat') {
        checkSquatForm(keypoints);
      } else {
        checkPushupForm(keypoints);
      }
    };

    // Mock keypoints for testing - replace with actual MediaPipe pose detection
    const mockKeypoints: Keypoints = {
      hip: { x: 0, y: 0, z: 0 },
      knee: { x: 0, y: 1, z: 0 },
      ankle: { x: 0, y: 2, z: 0 },
      shoulder: { x: 0, y: -1, z: 0 },
      elbow: { x: 1, y: 0, z: 0 },
      wrist: { x: 2, y: 0, z: 0 }
    };

    const interval = setInterval(() => {
      checkForm(mockKeypoints);
    }, 1000);

    return () => clearInterval(interval);
  }, [exercise, isInDownPosition]);

  return (
    <div className="pose-detection">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="camera-feed"
      />
      <canvas
        ref={canvasRef}
        className="pose-canvas"
      />
      <div className="feedback-container">
        <div className={`form-indicator ${isCorrectForm ? 'correct' : 'incorrect'}`}>
          Form: {isCorrectForm ? 'Good' : 'Needs Adjustment'}
        </div>
        {formFeedback.map((feedback, index) => (
          <div key={index} className={`feedback ${feedback.type}`}>
            {feedback.message}
          </div>
        ))}
      </div>
      <div className="controls">
        <div className="rep-counter">Reps: {repCount}</div>
        <button className="stop-button" onClick={onStop}>
          Stop Exercise
        </button>
      </div>
    </div>
  );
};

export default PoseDetection;