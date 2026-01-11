import { useRef, useMemo } from 'react';
import React from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function AnimatedSphere() {
  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <Sphere args={[1, 100, 100]} scale={2}>
        <MeshDistortMaterial
          color="#1e40af"
          attach="material"
          distort={0.4}
          speed={1.5}
          roughness={0.1}
          metalness={0.8}
        />
      </Sphere>
    </Float>
  );
}

function Grid() {
  const ref = useRef<THREE.GridHelper>(null!);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    ref.current.position.z = (t * 0.5) % 2;
  });

  return (
    <gridHelper 
      ref={ref} 
      args={[100, 50, "#3b82f6", "#1e293b"]} 
      position={[0, -2, 0]} 
      rotation={[0, 0, 0]} 
    />
  );
}

function FloatingNodes() {
  const count = 40;
  const positions = useMemo(() => {
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      array[i * 3] = (Math.random() - 0.5) * 10;
      array[i * 3 + 1] = (Math.random() - 0.5) * 10;
      array[i * 3 + 2] = (Math.random() - 0.5) * 10 - 5;
    }
    return array;
  }, []);

  return (
    <group>
      {Array.from({ length: count }).map((_, i) => (
        <Float key={i} speed={1} rotationIntensity={0.5} floatIntensity={1}>
          <mesh position={[positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]]}>
            <sphereGeometry args={[0.02, 16, 16]} />
            <meshBasicMaterial color="#3b82f6" transparent opacity={0.4} />
          </mesh>
        </Float>
      ))}
    </group>
  );
}

export const ThreeBackground = () => {
  const [webglSupported, setWebglSupported] = React.useState(true);

  React.useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebglSupported(false);
      }
    } catch (e) {
      setWebglSupported(false);
    }
  }, []);

  if (!webglSupported) {
    return (
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
        background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)',
      }} />
    );
  }

  return (
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      zIndex: 0,
      pointerEvents: 'none',
    }}>
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <fog attach="fog" args={['#020617', 5, 15]} />
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} color="#3b82f6" />
        <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#1e40af" />
        
        <group position={[0, 0, -2]}>
          <AnimatedSphere />
        </group>
        
        <Grid />
        <FloatingNodes />
      </Canvas>
    </div>
  );
};
