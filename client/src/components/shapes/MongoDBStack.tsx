export function MongoDBStack({
  position,
  scale,
}: {
  position: [number, number, number]
  scale: number
}) {
  return (
    <group position={position} scale={scale} rotation={[0.1, 0.6, 0]}>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, i * 0.35 - 0.35, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.12, 24]} />
          <meshStandardMaterial
            color={i === 1 ? '#4ade80' : '#818cf8'}
            metalness={0.5}
            roughness={0.3}
            transparent
            opacity={i === 1 ? 0.9 : 0.6}
          />
        </mesh>
      ))}
    </group>
  )
}
