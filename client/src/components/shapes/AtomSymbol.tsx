import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import type { Group } from 'three';

export function AtomSymbol({
  position,
  scale,
  color,
}: {
  position: [number, number, number];
  scale: number;
  color: string;
}) {
  const groupRef = useRef<Group>(null);

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.5;
      groupRef.current.rotation.x += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <mesh>
        <sphereGeometry args={[0.3, 16, 16]} />
        <MeshDistortMaterial
          color={color}
          roughness={0.1}
          metalness={0.9}
          distort={0.2}
          speed={1}
          envMapIntensity={2}
        />
      </mesh>
      {[0, 60, 120].map((angle) => (
        <mesh key={angle} rotation={[0, 0, (angle * Math.PI) / 180]}>
          <torusGeometry args={[0.7, 0.02, 8, 24]} />
          <meshStandardMaterial color={color} transparent opacity={0.6} />
        </mesh>
      ))}
      {[0, 120, 240].map((angle) => (
        <mesh
          key={angle}
          position={[
            0.7 * Math.cos((angle * Math.PI) / 180),
            0.7 * Math.sin((angle * Math.PI) / 180),
            0,
          ]}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={1}
          />
        </mesh>
      ))}
    </group>
  );
}
