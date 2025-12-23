"use client";
import React from "react";
import {CombinedExpandableStickyScroll} from "@/components/helpers/ExpandableStickyScroll";
import { RecentProjects } from "@/data/RecentProjects";

  

export default function Projects() {
  return (
    <div className="h-full">
      <div className="pt-20 text-white pb-10 text-center">
        <h2 className="cursor-text font-lora text-4xl md:text-5xl lg:text-6xl font-bold mb-4 flex justify-center text-blue-100">My Recent Projects</h2>
        <p className="cursor-text text-lg font-lora italic max-w-2xl mx-auto text-gray-400 font-light">Explore my latest work and creative solutions across various technologies and platforms</p>
      </div>

      <div className="mt-16 font-lora h-full">
        <CombinedExpandableStickyScroll sections={RecentProjects} />
      </div>
    </div>
  );
}
