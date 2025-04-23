import React from 'react';
import { NormalizedLandmark } from '@mediapipe/tasks-vision';
import './PoseVisualization.css';

interface PoseVisualizationProps {
  landmarks: NormalizedLandmark[];
  connections: [number, number][];
  width: number;
  height: number;
}

const PoseVisualization: React.FC<PoseVisualizationProps> = ({
  landmarks,
  connections,
  width,
  height
}) => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw connections
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 2;

    connections.forEach(([start, end]) => {
      const startPoint = landmarks[start];
      const endPoint = landmarks[end];

      if (startPoint && endPoint) {
        ctx.beginPath();
        ctx.moveTo(startPoint.x * width, startPoint.y * height);
        ctx.lineTo(endPoint.x * width, endPoint.y * height);
        ctx.stroke();
      }
    });

    // Draw landmarks
    ctx.fillStyle = '#ff0000';
    landmarks.forEach((landmark) => {
      ctx.beginPath();
      ctx.arc(
        landmark.x * width,
        landmark.y * height,
        3,
        0,
        2 * Math.PI
      );
      ctx.fill();
    });
  }, [landmarks, connections, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="pose-visualization"
    />
  );
};

export default PoseVisualization;