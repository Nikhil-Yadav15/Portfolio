// import { Geist, Geist_Mono, Lora, Pinyon_Script } from "next/font/google";
// import "./globals.css";
// import DarkNavbar  from '@/components/page/Navbar'

// import { NavProvider } from "@/components/contexts/NavigationContext";

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const lora = Lora({
//   subsets: ["latin"],
//   weight: ["400", "700"], 
//   style: ["normal", "italic"],
//   display: "swap",
//   variable: "--font-lora",
// });


// const pinyonScript = Pinyon_Script({
//   subsets: ["latin"],
//   weight: ["400"], 
//   style: ["normal"],
//   display: "swap",
//   variable: "--font-pinyon-script",
// });

// export const metadata = {
//   title: "Nikhil Yadav",
//   description: "Portfolio Website of Nikhil Yadav",
// };

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${pinyonScript.variable} antialiased bg-black`}
//       >
//         <NavProvider>
//           <DarkNavbar 
//             desktopClassName="custom-desktop-styles"
//             mobileClassName="custom-mobile-styles" 
//           />
//           {children}
//         </NavProvider>
//       </body>
//     </html>
//   );
// }

// !

import { Geist, Geist_Mono, Lora, Pinyon_Script } from "next/font/google"
import "./globals.css"
import DarkNavbar from "@/components/page/Navbar"
import { NavProvider } from "@/components/contexts/NavigationContext"

// React DOM resource hints
import { preload, preconnect } from "react-dom"

// Fonts
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] })
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] })
const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lora",
})
const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal"],
  display: "swap",
  variable: "--font-pinyon-script",
})

// Optional static metadata (unchanged)
export const metadata = {
  title: "Nikhil Yadav",
  description: "Portfolio Website of Nikhil Yadav",
}

export default function RootLayout({ children }) {
  // 1) Preconnect to external origins used soon (e.g., tech icons CDN)
  preconnect("https://cdn.jsdelivr.net")

  // 2) Define asset lists
  // High priority (above-the-fold / appears immediately)
  const HIGH_PRIORITY_IMAGES = ["/avatar-animated.gif", "/coder.png"]
  const HIGH_PRIORITY_VIDEOS = ["/creator.mp4"]

  // 3D models (same-origin; if used by R3F, also consider useGLTF.preload in scene files)
  const MODELS = ["/blackhole_compress.glb", "/robot_compress.glb"]

  // Local tech SVGs from /public/tech_svg
  const TECH_LOCAL_SVGS = [
    "/tech_svg/github-color.svg",
    "/tech_svg/nextdotjs-color.svg",
    "/tech_svg/langchain-color.svg",
    "/tech_svg/langgraph-color.svg",
    "/tech_svg/cloudinary-color.svg",
  ]

  // Project GIFs (adjust paths if different in your repo)
  const PROJECT_GIFS = [
    "/projects/hovergif/bridgeball.gif",
    "/projects/hovergif/copilotx.gif",
    "/projects/hovergif/quickvault.gif",
    "/projects/hovergif/skysprint.gif",
    "/projects/hovergif/storagecube.gif",
  ]

  // Project PNGs
  const PROJECT_PNGS = [
    "/projects/bridgeball.png",
    "/projects/bridgeball_repo.png",
    "/projects/captcha.png",
    "/projects/copilotx.png",
    "/projects/quickvault.png",
    "/projects/skysprint.png",
    "/projects/storagecube.png",
  ]

  // 3) Issue resource hints early during render (parallelized by the browser)
  HIGH_PRIORITY_IMAGES.forEach((href) => preload(href, { as: "image", fetchPriority: "high" }))
  HIGH_PRIORITY_VIDEOS.forEach((href) => preload(href, { as: "video" }))
  MODELS.forEach((href) => preload(href, { as: "fetch" }))
  TECH_LOCAL_SVGS.forEach((href) => preload(href, { as: "image" }))
  PROJECT_GIFS.forEach((href) => preload(href, { as: "image" }))
  PROJECT_PNGS.forEach((href) => preload(href, { as: "image" }))

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${pinyonScript.variable} antialiased bg-black`}>
        <NavProvider>
          <DarkNavbar desktopClassName="custom-desktop-styles" mobileClassName="custom-mobile-styles" />
          {children}
        </NavProvider>
      </body>
    </html>
  )
}

