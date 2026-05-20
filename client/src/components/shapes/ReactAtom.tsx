export function ReactAtom({
  position,
  scale,
}: {
  position: [number, number, number]
  scale: number
}) {
  return (
    <group position={position} scale={scale} rotation={[0.3, 0.8, 0]}>
      <mesh>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial
          color="#001aff"
          emissive="#1b2bc2"
          emissiveIntensity={0.4}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>
      {[0, 60, 120].map((angle, i) => (
        <mesh
          key={i}
          rotation={[
            ((angle + 15) * Math.PI) / 180,
            0,
            (angle * Math.PI) / 180,
          ]}
        >
          <torusGeometry args={[0.5, 0.035, 12, 32]} />
          <meshStandardMaterial
            color="#0012b6"
            metalness={0.5}
            roughness={0.3}
            transparent
            opacity={0.7}
          />
        </mesh>
      ))}
    </group>
  )
}
