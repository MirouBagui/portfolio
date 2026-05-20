import { useMemo } from 'react'
import * as THREE from 'three'

export function NodeHex({
  position,
  scale,
}: {
  position: [number, number, number]
  scale: number
}) {
  const shape = useMemo(() => {
    const s = new THREE.Shape()
    const r = 0.6
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2 - Math.PI / 2
      const x = Math.cos(a) * r
      const y = Math.sin(a) * r
      if (i === 0) s.moveTo(x, y)
      else s.lineTo(x, y)
    }
    s.closePath()
    return s
  }, [])

  const geo = useMemo(() => {
    const g = new THREE.ExtrudeGeometry(shape, {
      depth: 0.15,
      bevelEnabled: true,
      bevelSize: 0.03,
      bevelThickness: 0.03,
      bevelSegments: 4,
    })
    g.center()
    return g
  }, [shape])

  const edgeGeo = useMemo(() => new THREE.EdgesGeometry(geo), [geo])

  return (
    <group position={position} scale={scale} rotation={[0.2, 0.5, 0]}>
      <mesh geometry={geo}>
        <meshStandardMaterial
          color="#4ade80"
          metalness={0.6}
          roughness={0.3}
          emissive="#4ade80"
          emissiveIntensity={0.1}
        />
      </mesh>
      <lineSegments geometry={edgeGeo}>
        <lineBasicMaterial color="#4ade80" transparent opacity={0.5} />
      </lineSegments>
    </group>
  )
}
