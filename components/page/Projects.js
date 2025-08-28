"use client";
import React from "react";
import {CombinedExpandableStickyScroll} from "@/components/helpers/ExpandableStickyScroll";
import BlurText from "@/components/ui/BlurText";
import { RecentProjects } from "@/data/RecentProjects";

  

export default function Projects() {
  return (
    <div className="h-full">
      <div className="pt-20 text-white pb-10 text-center">
        <BlurText
                  text="My Recent Projects"
                  delay={130}
                  animateBy="chars"
                  direction="top"
                  className="cursor-pointer font-lora text-4xl md:text-5xl lg:text-6xl font-bold  mb-4 flex justify-center text-blue-100"
                />
        <BlurText
                  text="Explore my latest work and creative solutions across various technologies and platforms"
                  delay={30}
                  animateBy="chars"
                  direction="top"
                  className="text-lg font-lora max-w-2xl mx-auto text-gray-400 font-light"
                />
      </div>

      <div className="mt-16 font-lora h-full">
        <CombinedExpandableStickyScroll sections={RecentProjects} />
      </div>
    </div>
  );
}
