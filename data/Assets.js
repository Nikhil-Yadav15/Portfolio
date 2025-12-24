export const PORTFOLIO_ASSETS = () => ({
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
  
  // Tech SVGs - All tech stack icons (local + CDN)
  TECH_SVGS: [
    // Local SVGs
    { src: "/tech_svg/github-color.svg", type: "image" },
    { src: "/tech_svg/nextdotjs-color.svg", type: "image" },
    { src: "/tech_svg/langchain-color.svg", type: "image" },
    { src: "/tech_svg/langgraph-color.svg", type: "image" },
    { src: "/tech_svg/cloudinary-color.svg", type: "image" },
    // CDN SVGs (devicons)
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/numpy/numpy-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/pandas/pandas-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tensorflow/tensorflow-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/keras/keras-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/matplotlib/matplotlib-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mysql/mysql-original-wordmark.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongoose/mongoose-original-wordmark.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/mongodb/mongodb-original-wordmark.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/opencv/opencv-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/unity/unity-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/csharp/csharp-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/fastapi/fastapi-original.svg", type: "image" },
    { src: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vite/vite-original.svg", type: "image" },
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
  const assets = PORTFOLIO_ASSETS();
  return [
    ...assets.HIGH_PRIORITY,
    ...assets.MODELS,
    ...assets.TECH_SVGS,
    ...assets.PROJECT_GIFS,
    ...assets.PROJECT_PNGS,
    ...assets.AUDIO,
    {
      type: 'spline',
      src: 'https://prod.spline.design/WCl3Q-TO45nDydSB/scene.splinecode',
      name: 'About Page 3D Model'
    }
  ];
};

export const getCriticalAssets = () => PORTFOLIO_ASSETS().HIGH_PRIORITY;
