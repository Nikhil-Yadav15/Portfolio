// "use client";
// import React, { useEffect, useRef, useState } from "react";

// const vertexShaderSource = `
//   attribute vec4 a_position;
//   void main() {
//     gl_Position = a_position;
//   }
// `;

// const fragmentShaderSource = `
// precision mediump float;
// uniform vec2 iResolution; // Canvas resolution (width, height)
// uniform float iTime;       // Time in seconds since the animation started
// uniform vec2 iMouse;      // Mouse coordinates (x, y)
// uniform vec3 u_color;     // Custom color uniform

// void mainImage(out vec4 fragColor, in vec2 fragCoord){
//     vec2 uv = (1.0 * fragCoord - iResolution.xy) / min(iResolution.x, iResolution.y);
//     float t = iTime * 0.5;

//     vec2 mouse_uv = (4.0 * iMouse - iResolution.xy) / min(iResolution.x, iResolution.y);

//     float mouseInfluence = 0.0;
//     if (length(iMouse) > 0.0) {
//         float dist_to_mouse = distance(uv, mouse_uv);
//         mouseInfluence = smoothstep(0.8, 0.0, dist_to_mouse);
//     }

//     for(float i = 8.0; i < 20.0; i++) {
//         uv.x += 0.6 / i * cos(i * 2.5 * uv.y + t);
//         uv.y += 0.6 / i * cos(i * 1.5 * uv.x + t);
//     }

//     float wave = abs(sin(t - uv.y - uv.x + mouseInfluence * 8.0));
//     float glow = smoothstep(0.9, 0.0, wave);

//     vec3 color = glow * u_color; // Use the custom color here

//     fragColor = vec4(color, 1.0);
// }

// void main() {
//     mainImage(gl_FragColor, gl_FragCoord.xy);
// }
// `;

// /**
//  * Valid blur sizes supported by Tailwind CSS.
//  */
// export type BlurSize = "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";

// /**
//  * @typedef {Object} ShaderBackgroundProps
//  * @property {BlurSize} [backdropBlurAmount] - The size of the backdrop blur to apply.
//  * Valid values are "none", "sm", "md", "lg", "xl", "2xl", "3xl".
//  * Defaults to "sm" if not provided.
//  * @property {string} [color] - The color of the shader's glow in hexadecimal format (e.g., "#RRGGBB").
//  * Defaults to "#471CE2" (purple) if not provided.
//  * @property {string} [className] - Additional CSS classes to apply to the container div.
//  */
// interface ShaderBackgroundProps {
//   backdropBlurAmount?: string; // Accept any string from UI (validated internally)
//   color?: string;
//   className?: string;
// }

// /**
//  * A mapping from simplified blur size names to full Tailwind CSS backdrop-blur classes.
//  * This ensures Tailwind's JIT mode can correctly detect and generate the CSS.
//  */
// const blurClassMap: Record<BlurSize, string> = {
//   none: "backdrop-blur-none",
//   sm: "backdrop-blur-sm",
//   md: "backdrop-blur-md",
//   lg: "backdrop-blur-lg",
//   xl: "backdrop-blur-xl",
//   "2xl": "backdrop-blur-2xl",
//   "3xl": "backdrop-blur-3xl",
// };

// /**
//  * A React component that renders an interactive WebGL shader background.
//  * The background features a turbulent, glowing wave pattern that responds to mouse movement.
//  * An optional backdrop blur can be applied over the shader.
//  *
//  * @param {ShaderBackgroundProps} props - The component props.
//  * @returns {JSX.Element} The rendered ShaderBackground component.
//  */
// function ShaderBackground({
//   backdropBlurAmount = "sm",
//   color = "#07eae6ff", // Default purple color
//   className = "",
// }: ShaderBackgroundProps): React.JSX.Element {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const [isHovering, setIsHovering] = useState(false);

