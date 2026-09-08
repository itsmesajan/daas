"use client";

import { useRef, useState } from "react";
import { Loader2, ChevronRight, MapPin } from "lucide-react";
import { useVirtualTour } from "./useVirtualTour";
import type { VirtualTourData } from "@/types";

export default function VirtualTourViewer({ data }: { data: VirtualTourData | null }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { pannellumLoaded, currentScene, scenes, categories, goToScene, isViewerReady } = useVirtualTour({
    data,
    containerRef,
  });

  const activeScene = currentScene ? scenes[currentScene] : null;

  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-bento-ink aspect-16/10 md:h-165 md:aspect-auto">
      <div ref={containerRef} className="w-full h-full" />

      {(!pannellumLoaded || !isViewerReady) && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-bento-ink/95 text-white">
          <Loader2 className="w-10 h-10 animate-spin text-accent-orange mb-4" />
          <p className="text-xs uppercase tracking-[0.2em] text-accent-orange">Loading Virtual Tour</p>
        </div>
      )}

      {activeScene && (
        <div className="absolute top-5 right-5 z-10 flex items-center gap-2 bg-black/70 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
          <MapPin className="w-4 h-4 text-accent-orange" />
          <span className="text-sm text-white tracking-wide">{activeScene.title}</span>
        </div>
      )}

      <div className="absolute inset-y-0 left-0 z-30 flex h-full">
        <div
          className={`h-full bg-black/85 backdrop-blur-md overflow-y-auto overflow-x-hidden transition-[width] duration-500 ease-in-out ${
            isSidebarOpen ? "w-72" : "w-0"
          }`}
        >
          <div className="w-72 pb-6">
            {categories.map((category) => (
              <div key={category.id}>
                <h4 className="text-[11px] uppercase tracking-[0.2em] text-accent-orange font-bold px-5 pt-6 pb-2">
                  {category.title}
                </h4>
                <div>
                  {category.sceneIds.map((sceneId) => {
                    const key = String(sceneId);
                    const scene = scenes[key];
                    if (!scene) return null;
                    const isActive = currentScene === key;
                    return (
                      <button
                        key={sceneId}
                        type="button"
                        onClick={() => goToScene(key)}
                        className={`w-full text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide transition-colors border-l-2 cursor-pointer ${
                          isActive
                            ? "bg-accent-orange/20 text-accent-orange border-accent-orange"
                            : "text-white/80 border-transparent hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        {scene.title}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsSidebarOpen((open) => !open)}
          aria-label={isSidebarOpen ? "Close tour navigation" : "Open tour navigation"}
          aria-expanded={isSidebarOpen}
          className="h-full w-8 shrink-0 flex items-center justify-center bg-black/70 hover:bg-black/85 backdrop-blur-md transition-colors cursor-pointer border-r border-white/10"
        >
          <ChevronRight
            className={`w-4 h-4 text-accent-orange transition-transform duration-500 ${isSidebarOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>
    </div>
  );
}
