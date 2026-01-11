import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface FloatingCardProps {
  position: [number, number, number];
  color: string;
  delay?: number;
}

export function FloatingCard({ position, color, delay = 0 }: FloatingCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime() + delay;
      meshRef.current.position.y = position[1] + Math.sin(time * 0.5) * 0.2;
      meshRef.current.rotation.x = Math.sin(time * 0.3) * 0.1;
      meshRef.current.rotation.y = Math.cos(time * 0.2) * 0.1;
    }
  });

  return (
    <RoundedBox ref={meshRef} args={[1, 1.4, 0.1]} position={position} radius={0.05}>
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.3}
        transparent
        opacity={0.6}
        roughness={0.2}
        metalness={0.8}
      />
    </RoundedBox>
  );
}