//   // Helper to convert hex color to RGB (0-1 range)
//   const hexToRgb = (hex: string): [number, number, number] => {
//     const r = parseInt(hex.substring(1, 3), 16) / 255;
//     const g = parseInt(hex.substring(3, 5), 16) / 255;
//     const b = parseInt(hex.substring(5, 7), 16) / 255;
//     return [r, g, b];
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const gl = canvas.getContext("webgl");
//     if (!gl) {
//       console.error("WebGL not supported");
//       return;
//     }

//     const compileShader = (
//       type: number,
//       source: string
//     ): WebGLShader | null => {
//       const shader = gl.createShader(type);
//       if (!shader) return null;
//       gl.shaderSource(shader, source);
//       gl.compileShader(shader);
//       if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
//         console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
//         gl.deleteShader(shader);
//         return null;
//       }
//       return shader;
//     };

//     const vertexShader = compileShader(gl.VERTEX_SHADER, vertexShaderSource);
//     const fragmentShader = compileShader(
//       gl.FRAGMENT_SHADER,
//       fragmentShaderSource
//     );
//     if (!vertexShader || !fragmentShader) return;

//     const program = gl.createProgram();
//     if (!program) return;
//     gl.attachShader(program, vertexShader);
//     gl.attachShader(program, fragmentShader);
//     gl.linkProgram(program);

//     if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
//       console.error("Program linking error:", gl.getProgramInfoLog(program));
//       return;
//     }

//     gl.useProgram(program);

//     const positionBuffer = gl.createBuffer();
//     gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
//     gl.bufferData(
//       gl.ARRAY_BUFFER,
//       new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
//       gl.STATIC_DRAW
//     );

//     const positionLocation = gl.getAttribLocation(program, "a_position");
//     gl.enableVertexAttribArray(positionLocation);
//     gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

//     const iResolutionLocation = gl.getUniformLocation(program, "iResolution");
//     const iTimeLocation = gl.getUniformLocation(program, "iTime");
//     const iMouseLocation = gl.getUniformLocation(program, "iMouse");
//     const uColorLocation = gl.getUniformLocation(program, "u_color"); // Get uniform location for custom color

//     let startTime = Date.now();

//     // Set the initial color
//     const [r, g, b] = hexToRgb(color);
//     gl.uniform3f(uColorLocation, r, g, b);

//     const render = () => {
//       const width = canvas.clientWidth;
//       const height = canvas.clientHeight;
//       canvas.width = width;
//       canvas.height = height;
//       gl.viewport(0, 0, width, height);

//       const currentTime = (Date.now() - startTime) / 1000;

//       gl.uniform2f(iResolutionLocation, width, height);
//       gl.uniform1f(iTimeLocation, currentTime);
//       gl.uniform2f(
//         iMouseLocation,
//         isHovering ? mousePosition.x : 0,
//         isHovering ? height - mousePosition.y : 0
//       );

//       gl.drawArrays(gl.TRIANGLES, 0, 6);
//       requestAnimationFrame(render);
//     };

//     const handleMouseMove = (event: MouseEvent) => {
//       const rect = canvas.getBoundingClientRect();
//       setMousePosition({
//         x: event.clientX - rect.left,
//         y: event.clientY - rect.top,
//       });
//     };

//     const handleMouseEnter = () => {
//       setIsHovering(true);
//     };

//     const handleMouseLeave = () => {
//       setIsHovering(false);
//       setMousePosition({ x: 0, y: 0 });
//     };

//     canvas.addEventListener("mousemove", handleMouseMove);
//     canvas.addEventListener("mouseenter", handleMouseEnter);
//     canvas.addEventListener("mouseleave", handleMouseLeave);

//     render();

//     return () => {
//       canvas.removeEventListener("mousemove", handleMouseMove);
//       canvas.removeEventListener("mouseenter", handleMouseEnter);
//       canvas.removeEventListener("mouseleave", handleMouseLeave);
//     };
//   }, [isHovering, mousePosition, color]); // Add color to the dependency array

