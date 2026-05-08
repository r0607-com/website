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

function SensorScene({
  sensor,
  isInteractingRef,
}: {
  sensor: string;
  isInteractingRef: MutableRefObject<boolean>;
}) {
  const groupRef = useRef<Group>(null);

  useFrame(() => {
    if (groupRef.current && !isInteractingRef.current) {
      groupRef.current.rotation.y += 0.005;
    }
  });

  const showStereo = sensor === "stereo_camera" || sensor === "sensor_more";
  const showUltrasound = sensor === "ultrasound" || sensor === "sensor_more";
  const showLidar = sensor === "lidar" || sensor === "sensor_more";
  const showInfrared = sensor === "infrared" || sensor === "sensor_more";
  const showImu = sensor === "imu" || sensor === "sensor_more";

  return (
    <group ref={groupRef} scale={2.2}>
      {/* Robot body */}
      <mesh position={[0, 0.1, 0]}>
        <boxGeometry args={[1.3, 0.55, 0.9]} />
        <meshStandardMaterial
          color="#172033"
          emissive="#7ee8fa"
          emissiveIntensity={0.22}
          metalness={0.2}
          roughness={0.5}
        />
      </mesh>
      {/* Stereo camera — dual lenses */}
      {showStereo ? (
        <>
          <mesh position={[-0.27, 0.2, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.12, 20]} />
            <meshStandardMaterial color="#0f172a" emissive="#f9a8d4" emissiveIntensity={0.9} />
          </mesh>
          <mesh position={[0.27, 0.2, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.09, 0.09, 0.12, 20]} />
            <meshStandardMaterial color="#0f172a" emissive="#f9a8d4" emissiveIntensity={0.9} />
          </mesh>
        </>
      ) : null}
      {/* Ultrasound — twin transducers */}
      {showUltrasound ? (
        <>
          <mesh position={[-0.2, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.09, 16]} />
            <meshStandardMaterial color="#111827" emissive="#c4b5fd" emissiveIntensity={0.75} />
          </mesh>
          <mesh position={[0.2, 0, -0.48]} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.055, 0.055, 0.09, 16]} />
            <meshStandardMaterial color="#111827" emissive="#c4b5fd" emissiveIntensity={0.75} />
          </mesh>
        </>
      ) : null}
      {/* LiDAR — spinning disc on top */}
      {showLidar ? (
        <mesh position={[0, 0.46, 0]}>
          <cylinderGeometry args={[0.22, 0.22, 0.09, 30]} />
          <meshStandardMaterial color="#172033" emissive="#7ee8fa" emissiveIntensity={0.75} />
        </mesh>
      ) : null}
      {/* Infrared — side emitter */}
      {showInfrared ? (
        <mesh position={[-0.68, 0.05, -0.3]}>
          <sphereGeometry args={[0.07, 14, 12]} />
          <meshStandardMaterial color="#111827" emissive="#f9a8d4" emissiveIntensity={0.95} />
        </mesh>
      ) : null}
      {/* IMU — small board chip */}
      {showImu ? (
        <mesh position={[0.25, 0.15, 0.25]}>
          <boxGeometry args={[0.1, 0.07, 0.1]} />
          <meshStandardMaterial color="#0f172a" emissive="#fcd34d" emissiveIntensity={0.8} />
        </mesh>
      ) : null}
    </group>
  );
}

export function SensorsModel({ selected }: { selected: string }) {
  const isInteractingRef = useRef(false);

  return (
    <Canvas camera={{ position: [1.8, 1.2, 2.0], fov: 55 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}>
      <ambientLight intensity={0.8} />
      <directionalLight position={[3, 4, 2]} intensity={1.1} />
      <Suspense fallback={null}>
        <SensorScene sensor={selected} isInteractingRef={isInteractingRef} />
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
