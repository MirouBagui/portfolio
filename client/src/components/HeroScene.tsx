import { Environment, Sparkles } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { NodeHex } from './shapes/NodeHex';
import { ReactAtom } from './shapes/ReactAtom';
import { MongoDBStack } from './shapes/MongoDBStack';
import { RabbitQueue } from './shapes/RabbitQueue';
import { DockerContainer } from './shapes/DockerContainer';

function canRenderThree(): boolean {
  const mql = window.matchMedia('(prefers-reduced-motion: reduce)');
  const isWidthOk = window.innerWidth >= 768;
  const isMotionOk = !mql.matches;
  const isCpuOk = (navigator.hardwareConcurrency ?? 8) >= 4;
  return isWidthOk && isMotionOk && isCpuOk;
}

function Scene() {
  return (
    <>
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

      <NodeHex position={[-2.5, 1.5, -2.5]} scale={0.5} />
      <ReactAtom position={[2.5, 1.8, -2.5]} scale={0.9} />
      <MongoDBStack position={[2.5, -1.8, -2.5]} scale={0.8} />
      <RabbitQueue position={[0, 2.5, -3]} scale={0.8} />
      <DockerContainer position={[0, -2.2, -3]} scale={0.8} />
    </>
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
      </Canvas>
    </div>
  );
}
