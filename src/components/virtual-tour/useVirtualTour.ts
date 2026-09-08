"use client";

import { useEffect, useRef, useState } from "react";
import type { TourHotSpot, TourScene, VirtualTourData } from "@/types";

interface PannellumHotSpot {
  pitch: number;
  yaw: number;
  type: string;
  text: string;
  sceneId?: string;
  targetYaw?: number;
  targetPitch?: number;
}

interface PannellumSceneConfig {
  title: string;
  type: "equirectangular";
  panorama: string;
  autoLoad: boolean;
  yaw: number;
  pitch: number;
  hfov: number;
  hotSpots: PannellumHotSpot[];
}

interface PannellumViewer {
  destroy: () => void;
  loadScene: (sceneId: string) => void;
  on: (event: string, handler: (sceneId: string) => void) => void;
}

interface PannellumStatic {
  viewer: (
    container: HTMLElement,
    config: {
      default: { firstScene: string; sceneFadeDuration: number; autorotate: number; autoLoad: boolean };
      scenes: Record<string, PannellumSceneConfig>;
    }
  ) => PannellumViewer;
}

declare global {
  interface Window {
    pannellum?: PannellumStatic;
  }
}

function buildHotSpot(h: TourHotSpot): PannellumHotSpot {
  const target = h.target;
  return {
    pitch: Number(h.pitch ?? 0),
    yaw: Number(h.yaw ?? 0),
    type: h.type || "scene",
    text: h.text || "Explore",
    sceneId: target?.sceneId != null ? String(target.sceneId) : undefined,
    targetYaw: target?.yaw != null ? Number(target.yaw) : undefined,
    targetPitch: target?.pitch != null ? Number(target.pitch) : undefined,
  };
}

function buildPannellumScenes(scenes: Record<string, TourScene>): Record<string, PannellumSceneConfig> {
  const config: Record<string, PannellumSceneConfig> = {};
  for (const [id, sc] of Object.entries(scenes)) {
    config[id] = {
      title: sc.title,
      type: "equirectangular",
      panorama: sc.panorama ? encodeURI(sc.panorama.trim()) : "",
      autoLoad: true,
      yaw: Number(sc.view?.yaw ?? 0),
      pitch: Number(sc.view?.pitch ?? 0),
      hfov: Number(sc.view?.hfov ?? 120),
      hotSpots: Array.isArray(sc.hotSpots) ? sc.hotSpots.map(buildHotSpot) : [],
    };
  }
  return config;
}

export function useVirtualTour({
  data,
  containerRef,
}: {
  data: VirtualTourData | null;
  containerRef: React.RefObject<HTMLDivElement | null>;
}) {
  const viewerRef = useRef<PannellumViewer | null>(null);
  // Lazy initializer avoids a synchronous setState-in-effect for the
  // "already loaded" case (e.g. navigating back to this page).
  const [pannellumLoaded, setPannellumLoaded] = useState(() => typeof window !== "undefined" && !!window.pannellum);
  const [currentScene, setCurrentScene] = useState<string | null>(null);
  const [isViewerReady, setIsViewerReady] = useState(false);

  const scenes = data?.scenes ?? {};

  // Load Pannellum from the CDN once — a lightweight panorama viewer with no
  // React bindings, so it's loaded as a plain script rather than an npm package.
  useEffect(() => {
    if (pannellumLoaded) return;

    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.css";
    document.head.appendChild(link);

    const script = document.createElement("script");
    script.src = "https://cdn.jsdelivr.net/npm/pannellum@2.5.6/build/pannellum.js";
    script.async = true;
    script.onload = () => setPannellumLoaded(true);
    document.body.appendChild(script);
  }, [pannellumLoaded]);

  // currentScene is intentionally excluded from deps: scene changes go
  // through viewerRef.current.loadScene() and must NOT trigger a re-init.
  useEffect(() => {
    if (!pannellumLoaded || !window.pannellum || !data || Object.keys(scenes).length === 0) return;
    if (!containerRef.current) return;

    const defaultId = data.tour?.settings?.defaultScene;
    const startScene = defaultId && scenes[String(defaultId)] ? String(defaultId) : Object.keys(scenes)[0];
    if (!startScene) return;

    if (viewerRef.current) {
      try {
        viewerRef.current.destroy();
      } catch {
        /* noop */
      }
      viewerRef.current = null;
      setIsViewerReady(false);
    }
    containerRef.current.innerHTML = "";

    try {
      viewerRef.current = window.pannellum.viewer(containerRef.current, {
        default: {
          firstScene: startScene,
          sceneFadeDuration: data.tour?.settings?.fadeIn ?? 600,
          autorotate: -2,
          autoLoad: true,
        },
        scenes: buildPannellumScenes(scenes),
      });

      // scenechange fires for the initial scene load too, so this callback
      // is the only place currentScene/isViewerReady are ever set — no
      // redundant direct calls right after construction.
      viewerRef.current.on("scenechange", (sceneId: string) => {
        setCurrentScene(sceneId);
        setIsViewerReady(true);
      });
    } catch (err) {
      console.error("Pannellum init error:", err);
    }

    return () => {
      if (viewerRef.current) {
        try {
          viewerRef.current.destroy();
        } catch {
          /* noop */
        }
        viewerRef.current = null;
      }
      setIsViewerReady(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pannellumLoaded, data]);

  const goToScene = (key: string) => {
    if (!viewerRef.current || currentScene === key) return;
    try {
      viewerRef.current.loadScene(key);
    } catch (e) {
      console.warn("Failed to change scene:", e);
    }
  };

  return {
    pannellumLoaded,
    currentScene,
    scenes,
    categories: data?.categories ?? [],
    goToScene,
    isViewerReady,
  };
}
