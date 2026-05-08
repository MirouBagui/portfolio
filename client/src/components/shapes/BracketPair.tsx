import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Group } from 'three'

const BRACKET_SIZE = 0.8
const THICKNESS = 0.15
const DEPTH = 0.15

function angleBracketPath(flip: boolean): THREE.Shape {
  const s = new THREE.Shape()
  const dir = flip ? -1 : 1

  const tipX = dir * BRACKET_SIZE
  const baseX = dir * BRACKET_SIZE * 0.65
  const halfH = BRACKET_SIZE * 0.6
  const t = THICKNESS / 2

  s.moveTo(baseX - t, -halfH)
  s.lineTo(tipX - t, 0)
  s.lineTo(baseX - t, halfH)
  s.lineTo(baseX + t, halfH)
  s.lineTo(tipX + t, 0)
  s.lineTo(baseX + t, -halfH)
  s.closePath()

  return s
}

function Bracket({ flip }: { flip: boolean }) {
  const shape = useMemo(() => angleBracketPath(flip), [flip])

  return (
    <mesh>
      <extrudeGeometry
        args={[
          shape,
          {
            depth: DEPTH,
            bevelEnabled: true,
            bevelSize: 0.03,
            bevelThickness: 0.03,
            bevelSegments: 4,
          },
        ]}
      />
      <meshStandardMaterial
        color="#818cf8"
        metalness={0.8}
        roughness={0.2}
      />
    </mesh>
  )
}

function Slash() {
  return (
    <mesh rotation={[0, 0, 0.6]} position={[0, 0, 0]}>
      <boxGeometry args={[THICKNESS * 0.8, BRACKET_SIZE * 0.9, DEPTH + 0.08]} />
      <meshStandardMaterial
        color="#818cf8"
        metalness={0.7}
        roughness={0.3}
        transparent
        opacity={0.6}
      />
    </mesh>
  )
}

export function BracketPair({
  position,
  scale,
}: {
  position: [number, number, number]
  scale: number
}) {
  const groupRef = useRef<Group>(null)

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.3
    }
  })

  return (
    <group ref={groupRef} position={position} scale={scale}>
      <Bracket flip={false} />
      <Slash />
      <Bracket flip />
    </group>
  )
}
