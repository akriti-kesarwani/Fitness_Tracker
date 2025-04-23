import { NormalizedLandmark } from '@mediapipe/tasks-vision';
import { checkSquatForm, checkPushupForm } from './exerciseRules';
import { Point3D } from './poseUtils';

interface ExerciseEvaluation {
  isCorrect: boolean;
  feedback: string;
}

export const evaluateExercise = (
  landmarks: NormalizedLandmark[],
  exercise: 'squat' | 'pushup'
): ExerciseEvaluation => {
  const landmarksAs3D: Point3D[] = landmarks.map(landmark => ({
    x: landmark.x,
    y: landmark.y,
    z: landmark.z || 0
  }));

  if (exercise === 'squat') {
    return checkSquatForm(landmarksAs3D);
  } else {
    return checkPushupForm(landmarksAs3D);
  }
};