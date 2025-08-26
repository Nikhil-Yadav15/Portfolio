"use client";
import { cn } from "@/lib/utils";

export function CardDemo({ 
  src, 
  alt, 
  containerClassName,
  cardClassName,
  overlayClassName,
  hoverGifUrl
}) {
  return (
    <div className={cn("", containerClassName)}>
      <div
        className={cn(
          "group w-full cursor-pointer overflow-hidden relative card h-60 shadow-xl mx-auto flex flex-col justify-end p-4 border border-transparent dark:border-neutral-800",
          "bg-cover bg-center object-cover object-top",
          "hover:after:content-[''] hover:after:absolute hover:after:inset-0 hover:after:bg-black hover:after:opacity-50",
          "transition-all duration-500",
          cardClassName
        )}
        style={{
          backgroundImage: `url(${src})`
        }}
      >
        <div 
          className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-cover bg-center",
            overlayClassName
          )}
          style={{
            backgroundImage: `url(${hoverGifUrl})`
          }}
        />
        <span className="sr-only">{alt}</span>
      </div>
    </div>
  );
}
