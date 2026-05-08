"use client";

if (typeof window !== "undefined") {
  const originalWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock:")) return;
    originalWarn(...args);
  };
}

import { Environment, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef, type MutableRefObject } from "react";
import type { Group } from "three";

type BrainTier = "brain_basic" | "brain_mega" | "brain_super" | "brain_ultra";

const TIER_CONFIG: Record<
  BrainTier,
  {
    boardW: number;
    boardD: number;
    boardH: number;
    chips: Array<{ x: number; z: number; size: number }>;
    heatsinkH: number;
    color: string;
    emissive: string;
  }
> = {
  brain_basic: {
    boardW: 1.2,
    boardD: 0.8,
    boardH: 0.06,
    chips: [
      { x: -0.3, z: -0.1, size: 0.2 },
      { x: 0.2, z: 0.1, size: 0.15 },
    ],
    heatsinkH: 0.15,
    color: "#172033",
    emissive: "#7ee8fa",
  },
  brain_mega: {
    boardW: 1.4,
    boardD: 0.9,
    boardH: 0.06,
    chips: [
      { x: -0.35, z: -0.1, size: 0.22 },
      { x: 0.25, z: 0.1, size: 0.18 },
      { x: -0.1, z: 0.2, size: 0.12 },
    ],
    heatsinkH: 0.22,
    color: "#172033",
    emissive: "#0891b2",
  },
  brain_super: {
    boardW: 1.6,
    boardD: 1.0,
    boardH: 0.07,
    chips: [
      { x: -0.4, z: -0.1, size: 0.28 },
      { x: 0.3, z: 0.1, size: 0.22 },
      { x: -0.1, z: 0.22, size: 0.15 },
      { x: 0.45, z: -0.15, size: 0.12 },
    ],
    heatsinkH: 0.32,
    color: "#1a1f2e",
    emissive: "#c4b5fd",
  },
  brain_ultra: {
    boardW: 1.8,
    boardD: 1.1,
    boardH: 0.08,
    chips: [
      { x: -0.45, z: -0.1, size: 0.32 },
      { x: 0.35, z: 0.1, size: 0.26 },
      { x: -0.1, z: 0.25, size: 0.18 },
      { x: 0.5, z: -0.2, size: 0.15 },
      { x: -0.4, z: 0.2, size: 0.13 },
    ],
    heatsinkH: 0.42,
    color: "#1a1f2e",
    emissive: "#f9a8d4",
  },
};

function BrainScene({
  tier,
  isInteractingRef,
}: {
  tier: BrainTier;
  isInteractingRef: MutableRefObject<boolean>;
}) {
  const groupRef = useRef<Group>(null);
  const cfg = TIER_CONFIG[tier];

  useFrame(() => {
    if (groupRef.current && !isInteractingRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[cfg.boardW, cfg.boardH, cfg.boardD]} />
        <meshStandardMaterial
          color={cfg.color}
          emissive={cfg.emissive}
          emissiveIntensity={0.3}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      {cfg.chips.map((chip, index) => (
        <mesh
          key={index}
          position={[chip.x, cfg.boardH / 2 + chip.size * 0.5, chip.z]}
        >
          <boxGeometry args={[chip.size, chip.size, chip.size]} />
          <meshStandardMaterial
            color="#0f172a"
            emissive={cfg.emissive}
            emissiveIntensity={0.6}
            metalness={0.6}
            roughness={0.2}
          />
        </mesh>
      ))}
      <mesh
        position={[
          cfg.chips[0].x,
          cfg.boardH / 2 + cfg.chips[0].size + cfg.heatsinkH * 0.5,
          cfg.chips[0].z,
        ]}
      >
        <boxGeometry args={[cfg.chips[0].size * 1.1, cfg.heatsinkH, cfg.chips[0].size * 1.1]} />
        <meshStandardMaterial
          color="#374151"
          emissive="#6b7280"
          emissiveIntensity={0.2}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>
      {[-0.35, 0, 0.35].map((z, index) => (
        <mesh key={index} position={[cfg.boardW / 2 + 0.04, 0, z]}>
          <boxGeometry args={[0.08, cfg.boardH * 2, 0.12]} />
          <meshStandardMaterial
            color="#374151"
            emissive="#94a3b8"
            emissiveIntensity={0.3}
            metalness={0.7}
            roughness={0.2}
          />
        </mesh>
      ))}
    </group>
  );
}

export function BrainModel({ tier }: { tier: string }) {
  const isInteractingRef = useRef(false);
  const validTier = tier in TIER_CONFIG ? (tier as BrainTier) : "brain_basic";

  return (
    <Canvas camera={{ position: [2.2, 1.4, 2.2], fov: 48 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} />
      <Suspense fallback={null}>
        <BrainScene tier={validTier} isInteractingRef={isInteractingRef} />
        <Environment preset="night" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={(Math.PI * 2) / 3}
        onStart={() => {
          isInteractingRef.current = true;
        }}
        onEnd={() => {
          isInteractingRef.current = false;
        }}
      />
    </Canvas>
  );
}
