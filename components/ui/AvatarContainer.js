// Add this component to your Hero.js or create a separate AvatarContainer component
import { useState } from 'react';
const AvatarContainer = ({ 
    staticImage = '/gemini.png', 
    animatedImage = '/avatar-animated.gif',
    name = "Your Name",
    className = "" 
  }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div className={`relative group ${className}`}>
        {/* Outer Glow Effect */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/20 via-cyan-400/30 to-purple-500/20 blur-xl scale-110 group-hover:scale-125 transition-transform duration-500" />
        
        {/* Hexagonal Border Container */}
        <div className="relative w-40 h-40 lg:w-48 lg:h-48">
          {/* Animated Border Ring */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 via-cyan-400 to-purple-500 group-hover:animate-spin-slow">
            <div className="w-full h-full rounded-full border-4 border-black bg-black" />
          </div>
          
          {/* Inner Hexagonal Frame */}
          <div className="absolute inset-2 hexagon-clip bg-gradient-to-br from-blue-500/30 via-cyan-400/20 to-purple-500/30 backdrop-blur-sm">
            {/* Avatar Image */}
            <div 
              className="w-full h-full hexagon-clip overflow-hidden cursor-pointer relative group"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <img
                src={isHovered ? animatedImage : staticImage}
                alt={name}
                className="w-full h-full object-cover transition-all duration-300 group-hover:scale-110"
                loading="eager"
              />
              
              {/* Overlay Effects */}
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Scan Line Effect */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-full left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent group-hover:animate-scan-down opacity-0 group-hover:opacity-100" />
              </div>
            </div>
          </div>
          
          {/* Corner Indicators */}
          <div className="absolute top-0 left-0 w-4 h-4 border-l-2 border-t-2 border-cyan-400 opacity-70" />
          <div className="absolute top-0 right-0 w-4 h-4 border-r-2 border-t-2 border-cyan-400 opacity-70" />
          <div className="absolute bottom-0 left-0 w-4 h-4 border-l-2 border-b-2 border-cyan-400 opacity-70" />
          <div className="absolute bottom-0 right-0 w-4 h-4 border-r-2 border-b-2 border-cyan-400 opacity-70" />
          
          {/* Status Indicator */}
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
            <div className="flex items-center gap-2 px-3 py-1 bg-black/80 rounded-full border border-cyan-400/30 backdrop-blur-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-xs text-cyan-400 font-medium">ONLINE</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
export default AvatarContainer