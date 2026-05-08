import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import type { Group } from 'three'

const LINES = [
  { width: 1.2, y: 0.6 },
  { width: 0.8, y: 0.2, color: '#818cf8' },
  { width: 1, y: -0.2 },
  { width: 0.5, y: -0.6, color: '#4f46e5' },
]

export function CodeLines({
  position,
  scale,
  color,
}: {
  position: [number, number, number]
  scale: number
  color: string
}) {
  const ref = useRef<Group>(null)

  useFrame((_, delta) => {
    if (ref.current) {
      ref.current.rotation.y += delta * 0.2
    }
  })

  return (
    <group ref={ref} position={position} scale={scale}>
      {LINES.map((line, i) => (
        <mesh key={i} position={[0, line.y, 0]}>
          <boxGeometry args={[line.width, 0.06, 0.06]} />
          <meshStandardMaterial
            color={line.color ?? color}
            metalness={0.6}
            roughness={0.3}
          />
        </mesh>
      ))}
    </group>
  )
}
