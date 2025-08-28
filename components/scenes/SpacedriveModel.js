import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame, useThree, useLoader } from '@react-three/fiber'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function SceneBackground() {
  const texture = useLoader(THREE.TextureLoader, '/gemini.png')
  const { scene } = useThree()
  
  useEffect(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    scene.background = texture
    scene.environment = texture
  }, [scene, texture])
  
  return null
}

export function SpacedriveModel({ onFlashComplete, ...props }) {
  const gltf = useGLTF('/spacedrive_fab_compress.glb')

  const { actions } = useAnimations(gltf?.animations || [], gltf?.scene)
  
  const flashRef = useRef()
  const lightRef = useRef()
  const overlayRef = useRef()
  const intensityRef = useRef(0)
  const [showFlash, setShowFlash] = useState(false)
  const [flashComplete, setFlashComplete] = useState(false)
  if (!gltf || !gltf.scene) return null
  
  const { scene, animations } = gltf
  useEffect(() => {
    if (!gltf.scene) return
    
    gltf.scene.traverse((child) => {
      if (child.isMesh) {
        child.material = child.material.clone()
        if (child.material.emissive) child.material.emissive.multiplyScalar(0.1)
        child.material.emissiveIntensity = 0
        child.material.toneMapped = true
        child.material.needsUpdate = true
      }
    })
  }, [gltf])

  useEffect(() => {
    if (actions && animations.length > 0) {
      const action = actions[animations[0].name]
      if (action) {
        action.setEffectiveTimeScale(4.0)
        action.reset().fadeIn(1).play()
      }
    }
  }, [actions, animations])

  useEffect(() => {
    const timeoutFlash = setTimeout(() => {
      setShowFlash(true)
      
      const completeTimeout = setTimeout(() => {

        setFlashComplete(true);
        
        if (onFlashComplete) {
          onFlashComplete();
        }
      }, 800);
      
      return () => clearTimeout(completeTimeout);
    }, 2000)
    
    return () => clearTimeout(timeoutFlash)
  }, [onFlashComplete])

  useFrame(() => {
    if (showFlash && !flashComplete && flashRef.current && lightRef.current && overlayRef.current) {
      intensityRef.current = Math.min(intensityRef.current + 0.5, 25)
      const currentIntensity = intensityRef.current
      
      lightRef.current.intensity = currentIntensity
      flashRef.current.material.emissiveIntensity = currentIntensity
      flashRef.current.scale.setScalar(1 + currentIntensity * 1.2)
      overlayRef.current.material.opacity = Math.min(currentIntensity * 0.06, 0.95)
    }
  })

  return (
    <>
      <SceneBackground />
      <primitive object={scene} scale={1} {...props} />
      
      {showFlash && !flashComplete && (
        <>
          <mesh ref={flashRef} position={[0, 0, 1]}>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial
              emissive={new THREE.Color('white')}
              emissiveIntensity={0} 
              toneMapped={false}
            />
          </mesh>
          
          <pointLight 
            ref={lightRef} 
            position={[0, 0, 1]}
            color="white" 
            intensity={0} 
            distance={20} 
            decay={1.5} 
          />
          
          <mesh ref={overlayRef} position={[0, 0, 4]} scale={[60, 60, 1]}>
            <planeGeometry args={[1, 1]} />
            <meshBasicMaterial 
              color="white" 
              transparent 
              opacity={0} 
              toneMapped={false}
            />
          </mesh>

          <EffectComposer multisampling={0} disableNormalPass>
            <Bloom
              intensity={5.0}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.3}
              mipmapBlur
            />
          </EffectComposer>
        </>
      )}
    </>
  )
}

export { SceneBackground }
