"use client";
import React from "react";
import {CombinedExpandableStickyScroll} from "@/components/helpers/ExpandableStickyScroll";
import { TextAnimate } from "@/components/ui/text-animate";
import { RecentProjects } from "@/data/RecentProjects";

  

export default function Projects() {
  return (
    <div className="h-full">
      <div className="pt-20 text-white pb-10 text-center">
        <TextAnimate animation="blurInUp"  delay={1} className={"cursor-text font-lora text-4xl md:text-5xl lg:text-6xl font-bold  mb-4 flex justify-center text-blue-100"} by="character">  My Recent Projects</TextAnimate>
        <TextAnimate animation="blurInUp"  delay={1} className={"cursor-text text-lg font-lora italic max-w-2xl mx-auto text-gray-400 font-light"} by="character">  Explore my latest work and creative solutions across various technologies and       platforms</TextAnimate>
      </div>

      <div className="mt-16 font-lora h-full">
        <CombinedExpandableStickyScroll sections={RecentProjects} />
      </div>
    </div>
  );
}
