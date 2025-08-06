'use client'

import { useRef, useMemo, useEffect, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { Physics, useBox, useSphere } from '@react-three/cannon'
import * as THREE from 'three'
import { Environment } from '@react-three/drei'
import { BlackHoleModel } from '@/components/scenes/BlackHoleModel'
import { BlackHolePhysics } from '@/components/scenes/BlackHolePhysics'

const CannonGlassBreakScene = ({ setChangeModel,trigger, texture, screenWidth, screenHeight }) => {
  const [shakeIntensity, setShakeIntensity] = useState(0)
  const [breakInitiated, setBreakInitiated] = useState(false)
  const [fragments, setFragments] = useState([])

  // Load texture with optimizations
  const textureMap = useMemo(() => {
    if (!texture) return null
    const loader = new THREE.TextureLoader()
    const tex = loader.load(texture)
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.generateMipmaps = false
    return tex
  }, [texture])

  const viewport = useMemo(() => {
    const camera = { fov: 75, position: [0, 0, 10], aspect: screenWidth / screenHeight }
    const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position[2]
    const visibleWidth = visibleHeight * camera.aspect
    return { width: visibleWidth, height: visibleHeight }
  }, [screenWidth, screenHeight])

  const fragmentData = useMemo(() => {
    if (!viewport) return []
    
    const fragments = []
    const gridSize = 8
    const fragmentWidth = viewport.width / gridSize
    const fragmentHeight = viewport.height / gridSize

    for (let x = 0; x < gridSize; x++) {
      for (let y = 0; y < gridSize; y++) {
        const posX = (x - gridSize/2 + 0.5) * fragmentWidth
        const posY = (y - gridSize/2 + 0.5) * fragmentHeight
        
        const sizeVariation = 0.6 + Math.random() * 0.8
        const width = fragmentWidth * sizeVariation
        const height = fragmentHeight * sizeVariation
        
        fragments.push({
          id: `fragment-${x}-${y}`,
          position: [posX, posY, 0],
          size: [width, height, 0.05],
          uvOffset: [x / gridSize, y / gridSize],
          uvScale: [1 / gridSize, 1 / gridSize],
          mass: 0.3 + Math.random() * 0.4,
          rotation: [
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3,
            (Math.random() - 0.5) * 0.3
          ]
        })
      }
    }
    
    return fragments
  }, [viewport])

  useEffect(() => {
    if (!trigger) {
      setBreakInitiated(false)
      setShakeIntensity(0)
      setFragments([])
      
    }
  }, [trigger])

  useEffect(() => {
    if (trigger && !breakInitiated && fragmentData.length > 0) {
      setBreakInitiated(true)
      setShakeIntensity(0.2)
      setFragments(fragmentData)
    }
  }, [trigger, breakInitiated, fragmentData])

  useEffect(() => {
    return () => {
      if (textureMap) {
        textureMap.dispose()
      }
    }
  }, [textureMap])

  return (
    <Physics
      gravity={[0, 0, 0]} 
      iterations={25} 
      tolerance={0.000001}
      defaultContactMaterial={{
        friction: 0.01, 
        restitution: 0.01
      }}
      allowSleep={false}
      broadphase="SAP"
    >
      <CameraShake intensity={shakeIntensity} decay={1.5} />

      {breakInitiated && (
        
      <BlackHoleModel
        setChangeModel={setChangeModel}
        position={[0, 0, -8]}   
        scale={[1, 1, 1]}  
      />
    )}
    {breakInitiated && (
  <>
    <BlackHoleModel position={[0, -1, -8]} scale={[1, 1, 1]} />
    <BlackHolePhysics />
  </>
)}

      {fragments.map((fragment) => (
        <StraightLineFragment
          key={fragment.id}
          {...fragment}
          texture={textureMap}
          blackHoleActive={breakInitiated}
        />
      ))}
      {!breakInitiated && textureMap && (
        <InitialGlassPlane texture={textureMap} viewport={viewport} />
      )}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={0.8} />
      <pointLight position={[-5, 5, 5]} intensity={0.3} color="#4fc3f7" />
      <pointLight position={[5, -5, 5]} intensity={0.3} color="#f8bbd9" />
      <pointLight position={[0, 0, 15]} intensity={0.5} color="#ffffff" />
      
      <Environment preset="studio" />
    </Physics>
  )
}

const CameraShake = ({ intensity, decay }) => {
  useFrame((state, delta) => {
    if (intensity > 0) {
      const camera = state.camera
      camera.position.x += (Math.random() - 0.5) * intensity
      camera.position.y += (Math.random() - 0.5) * intensity * 0.5
      camera.position.z += (Math.random() - 0.5) * intensity * 0.1
    }
  })
  return null
}

const StraightLineFragment = ({ 
  id, 
  position, 
  size, 
  uvOffset, 
  uvScale, 
  mass, 
  rotation, 
  texture, 
  blackHoleActive 
}) => {
  const [ref, api] = useBox(() => ({
    mass: blackHoleActive ? mass : 0,
    position,
    rotation,
    args: size,
    material: {
      friction: 0.01,
      restitution: 0.01,
    },
    linearDamping: 0.001, 
    angularDamping: 0.1
  }))

  const materialRef = useRef()
  const [life, setLife] = useState(0)
  const [initialBreakComplete, setInitialBreakComplete] = useState(false)

  useEffect(() => {
    if (blackHoleActive && !initialBreakComplete) {
      const breakForce = [
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 1.5,
        (Math.random() - 0.5) * 0.5
      ]
      api.applyImpulse(breakForce, [0, 0, 0])

      setTimeout(() => {
        setInitialBreakComplete(true)
      }, 100) 
    }
  }, [blackHoleActive, initialBreakComplete, api])
  useFrame((state, delta) => {
    if (!blackHoleActive || !ref.current) return

    setLife(prev => prev + delta)

    const fragmentPos = new THREE.Vector3()
    fragmentPos.setFromMatrixPosition(ref.current.matrixWorld)

    const singularity = new THREE.Vector3(0, 0, -8)
    const distance = fragmentPos.distanceTo(singularity)

    if (initialBreakComplete && distance > 0.1) {
      const direction = singularity.clone().sub(fragmentPos).normalize()
      let attractionStrength = 120 / Math.max(distance, 0.3)

      if (distance < 5) {
        attractionStrength *= (5 - distance + 1) * 3
      }
      if (distance < 2) {
        attractionStrength *= (2 - distance + 1) * 10
      }

      const straightForce = direction.multiplyScalar(attractionStrength * mass)
      api.applyForce([straightForce.x, straightForce.y, straightForce.z], [0, 0, 0])

      if (distance < 3) {
        api.linearDamping.set(0.0001)
      }
    }

    if (ref.current && materialRef.current) {
      const fadeStart = 6
      const fadeTime = Math.max(0, life - fadeStart)
      const alpha = Math.max(0, 1 - fadeTime / 4)
      
      try {
        materialRef.current.opacity = alpha * 0.7
        materialRef.current.needsUpdate = true
      } catch (error) {
      }
      const scale = Math.max(0.02, Math.min(1, distance / 12))
      ref.current.scale.setScalar(scale)
      
      if (distance < 0.08 || alpha <= 0) {
        ref.current.visible = false
      }
    }
  })

  const geometry = useMemo(() => {
    const geo = new THREE.BoxGeometry(size[0], size[1], size[2])
    
    const uvAttribute = geo.attributes.uv
    const uvArray = uvAttribute.array
    
    const [uOffset, vOffset] = uvOffset
    const [uScale, vScale] = uvScale
    
    for (let i = 0; i < uvArray.length; i += 2) {
      const u = uvArray[i]
      const v = uvArray[i + 1]
      
      uvArray[i] = uOffset + u * uScale
      uvArray[i + 1] = 1 - (vOffset + v * vScale)
    }
    
    uvAttribute.needsUpdate = true
    return geo
  }, [size, uvOffset, uvScale])

  const material = useMemo(() => {
    const mat = new THREE.MeshPhysicalMaterial({
      map: texture,
      transparent: true,
      opacity: 0.7,
      roughness: 0.0,
      metalness: 0.0,
      transmission: 0.6,
      thickness: 0.1,
      ior: 1.52,
      clearcoat: 0.8,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
    })
    
    materialRef.current = mat
    return mat
  }, [texture])

  useEffect(() => {
    return () => {
      if (materialRef.current) {
        materialRef.current.dispose()
      }
      if (geometry) {
        geometry.dispose()
      }
    }
  }, [geometry])

  return (
    <mesh ref={ref} geometry={geometry} material={material} />
  )
}

const InitialGlassPlane = ({ texture, viewport }) => {
  return (
    <mesh position={[0, 0, 0]}>
      <planeGeometry args={[viewport.width, viewport.height]} />
      <meshPhysicalMaterial
        map={texture}
        transparent={true}
        opacity={0.4}
        roughness={0.0}
        metalness={0.0}
        transmission={0.9}
        thickness={0.1}
        ior={1.52}
        clearcoat={1.0}
        clearcoatRoughness={0.1}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}

export default CannonGlassBreakScene
