import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, CameraShake, Sparkles } from '@react-three/drei';
import type { Group } from 'three';
import { AtomSymbol } from './shapes/AtomSymbol';
import { BracketPair } from './shapes/BracketPair';
import { WireframeCube } from './shapes/WireframeCube';
import { CodeLines } from './shapes/CodeLines';
import { FloatingNode } from './shapes/FloatingNode';

function canRenderThree(): boolean {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isWidthOk = window.innerWidth >= 768;
  const isMotionOk = !mql.matches;
  const isCpuOk = (navigator.hardwareConcurrency ?? 8) >= 4;
  return isWidthOk && isMotionOk && isCpuOk;
}

function Scene() {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.02;
    }
  });

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.5} />
      <Environment preset="studio" />

      <spotLight
        position={[6, 4, 3]}
        angle={0.5}
        penumbra={0.6}
        intensity={6}
        color="#818cf8"
      />
      <spotLight
        position={[-5, -2, 3]}
        angle={0.6}
        penumbra={0.5}
        intensity={4}
        color="#4f46e5"
      />
      <directionalLight
        position={[0, 3, -5]}
        intensity={3}
        color="#c4b5fd"
      />
      <pointLight position={[0, 0, 4]} intensity={2.5} color="#a78bfa" />

      <Sparkles
        count={30}
        scale={8}
        size={2}
        speed={0.3}
        color="#818cf8"
        opacity={0.3}
      />

      <AtomSymbol position={[-3.5, 2, -2]} scale={0.9} color="#6366f1" />
      <BracketPair position={[4, 1.5, -3]} scale={0.8} />
      <WireframeCube position={[-2, -1.5, -4]} scale={1.2} color="#a78bfa" />
      <CodeLines position={[3.5, -1.8, -2.5]} scale={0.7} color="#6366f1" />
      <FloatingNode position={[-4.5, -0.5, -1.5]} scale={1} color="#4f46e5" />
      <FloatingNode position={[2, 3.5, -1.5]} scale={0.7} color="#818cf8" />
    </group>
  );
}

export function HeroScene() {
  if (!canRenderThree()) return null;

  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0.5, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <Scene />
        <CameraShake
          maxYaw={0.005}
          maxPitch={0.005}
          maxRoll={0.002}
          yawFrequency={0.3}
          pitchFrequency={0.3}
          rollFrequency={0.2}
        />
      </Canvas>
    </div>
  );
}
