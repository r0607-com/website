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

function EnergyScene({
  size,
  isInteractingRef,
}: {
  size: "small" | "big";
  isInteractingRef: MutableRefObject<boolean>;
}) {
  const groupRef = useRef<Group>(null);
  const width = size === "big" ? 1.6 : 1.0;
  const height = size === "big" ? 0.7 : 0.55;
  const depth = size === "big" ? 0.85 : 0.65;
  const cells = size === "big" ? 6 : 3;

  useFrame(() => {
    if (groupRef.current && !isInteractingRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <boxGeometry args={[width, height, depth]} />
        <meshStandardMaterial
          color="#1a2235"
          emissive="#fcd34d"
          emissiveIntensity={0.35}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      {Array.from({ length: cells - 1 }).map((_, index) => {
        const x = -width / 2 + (width / cells) * (index + 1);
        return (
          <mesh key={index} position={[x, 0, 0]}>
            <boxGeometry args={[0.025, height * 0.9, depth * 0.9]} />
            <meshStandardMaterial color="#0f172a" />
          </mesh>
        );
      })}
      {[-0.15, 0.15].map((x, index) => (
        <mesh key={index} position={[x, height / 2 + 0.06, 0]}>
          <cylinderGeometry args={[0.07, 0.07, 0.12, 16]} />
          <meshStandardMaterial
            color="#374151"
            emissive="#94a3b8"
            emissiveIntensity={0.4}
            metalness={0.8}
            roughness={0.1}
          />
        </mesh>
      ))}
    </group>
  );
}

export function EnergyModel({ option }: { option: string }) {
  const isInteractingRef = useRef(false);
  const size = option === "battery_big" ? "big" : "small";

  return (
    <Canvas camera={{ position: [2.5, 1.5, 2.5], fov: 45 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 2]} intensity={1.2} />
      <Suspense fallback={null}>
        <EnergyScene size={size} isInteractingRef={isInteractingRef} />
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
