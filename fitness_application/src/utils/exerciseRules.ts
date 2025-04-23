import { Point3D } from './poseUtils';

interface Point {
  x: number;
  y: number;
  z: number;
}

export const calculateAngleBetweenPoints = (p1: Point, p2: Point, p3: Point): number => {
  const getVector = (a: Point, b: Point) => ({
    x: b.x - a.x,
    y: b.y - a.y,
    z: b.z - a.z
  });

  const v1 = getVector(p2, p1);
  const v2 = getVector(p2, p3);

  const dotProduct = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
  const magnitude1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y + v1.z * v1.z);
  const magnitude2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y + v2.z * v2.z);

  const angle = Math.acos(dotProduct / (magnitude1 * magnitude2));
  return (angle * 180) / Math.PI;
};

export const checkSquatForm = (landmarks: Point3D[]): { isCorrect: boolean; feedback: string } => {
  const hipIndex = 24; // Right hip
  const kneeIndex = 26; // Right knee
  const ankleIndex = 28; // Right ankle
  const shoulderIndex = 12; // Right shoulder

  const kneeAngle = calculateAngleBetweenPoints(
    landmarks[hipIndex],
    landmarks[kneeIndex],
    landmarks[ankleIndex]
  );

  const hipAngle = calculateAngleBetweenPoints(
    landmarks[shoulderIndex],
    landmarks[hipIndex],
    landmarks[kneeIndex]
  );

  if (kneeAngle < 60) {
    return {
      isCorrect: false,
      feedback: 'Knees too bent - rise up slightly'
    };
  }

  if (kneeAngle > 170) {
    return {
      isCorrect: false,
      feedback: 'Bend your knees more'
    };
  }

  if (hipAngle < 50) {
    return {
      isCorrect: false,
      feedback: 'Keep your back straighter'
    };
  }

  if (hipAngle > 160) {
    return {
      isCorrect: false,
      feedback: 'Bend at your hips more'
    };
  }

  return {
    isCorrect: true,
    feedback: 'Good form!'
  };
};

export const checkPushupForm = (landmarks: Point3D[]): { isCorrect: boolean; feedback: string } => {
  const shoulderIndex = 12; // Right shoulder
  const elbowIndex = 14; // Right elbow
  const wristIndex = 16; // Right wrist
  const hipIndex = 24; // Right hip

  const elbowAngle = calculateAngleBetweenPoints(
    landmarks[shoulderIndex],
    landmarks[elbowIndex],
    landmarks[wristIndex]
  );

  const shoulderAngle = calculateAngleBetweenPoints(
    landmarks[elbowIndex],
    landmarks[shoulderIndex],
    landmarks[hipIndex]
  );

  if (elbowAngle < 70) {
    return {
      isCorrect: false,
      feedback: 'Arms too bent - push up more'
    };
  }

  if (elbowAngle > 160) {
    return {
      isCorrect: false,
      feedback: 'Lower yourself more'
    };
  }

  if (shoulderAngle < 40) {
    return {
      isCorrect: false,
      feedback: 'Keep your upper body higher'
    };
  }

  if (shoulderAngle > 90) {
    return {
      isCorrect: false,
      feedback: 'Lower your upper body'
    };
  }

  return {
    isCorrect: true,
    feedback: 'Good form!'
  };
};