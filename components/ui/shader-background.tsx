"use client";
import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';

interface ShaderBackgroundProps {
  color?: string;
  backgroundColor?: string;
  gradient?: string;
  className?: string;
  particleCount?: number;
  particleSize?: number;
  rotationSpeed?: number;
}

interface StarParticlesProps {
  count: number;
  radius: number;
  color: string;
  size: number;
  speed: number;
}

interface CameraControllerProps {
  mousePosition: { x: number; y: number };
  isHovering: boolean;
}


function StarParticles({ count, radius, color, size, speed }: StarParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
   
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = radius + (Math.random() - 0.5) * 20;
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
    }
    
    return pos;
  }, [count, radius]);

  useFrame(() => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += speed;
      pointsRef.current.rotation.x += speed * 0.2;
      pointsRef.current.rotation.z += speed * 0.1;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color={color}
        size={size}
        sizeAttenuation={true}
        transparent={true}
        opacity={0.9}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function StarField({ color, particleCount, particleSize, rotationSpeed }: {
  color: string;
  particleCount: number;
  particleSize: number;
  rotationSpeed: number;
}) {
  return (
    <>
      <StarParticles 
        count={particleCount} 
        radius={40} 
        color={color} 
        size={particleSize}
        speed={rotationSpeed}
      />
      
      <StarParticles 
        count={Math.floor(particleCount * 0.4)} 
        radius={80} 
        color={color} 
        size={particleSize * 0.7}
        speed={rotationSpeed * 0.5}
      />

      <StarParticles 
        count={Math.floor(particleCount * 0.1)} 
        radius={20} 
        color={color} 
        size={particleSize * 0.7}
        speed={rotationSpeed * 1.5}
      />
    </>
  );
}

function CameraController({ mousePosition, isHovering }: CameraControllerProps) {
  const { camera } = useThree();

  useFrame(() => {
    if (isHovering) {
      const targetX = mousePosition.x * 5;
      const targetY = mousePosition.y * 5;
      
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
    } else {
      camera.position.x += (0 - camera.position.x) * 0.02;
      camera.position.y += (0 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

function ShaderBackground({
  color = "#ffffff",
  backgroundColor = "#000011",
  gradient,
  className = "",
  particleCount = 2000,
  particleSize = 0.8,
  rotationSpeed = 0.0005,
}: ShaderBackgroundProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      
      setMousePosition({ x, y });
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => {
      setIsHovering(false);
      setMousePosition({ x: 0, y: 0 });
    };

    container.addEventListener("mousemove", handleMouseMove);
    container.addEventListener("mouseenter", handleMouseEnter);
    container.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      container.removeEventListener("mousemove", handleMouseMove);
      container.removeEventListener("mouseenter", handleMouseEnter);
      container.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const backgroundStyle = gradient ? { background: gradient } : { backgroundColor };

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-screen h-full overflow-hidden relative ${className}`}
      style={backgroundStyle}
    >
      <Canvas
        className="absolute inset-0 w-full h-full"
        camera={{ 
          position: [0, 0, 30], 
          fov: 75,
          near: 0.1,
          far: 200
        }}
        gl={{ 
          alpha: true,
          antialias: true,
          powerPreference: "high-performance"
        }}
      >
        <ambientLight intensity={0.2} color={color} />
        
        <CameraController mousePosition={mousePosition} isHovering={isHovering} />
        
        <StarField 
          color={color}
          particleCount={particleCount}
          particleSize={particleSize}
          rotationSpeed={rotationSpeed}
        />
      </Canvas>

    </div>
  );
}

export default ShaderBackground;