//   // Get the correct Tailwind CSS class from the map
//   const finalBlurClass =
//     blurClassMap[backdropBlurAmount as BlurSize] || blurClassMap["sm"];

//   return (
//     <div className={`w-full max-w-screen h-full overflow-hidden ${className}`}>
//       <canvas
//         ref={canvasRef}
//         className="absolute inset-0 w-full max-w-screen h-full overflow-hidden"
//         style={{ display: "block" }}
//       />
//       {/* Apply the mapped Tailwind CSS class for backdrop blur */}
//       <div className={`absolute inset-0 ${finalBlurClass}`}></div>
//     </div>
//   );
// }

// export default ShaderBackground;

// !
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

/**
 * GPU-optimized star particle system component
 */
function StarParticles({ count, radius, color, size, speed }: StarParticlesProps) {
  const pointsRef = useRef<THREE.Points>(null!);

  // Generate particle positions once (memoized for performance)
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      
      // Spherical coordinates for even distribution
      const phi = Math.acos(2 * Math.random() - 1);
      const theta = 2 * Math.PI * Math.random();
      const r = radius + (Math.random() - 0.5) * 20;
      
      pos[i3] = r * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = r * Math.cos(phi);
    }
    
    return pos;
  }, [count, radius]);

  // Animation loop for rotation
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

/**
 * Multiple particle layers for depth and complexity
 */
function StarField({ color, particleCount, particleSize, rotationSpeed }: {
  color: string;
  particleCount: number;
  particleSize: number;
  rotationSpeed: number;
}) {
  return (
    <>
      {/* Main star field */}
      <StarParticles 
        count={particleCount} 
        radius={40} 
        color={color} 
        size={particleSize}
        speed={rotationSpeed}
      />
      
      {/* Distant stars layer */}
      <StarParticles 
        count={Math.floor(particleCount * 0.4)} 
        radius={80} 
        color={color} 
        size={particleSize * 0.6}
        speed={rotationSpeed * 0.5}
      />
      
      {/* Close bright stars */}
      <StarParticles 
        count={Math.floor(particleCount * 0.1)} 
        radius={20} 
        color={color} 
        size={particleSize * 1.5}
        speed={rotationSpeed * 1.5}
      />
    </>
  );
}

/**
 * Camera controller for smooth mouse interaction
 */
function CameraController({ mousePosition, isHovering }: CameraControllerProps) {
  const { camera } = useThree();

  useFrame(() => {
    if (isHovering) {
      // Smooth camera movement based on mouse position
      const targetX = mousePosition.x * 5;
      const targetY = mousePosition.y * 5;
      
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);
    } else {
      // Return to center position smoothly
      camera.position.x += (0 - camera.position.x) * 0.02;
      camera.position.y += (0 - camera.position.y) * 0.02;
      camera.lookAt(0, 0, 0);
    }
  });

  return null;
}

/**
 * React component with sharp 3D star particle background
 */
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

  // Mouse interaction setup
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

  // Determine background style - gradient takes priority
  const backgroundStyle = gradient ? { background: gradient } : { backgroundColor };

  return (
    <div 
      ref={containerRef}
      className={`w-full max-w-screen h-full overflow-hidden relative ${className}`}
      style={backgroundStyle}
    >
      {/* Three.js Canvas with sharp star particles */}
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
        {/* Subtle ambient light */}
        <ambientLight intensity={0.2} color={color} />
        
        {/* Interactive camera that follows mouse */}
        <CameraController mousePosition={mousePosition} isHovering={isHovering} />
        
        {/* Sharp star particle system */}
        <StarField 
          color={color}
          particleCount={particleCount}
          particleSize={particleSize}
          rotationSpeed={rotationSpeed}
        />
      </Canvas>

      {/* ✅ REMOVED: No backdrop blur overlay for sharp particles */}
    </div>
  );
}

export default ShaderBackground;
