export const RecentProjects = [
  {
    title: "AI & Multi-Agent Systems",
    description: "Agentic workflows that orchestrate CEO/CTO/CMO/CFO roles to build and grow startups end-to-end.",
    card: {
      title: "CoPilotX – Multi-Agent Startup Workspace",
      description: "LangGraph + ReAct Agent Collaboration",
      src: "/projects/copilotx.png",
      hoverGifUrl: "/projects/hovergif/copilotx.gif",
      imageSrc: "/projects/copilotx.png",
      ctaText: "Visit Live Site",
      ctaLink: "https://copilot-x-beta.vercel.app/",
      githubLink: "https://github.com/Nikhil-Yadav15/CoPilotX",
      tech: ["React", "Vite", "LangChain", "LangGraph", "Google Gemini", "Mermaid", "Markdown", "PPT APIs"],
      short: "Slack-style workspace where CEO/CTO/CMO/CFO agents co-create pitches, plans, and exportable packs.",
      content: () => (
        <div>
          <p>AI agents with distinct roles coordinate via LangGraph + ReAct to plan strategy, tech, marketing, and finance.</p>
          <br />
          <p>Includes an export system that auto-generates ZIP packs with business plans, slides, logos, and tech specs.</p>
        </div>
      ),
    },
  },
  {
    title: "Full-Stack Web Apps",
    description: "Production-ready web apps with auth, file workflows, and payments built on modern React stacks.",
    card: {
      title: "StorageCube - Smart Cloud Storage",
      description: "Next.js + Stripe + Cloudinary",
      src: "/projects/storagecube.png",
      hoverGifUrl: "/projects/hovergif/storagecube.gif",
      imageSrc: "/projects/storagecube.png",
      ctaText: "Visit Live Site",
      ctaLink: "https://storagecube.vercel.app/",
      githubLink: "https://github.com/Nikhil-Yadav15/StorageCube",
      tech: ["Next.js", "Tailwind CSS", "MongoDB", "Cloudinary", "Stripe", "JWT", "Nodemailer"],
      short: "Secure cloud storage with OTP auth, media previews, usage analytics, and paid plans.",
      content: () => (
        <div>
          <p>Implements OTP-based authentication, file upload/share/rename, usage tracking, and responsive UI.</p>
          <br />
          <p>Stripe integration for plan upgrades with webhooks; polished UX with Lucide React components.</p>
        </div>
      ),
    },
  },
  // {
  //   title: "Developer Tools",
  //   description: "Utilities that enhance local knowledge discovery and automate contextual file search.",
  //   card: {
  //     title: "Contextual File Searcher (MCP)",
  //     description: "Semantic + Keyword Hybrid Search",
  //     src: "/gemini.png",
  //     ctaText: "View Repository",
  //     ctaLink: "https://github.com/Nikhil-Yadav15/ContextualFileSearchMCP",
  //     tech: ["Python", "Sentence-Transformers", "PyPDF2", "Openpyxl", "FastMCP", "JSON"],
  //     short: "MCP tool that finds files by meaning and keywords across PDFs, docs, sheets, and code.",
  //     content: () => (
  //       <div>
  //         <p>Hybrid relevance scoring (semantic similarity, filename matching, keyword frequency) with unified text extraction.</p>
  //         <br />
  //         <p>Optimized using multithreading and depth-limited recursion for fast, large-scale directory scans.</p>
  //       </div>
  //     ),
  //   },
  // },
  {
    title: "Game Development",
    description: "Minimal, addictive gameplay loops with smooth physics and cross-platform builds.",
    card: {
      title: "Bridge Ball - Unity Arcade Game",
      description: "C# / Unity",
      src: "/projects/bridgeball.png",
      hoverGifUrl: "/projects/hovergif/bridgeball.gif",
      ctaText: "View Repository",
      ctaLink: "https://github.com/Nikhil-Yadav15/Bridge-Ball",
      tech: ["Unity", "C#"],
      short: "Rotate bridges to guide a rolling ball across dynamic platforms with rising difficulty.",
      content: () => (
        <div>
          <p>Arrow-key controls, incremental difficulty, and a minimal UI designed for an engaging reflex challenge.</p>
          <br />
          <p>Built for cross-platform play with clean, responsive interactions.</p>
        </div>
      ),
    },
  },
  {
    title: "File Sharing Platforms",
    description: "Lightweight, privacy-focused sharing with expiring links and grouped uploads.",
    card: {
      title: "QuickVault",
      description: "Temporary Sharing with Custom Links",
      src: "/projects/quickvault.png",
      hoverGifUrl: "/projects/hovergif/quickvault.gif",
      ctaText: "Visit Live Site",
      ctaLink: "https://quickvault.vercel.app/",
      githubLink: "https://github.com/Nikhil-Yadav15/QuickVault",
      tech: ["Next.js", "React", "Tailwind CSS", "Cloudinary", "MongoDB Atlas", "GitHub Workflows"],
      short: "Grouped uploads with a custom link valid for 10 days and 1 GB storage per group.",
      content: () => (
        <div>
          <p>Secure file uploads with link-based access control and automated cleanup via GitHub workflows.</p>
          <br />
          <p>Designed for quick sharing scenarios without account friction.</p>
        </div>
      ),
    },
  },
  {
    title: "Computer Vision & ML",
    description: "Deep learning systems targeting OCR-like problems and competitive ML events.",
    card: {
      title: "Captcha Cracker",
      description: "96% Accuracy – 1st Place",
      src: "/projects/captcha.png",
      ctaText: "View Repository",
      ctaLink: "https://github.com/Nikhil-Yadav15/CaptchaCracker",
      tech: ["Python", "TensorFlow", "Keras", "OpenCV"],
      short: "CNN-based CAPTCHA recognizer built for Turing’s Playground; ranked 1st among first-years.",
      content: () => (
        <div>
          <p>Image preprocessing pipelines and a tailored CNN to decode distorted alphanumeric characters.</p>
          <br />
          <p>Achieved 96% recognition accuracy in event benchmarks.</p>
        </div>
      ),
    },
  },
  {
    title: "Game Development",
    description: "Fast, replayable arcade experiences with procedural generation and score tracking.",
    card: {
      title: "SkySprint",
      description: "Endless 2D Aerial Runner",
      src: "/projects/skysprint.png",
      hoverGifUrl: "/projects/hovergif/skysprint.gif",
      ctaText: "Play Demo",
      ctaLink: "https://play.unity.com/en/games/1beac085-ab1e-4848-96a1-8dac445c5f71/skysprint",
      githubLink: "https://github.com/Nikhil-Yadav15/SkySprint",
      tech: ["Unity"],
      short: "Procedurally generated obstacles, physics-based motion, and cross-platform support.",
      content: () => (
        <div>
          <p>One-tap controls with momentum-aware physics for a snappy arcade feel.</p>
          <br />
          <p>Includes scalable difficulty and score tracking to encourage competition.</p>
        </div>
      ),
    },
  },

];
