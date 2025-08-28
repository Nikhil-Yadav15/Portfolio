import { Geist, Geist_Mono, Lora, Pinyon_Script } from "next/font/google";
import "./globals.css";
import DarkNavbar  from '@/components/page/Navbar'

import { NavProvider } from "@/components/contexts/NavigationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const lora = Lora({
  subsets: ["latin"],
  weight: ["400", "700"], 
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-lora",
});


const pinyonScript = Pinyon_Script({
  subsets: ["latin"],
  weight: ["400"], 
  style: ["normal"],
  display: "swap",
  variable: "--font-pinyon-script",
});

export const metadata = {
  title: "Nikhil Yadav",
  description: "Portfolio Website of Nikhil Yadav",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${lora.variable} ${pinyonScript.variable} antialiased bg-black`}
      >
        <NavProvider>
          <DarkNavbar 
            desktopClassName="custom-desktop-styles"
            mobileClassName="custom-mobile-styles" 
          />
          {children}
        </NavProvider>
      </body>
    </html>
  );
}
