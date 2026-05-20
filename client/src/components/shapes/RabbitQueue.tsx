import { useMemo } from 'react'
import * as THREE from 'three'

const NODES = [
  { pos: [-1, 0, 0] },
  { pos: [-0.5, 0, 0] },
  { pos: [0, 0, 0] },
  { pos: [0.5, 0, 0] },
  { pos: [1, 0, 0] },
]

export function RabbitQueue({
  position,
  scale,
}: {
  position: [number, number, number]
  scale: number
}) {
  const curve = useMemo(
    () =>
      new THREE.CatmullRomCurve3(
        NODES.map((n) => new THREE.Vector3(n.pos[0], n.pos[1], n.pos[2])),
      ),
    [],
  )

  const tubeGeo = useMemo(() => new THREE.TubeGeometry(curve, 20, 0.025, 6, false), [curve])

  return (
    <group position={position} scale={scale} rotation={[0.2, 0.4, 0]}>
      <mesh geometry={tubeGeo}>
        <meshBasicMaterial color="#818cf8" transparent opacity={0.4} />
      </mesh>
      {NODES.map((node, i) => (
        <mesh key={i} position={node.pos as [number, number, number]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial
            color={i === 2 ? '#4ade80' : '#818cf8'}
            metalness={0.5}
            roughness={0.3}
            emissive={i === 2 ? '#4ade80' : undefined}
            emissiveIntensity={i === 2 ? 0.3 : 0}
          />
        </mesh>
      ))}
    </group>
  )
}
