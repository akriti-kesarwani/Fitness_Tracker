import { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface Point3D {
  x: number;
  y: number;
  z: number;
}

export interface Connection {
  start: number;
  end: number;
}

// Convert MediaPipe landmarks to 3D points
export const landmarksToPoints = (landmarks: NormalizedLandmark[]): Point3D[] => {
  return landmarks.map(landmark => ({
    x: landmark.x,
    y: landmark.y,
    z: landmark.z || 0
  }));
};

// Calculate angle between three 3D points
export const calculateAngle = (p1: Point3D, p2: Point3D, p3: Point3D): number => {
  const getVector = (a: Point3D, b: Point3D) => ({
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

// Define pose connections for visualization
export const getPoseConnections = (): Connection[] => {
  return [
    { start: 11, end: 13 }, // Left upper arm
    { start: 13, end: 15 }, // Left lower arm
    { start: 12, end: 14 }, // Right upper arm
    { start: 14, end: 16 }, // Right lower arm
    { start: 11, end: 23 }, // Left shoulder to hip
    { start: 12, end: 24 }, // Right shoulder to hip
    { start: 23, end: 25 }, // Left upper leg
    { start: 25, end: 27 }, // Left lower leg
    { start: 24, end: 26 }, // Right upper leg
    { start: 26, end: 28 }, // Right lower leg
    { start: 11, end: 12 }, // Shoulders
    { start: 23, end: 24 }  // Hips
  ];
};