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

function Chassis({ w = 1.4, h = 0.55, d = 1.0 }: { w?: number; h?: number; d?: number }) {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[w, h, d]} />
      <meshStandardMaterial
        color="#172033"
        emissive="#7ee8fa"
        emissiveIntensity={0.28}
        metalness={0.2}
        roughness={0.45}
      />
    </mesh>
  );
}

function Wheel({ x, z, r = 0.22 }: { x: number; z: number; r?: number }) {
  return (
    <mesh position={[x, -0.15, z]} rotation={[0, Math.PI / 2, 0]}>
      <torusGeometry args={[r, 0.06, 10, 28]} />
      <meshStandardMaterial
        color="#111827"
        emissive="#86efac"
        emissiveIntensity={0.5}
        metalness={0.3}
        roughness={0.4}
      />
    </mesh>
  );
}

function WheelsScene() {
  return (
    <>
      <Chassis />
      <Wheel x={-0.85} z={0.3} r={0.26} />
      <Wheel x={0.85} z={0.3} r={0.26} />
      <Wheel x={-0.85} z={-0.3} r={0.26} />
      <Wheel x={0.85} z={-0.3} r={0.26} />
    </>
  );
}

function TracksScene() {
  return (
    <>
      <Chassis />
      {[-0.9, 0.9].map((x, index) => (
        <mesh key={index} position={[x, -0.1, 0]}>
          <boxGeometry args={[0.2, 0.35, 1.15]} />
          <meshStandardMaterial
            color="#111827"
            emissive="#86efac"
            emissiveIntensity={0.55}
            metalness={0.25}
            roughness={0.5}
          />
        </mesh>
      ))}
    </>
  );
}

function OmniScene() {
  const positions: [number, number][] = [
    [-0.8, -0.38],
    [0.8, -0.38],
    [-0.8, 0.38],
    [0.8, 0.38],
  ];

  return (
    <>
      <Chassis />
      {positions.map(([x, z], index) => (
        <mesh key={index} position={[x, -0.15, z]} rotation={[0, Math.PI / 2, 0]}>
          <torusGeometry args={[0.2, 0.07, 8, 20]} />
          <meshStandardMaterial
            color="#111827"
            emissive="#c4b5fd"
            emissiveIntensity={0.6}
            metalness={0.3}
            roughness={0.3}
          />
        </mesh>
      ))}
    </>
  );
}

function WalkerScene() {
  const legPairs: Array<{ x: number; z: number; side: 1 | -1 }> = [
    { x: -0.65, z: -0.3, side: -1 },
    { x: -0.65, z: 0.3, side: -1 },
    { x: 0.65, z: -0.3, side: 1 },
    { x: 0.65, z: 0.3, side: 1 },
  ];

  return (
    <>
      <Chassis w={1.2} d={0.85} />
      {legPairs.map(({ x, z, side }, index) => (
        <group key={index} position={[x, -0.18, z]}>
          <mesh position={[side * 0.18, -0.12, 0]} rotation={[0, 0, side * 0.4]}>
            <boxGeometry args={[0.08, 0.32, 0.07]} />
            <meshStandardMaterial color="#172033" emissive="#86efac" emissiveIntensity={0.5} />
          </mesh>
          <mesh position={[side * 0.3, -0.35, 0]} rotation={[0, 0, side * -0.3]}>
            <boxGeometry args={[0.07, 0.28, 0.07]} />
            <meshStandardMaterial color="#0f172a" emissive="#86efac" emissiveIntensity={0.4} />
          </mesh>
        </group>
      ))}
    </>
  );
}

function RoboticArmScene() {
  return (
    <>
      <mesh position={[0, -0.35, 0]}>
        <cylinderGeometry args={[0.35, 0.4, 0.25, 24]} />
        <meshStandardMaterial
          color="#172033"
          emissive="#7ee8fa"
          emissiveIntensity={0.3}
          metalness={0.3}
          roughness={0.4}
        />
      </mesh>
      <mesh position={[0, 0.05, 0]} rotation={[0, 0, -0.3]}>
        <boxGeometry args={[0.18, 0.7, 0.18]} />
        <meshStandardMaterial
          color="#1a2235"
          emissive="#c4b5fd"
          emissiveIntensity={0.4}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.2, 0.42, 0]}>
        <sphereGeometry args={[0.12, 16, 12]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#7ee8fa"
          emissiveIntensity={0.5}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      <mesh position={[0.35, 0.72, 0]} rotation={[0, 0, 0.5]}>
        <boxGeometry args={[0.14, 0.55, 0.14]} />
        <meshStandardMaterial
          color="#1a2235"
          emissive="#c4b5fd"
          emissiveIntensity={0.35}
          metalness={0.4}
          roughness={0.3}
        />
      </mesh>
      <mesh position={[0.55, 1, 0]}>
        <sphereGeometry args={[0.09, 14, 10]} />
        <meshStandardMaterial
          color="#0f172a"
          emissive="#f9a8d4"
          emissiveIntensity={0.6}
          metalness={0.5}
          roughness={0.2}
        />
      </mesh>
      {[-0.08, 0.08].map((offset, index) => (
        <mesh key={index} position={[0.63, 1.08 + offset * 0.5, offset]}>
          <boxGeometry args={[0.18, 0.06, 0.05]} />
          <meshStandardMaterial color="#172033" emissive="#f9a8d4" emissiveIntensity={0.3} />
        </mesh>
      ))}
    </>
  );
}

type MovementType = "wheels_4wd" | "tracks" | "omni_4" | "walker" | "robotic_arm";

function MovementScene({
  type,
  isInteractingRef,
}: {
  type: MovementType;
  isInteractingRef: MutableRefObject<boolean>;
}) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current && !isInteractingRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  return (
    <group ref={groupRef} scale={2.2}>
      {type === "wheels_4wd" && <WheelsScene />}
      {type === "tracks" && <TracksScene />}
      {type === "omni_4" && <OmniScene />}
      {type === "walker" && <WalkerScene />}
      {type === "robotic_arm" && <RoboticArmScene />}
    </group>
  );
}

const VALID_TYPES: MovementType[] = ["wheels_4wd", "tracks", "omni_4", "walker", "robotic_arm"];

export function MovementModel({ option }: { option: string }) {
  const isInteractingRef = useRef(false);
  const type = VALID_TYPES.includes(option as MovementType) ? (option as MovementType) : "wheels_4wd";

  return (
    <Canvas camera={{ position: [1.8, 1.2, 2.0], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} />
      <Suspense fallback={null}>
        <MovementScene type={type} isInteractingRef={isInteractingRef} />
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
