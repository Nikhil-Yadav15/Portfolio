// data/Assets.js

export const getPortfolioAssets = () => ({
  // High priority (critical for initial render)
  HIGH_PRIORITY: [
    { src: "/avatar-animated.gif", type: "image", priority: "high" },
    { src: "/coder.webp", type: "image", priority: "high" },
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
    { src: "/projects/bridgeball.webp", type: "image" },
    { src: "/projects/bridgeball_repo.webp", type: "image" },
    { src: "/projects/captcha.webp", type: "image" },
    { src: "/projects/copilotx.webp", type: "image" },
    { src: "/projects/quickvault.webp", type: "image" },
    { src: "/projects/skysprint.webp", type: "image" },
    { src: "/projects/storagecube.webp", type: "image" },
  ],
  
  // Audio
  AUDIO: [
    { src: "/scatter.mp3", type: "audio" },
  ],
});

// Helpers
export const getAllAssets = () => {
  const assets = getPortfolioAssets();
  return [
    ...assets.HIGH_PRIORITY,
    ...assets.MODELS,
    ...assets.TECH_SVGS,
    ...assets.PROJECT_GIFS,
    ...assets.PROJECT_PNGS,
    ...assets.AUDIO,
  ];
};

export const getCriticalAssets = () => getPortfolioAssets().HIGH_PRIORITY;
