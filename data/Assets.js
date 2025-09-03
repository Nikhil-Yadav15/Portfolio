// data/Assets.js
export const PORTFOLIO_ASSETS = {
    // High priority (critical for initial render)
    HIGH_PRIORITY: [
      { src: "/avatar-animated.gif", type: "image", priority: "high" },
      { src: "/coder.png", type: "image", priority: "high" },
      { src: "/creator.mp4", type: "video", priority: "high" },
    ],
    
    // Models
    MODELS: [
      { src: "/blackhole_compress.glb", type: "model" },
      { src: "/robot_compress.glb", type: "model" },
    ],
    
    // Tech SVGs
    TECH_SVGS: [
      { src: "/tech_svg/github-color.svg", type: "image" },
      { src: "/tech_svg/nextdotjs-color.svg", type: "image" },
      { src: "/tech_svg/langchain-color.svg", type: "image" },
      { src: "/tech_svg/langgraph-color.svg", type: "image" },
      { src: "/tech_svg/cloudinary-color.svg", type: "image" },
    ],
    
    // Project GIFs
    PROJECT_GIFS: [
      { src: "/projects/hovergif/bridgeball.gif", type: "image" },
      { src: "/projects/hovergif/copilotx.gif", type: "image" },
      { src: "/projects/hovergif/quickvault.gif", type: "image" },
      { src: "/projects/hovergif/skysprint.gif", type: "image" },
      { src: "/projects/hovergif/storagecube.gif", type: "image" },
    ],
    
    // Project PNGs
    PROJECT_PNGS: [
      { src: "/projects/bridgeball.png", type: "image" },
      { src: "/projects/bridgeball_repo.png", type: "image" },
      { src: "/projects/captcha.png", type: "image" },
      { src: "/projects/copilotx.png", type: "image" },
      { src: "/projects/quickvault.png", type: "image" },
      { src: "/projects/skysprint.png", type: "image" },
      { src: "/projects/storagecube.png", type: "image" },
    ],
    
    // Audio
    AUDIO: [
      { src: "/scatter.mp3", type: "audio" },
    ]
  };
  
  export const getAllAssets = () => [
    ...PORTFOLIO_ASSETS.HIGH_PRIORITY,
    ...PORTFOLIO_ASSETS.MODELS,
    ...PORTFOLIO_ASSETS.TECH_SVGS,
    ...PORTFOLIO_ASSETS.PROJECT_GIFS,
    ...PORTFOLIO_ASSETS.PROJECT_PNGS,
    ...PORTFOLIO_ASSETS.AUDIO,
  ];
  
  export const getCriticalAssets = () => PORTFOLIO_ASSETS.HIGH_PRIORITY;
  
