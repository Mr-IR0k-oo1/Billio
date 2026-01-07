import React from 'react';

interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: 'forward' | 'reverse';
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
}

const Plasma: React.FC<PlasmaProps> = ({
  color = '#ff6b35',
  speed = 0.6,
  opacity = 0.8,
}) => {
  // Calculate animation duration based on speed (lower speed = longer duration)
  const animationDuration = 20 / speed;
  
  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `radial-gradient(circle at 30% 50%, ${color}33 0%, transparent 50%),
                     radial-gradient(circle at 70% 50%, ${color}22 0%, transparent 50%)`,
        opacity,
        animation: `plasmaMove ${animationDuration}s ease-in-out infinite`,
        pointerEvents: 'none',
      }}
    >
      <style>{`
        @keyframes plasmaMove {
          0%, 100% {
            transform: scale(1) translateY(0);
          }
          50% {
            transform: scale(1.1) translateY(-20px);
          }
        }
      `}</style>
    </div>
  );
};

export const PlasmaFallback = () => (
  <div
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
      pointerEvents: 'none',
    }}
  />
);

export default Plasma;
