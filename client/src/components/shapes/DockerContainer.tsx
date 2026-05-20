export function DockerContainer({
  position,
  scale,
}: {
  position: [number, number, number];
  scale: number;
}) {
  return (
    <group position={position} scale={scale} rotation={[0.1, 0.5, 0]}>
      <mesh>
        <boxGeometry args={[0.8, 0.8, 0.5]} />
        <meshStandardMaterial
          color="#002562"
          metalness={0.5}
          roughness={0.4}
        />
      </mesh>
      {[-0.25, 0, 0.25].map((y, i) => (
        <mesh key={i} position={[0, y, 0.26]}>
          <boxGeometry args={[0.6, 0.04, 0.02]} />
          <meshBasicMaterial color="#818cf8" transparent opacity={0.6} />
        </mesh>
      ))}
      <mesh position={[0, 0, -0.26]}>
        <boxGeometry args={[0.6, 0.4, 0.02]} />
        <meshBasicMaterial color="#818cf8" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}
