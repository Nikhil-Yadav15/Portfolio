// import React, { useEffect, useRef, useState } from 'react'
// import { useGLTF, useAnimations } from '@react-three/drei'
// import { useFrame } from '@react-three/fiber'
// import { useSpring, a } from '@react-spring/three'

// export function BlackHoleModel({ 
//   onEngulfComplete, 
//   onTransitionStart, // ✅ NEW: Trigger transition at 90%
//   startAutoScale = false, 
//   ...props 
// }) {
//   const group = useRef()
//   const gltf = useGLTF('/blackhole_compress.glb')
//   const { actions, names } = useAnimations(gltf.animations, group)
//   const [hasEngulfed, setHasEngulfed] = useState(false)
//   const [hasTriggeredTransition, setHasTriggeredTransition] = useState(false)
//   const currentScale = useRef([0.2, 0.2, 0.2])

//   // ✅ OPTIMIZED SPRING CONFIGURATION
//   const { scale: autoScale } = useSpring({
//     scale: startAutoScale ? [100, 100, 100] : [0.2, 0.2, 0.2],
//     from: { scale: [0.2, 0.2, 0.2] },
//     config: {
//       mass: 40,        // Lighter for faster response
//       tension: 35,     // Higher for snappier animation
//       friction: 60,    // Higher to prevent overshoot
//       clamp: true      // Prevent bounce-back
//     },
//     onChange: ({ value }) => {
//       currentScale.current = value.scale
//       if (startAutoScale) {
//         const progress = (value.scale[0] / 100) * 100
//         console.log(`🚀 Black hole progress: ${progress.toFixed(1)}%`)
//       }
//     }
//   })

//   // ✅ ENHANCED FRAME MONITORING
//   useFrame(() => {
//     if (currentScale.current) {
//       const [x] = currentScale.current;
      
//       // Trigger transition at 90% instead of waiting for full scale
//       if (!hasTriggeredTransition && x >= 90) {
//         setHasTriggeredTransition(true);
//         console.log('🌌 TRIGGERING TRANSITION at scale:', x.toFixed(1));
//         if (onTransitionStart) {
//           onTransitionStart();
//         }
//       }
      
//       // Complete engulf at 95%
//       if (!hasEngulfed && x >= 95) {
//         setHasEngulfed(true);
//         console.log('🌌 ENGULFED! Scale:', x.toFixed(1));
//         if (onEngulfComplete) {
//           onEngulfComplete();
//         }
//       }
//     }
//   });

//   // Animation setup (same as before)
//   useEffect(() => {
//     if (names.length > 0 && actions[names[0]]) {
//       const action = actions[names[0]]
//       action.reset().fadeIn(1).play()
//       action.timeScale = 1.2
      
//       return () => {
//         if (action) {
//           action.fadeOut(1)
//         }
//       }
//     }
//   }, [actions, names])

//   return (
//     <a.group 
//       ref={group} 
//       {...props} 
//       scale={autoScale}
//     >
//       <primitive object={gltf.scene} />
//     </a.group>
//   )
// }


import React, { useEffect, useRef, useState } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useSpring, a } from '@react-spring/three'

export function BlackHoleModel({ 
  onEngulfComplete, 
  // ✅ REMOVED: onTransitionStart - no longer needed
  startAutoScale = false, 
  ...props 
}) {
  const group = useRef()
  const gltf = useGLTF('/blackhole_compress.glb')
  const { actions, names } = useAnimations(gltf.animations, group)
  const [hasEngulfed, setHasEngulfed] = useState(false)
  const currentScale = useRef([0.5, 0.5, 0.5])

  // ✅ MODIFIED: Scale to smaller max value, let scroll handle spacedrive trigger
  const { scale: autoScale } = useSpring({
    scale: startAutoScale ? [60, 60, 60] : [0.5, 0.5, 0.5], // Reduced max scale
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
        console.log(`🚀 Black hole scale progress: ${progress.toFixed(1)}%`)
      }
    }
  })

  // ✅ SIMPLIFIED: Only track engulf completion
  useFrame(() => {
    if (currentScale.current && startAutoScale) {
      const [x] = currentScale.current;
      
      // Complete engulf at 95% of max scale (57/60)  
      if (!hasEngulfed && x >= 57) {
        setHasEngulfed(true);
        console.log('🌌 BLACK HOLE ENGULFED at scale:', x.toFixed(1));
        if (onEngulfComplete) {
          onEngulfComplete();
        }
      }
    }
  });

  // Animation setup
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
      // !check the changes
      // position={[0, -1, props.position?.[2] || -8]}
      scale={autoScale}
    >
      <primitive object={gltf.scene} />
    </a.group>
  )
}
