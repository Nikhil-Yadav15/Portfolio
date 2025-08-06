import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useSpring, a } from '@react-spring/three'

export function BlackHoleModel({ 
  onEngulfComplete, 
  startAutoScale = false, 
  ...props 
}) {
  const group = useRef()
  const gltf = useGLTF('/blackhole_compress.glb')
  const { actions, names } = useAnimations(gltf.animations, group)
  const [hasEngulfed, setHasEngulfed] = useState(false)
  const currentScale = useRef([0.5, 0.5, 0.5])
  const { scale: autoScale } = useSpring({
    scale: startAutoScale ? [60, 60, 60] : [0.5, 0.5, 0.5],
    from: { scale: [0.5, 0.5, 0.5] },
    config: {
      mass: 35,        
      tension: 40,     
      friction: 50,    
      clamp: true      
    },
    onChange: ({ value }) => {
      currentScale.current = value.scale
      if (startAutoScale) {
        const progress = (value.scale[0] / 60) * 100
      }
    }
  })

  useFrame(() => {
    if (currentScale.current && startAutoScale) {
      const [x] = currentScale.current;
      
      if (!hasEngulfed && x >= 57) {
        setHasEngulfed(true);
        if (onEngulfComplete) {
          onEngulfComplete();
        }
      }
    }
  });
  useEffect(() => {
    if (names.length > 0 && actions[names[0]]) {
      const action = actions[names[0]]
      action.reset().fadeIn(1).play()
      action.timeScale = 1.2
      
      return () => {
        if (action) {
          action.fadeOut(1)
        }
      }
    }
  }, [actions, names])

  return (
    <a.group 
      ref={group} 
      {...props} 
      scale={autoScale}
    >
      <primitive object={gltf.scene} />
    </a.group>
  )
}
