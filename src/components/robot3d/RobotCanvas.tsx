"use client";

import { OrbitControls, Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { MutableRefObject } from "react";
import type { Group } from "three";

import type { RobotConfig } from "@/lib/robot-config";

// THREE.Clock was deprecated in three.js r183; @react-three/fiber v9 still
// creates one internally. Turbopack's ESM live bindings are getter-only so we
// cannot reassign THREE.Clock. Instead, suppress the specific warning that the
// Clock constructor emits until R3F ships a fix.
if (typeof window !== "undefined") {
  const _origWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock:")) return;
    _origWarn(...args);
  };
}

/**
 * Wraps optional robot parts so they lerp in from 2 units above on mount,
 * giving a satisfying "drop into place" assembly animation.
 */
function AnimatedEntry({
  x = 0,
  y = 0,
  z = 0,
  children,
}: {
  x?: number;
  y?: number;
  z?: number;
  children: React.ReactNode;
}) {
  const groupRef = useRef<Group>(null);
  const progressRef = useRef(0);

  useFrame((_, delta) => {
    if (progressRef.current >= 1) return;
    progressRef.current = Math.min(1, progressRef.current + delta * 3.5);
    if (groupRef.current) {
      // easeOutCubic so it decelerates into position
      const ease = 1 - Math.pow(1 - progressRef.current, 3);
      groupRef.current.position.y = y + (1 - ease) * 2;
    }
  });

  // Start 2 units above target; useFrame animates down
  return (
    <group ref={groupRef} position={[x, y + 2, z]}>
      {children}
    </group>
  );
}

function Wheel({
  x,
  z,
  radius = 0.22,
}: {
  x: number;
  z: number;
  radius?: number;
}) {
  return (
    <AnimatedEntry x={x} y={-0.34} z={z}>
      {/* rotation [0, π/2, 0] keeps the torus upright with the axle along X */}
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <torusGeometry args={[radius, 0.055, 12, 30]} />
        <meshStandardMaterial
          color="#111827"
          emissive="#7ee8fa"
          emissiveIntensity={0.45}
          metalness={0.35}
          roughness={0.38}
        />
      </mesh>
    </AnimatedEntry>
  );
}

function RobotModel({
  config,
  isInteractingRef,
}: {
  config: RobotConfig;
  isInteractingRef: MutableRefObject<boolean>;
}) {
  const groupRef = useRef<Group>(null);
  const perception = new Set(config.perception);

  useFrame(() => {
    // Pause auto-rotation while the user is dragging with OrbitControls
    if (groupRef.current && !isInteractingRef.current) {
      groupRef.current.rotation.y += 0.0035;
    }
  });

  return (
    <group ref={groupRef} scale={1.35}>
      {/* Chassis — always present */}
      <mesh position={[0, 0.18, 0]}>
        <boxGeometry args={[1.35, 0.72, 0.92]} />
        <meshStandardMaterial
          color="#172033"
          emissive="#7ee8fa"
          emissiveIntensity={0.34}
          metalness={0.18}
          roughness={0.42}
        />
      </mesh>

      {config.power ? (
        <AnimatedEntry x={0.86} y={0.12} z={0}>
          <mesh>
            <boxGeometry args={[0.28, 0.72, 0.58]} />
            <meshStandardMaterial
              color="#24324d"
              emissive="#fcd34d"
              emissiveIntensity={0.6}
              metalness={0.2}
              roughness={0.38}
            />
          </mesh>
        </AnimatedEntry>
      ) : null}

      {perception.has("rgb_camera") || perception.has("stereo_camera") ? (
        <>
          <AnimatedEntry x={-0.28} y={0.28} z={-0.49}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.09, 0.09, 0.12, 24]} />
              <meshStandardMaterial color="#0f172a" emissive="#f9a8d4" emissiveIntensity={0.85} />
            </mesh>
          </AnimatedEntry>
          {perception.has("stereo_camera") ? (
            <AnimatedEntry x={0.28} y={0.28} z={-0.49}>
              <mesh rotation={[Math.PI / 2, 0, 0]}>
                <cylinderGeometry args={[0.09, 0.09, 0.12, 24]} />
                <meshStandardMaterial color="#0f172a" emissive="#f9a8d4" emissiveIntensity={0.85} />
              </mesh>
            </AnimatedEntry>
          ) : null}
        </>
      ) : null}

      {perception.has("ultrasound") ? (
        <>
          <AnimatedEntry x={-0.18} y={0.05} z={-0.5}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.1, 18]} />
              <meshStandardMaterial color="#111827" emissive="#c4b5fd" emissiveIntensity={0.75} />
            </mesh>
          </AnimatedEntry>
          <AnimatedEntry x={0.18} y={0.05} z={-0.5}>
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.055, 0.055, 0.1, 18]} />
              <meshStandardMaterial color="#111827" emissive="#c4b5fd" emissiveIntensity={0.75} />
            </mesh>
          </AnimatedEntry>
        </>
      ) : null}

      {perception.has("infrared") ? (
        <AnimatedEntry x={-0.55} y={0.08} z={-0.35}>
          <mesh>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshStandardMaterial color="#111827" emissive="#f9a8d4" emissiveIntensity={0.95} />
          </mesh>
        </AnimatedEntry>
      ) : null}

      {perception.has("lidar") ? (
        <AnimatedEntry x={0} y={0.62} z={0}>
          <mesh>
            <cylinderGeometry args={[0.24, 0.24, 0.08, 32]} />
            <meshStandardMaterial color="#172033" emissive="#7ee8fa" emissiveIntensity={0.7} />
          </mesh>
        </AnimatedEntry>
      ) : null}

      {config.motion === "tank_tracks" ? (
        <>
          <AnimatedEntry x={-0.82} y={-0.28} z={0}>
            <mesh>
              <boxGeometry args={[0.2, 0.28, 1.12]} />
              <meshStandardMaterial color="#111827" emissive="#86efac" emissiveIntensity={0.55} />
            </mesh>
          </AnimatedEntry>
          <AnimatedEntry x={0.82} y={-0.28} z={0}>
            <mesh>
              <boxGeometry args={[0.2, 0.28, 1.12]} />
              <meshStandardMaterial color="#111827" emissive="#86efac" emissiveIntensity={0.55} />
            </mesh>
          </AnimatedEntry>
        </>
      ) : null}

      {config.motion === "drive_2wd" ? (
        <>
          <Wheel x={-0.82} z={0.25} radius={0.26} />
          <Wheel x={0.82} z={0.25} radius={0.26} />
        </>
      ) : null}

      {config.motion === "drive_4wd" || config.motion === "omni_wheels" ? (
        <>
          <Wheel x={-0.82} z={-0.34} radius={0.2} />
          <Wheel x={0.82} z={-0.34} radius={0.2} />
          <Wheel x={-0.82} z={0.34} radius={0.2} />
          <Wheel x={0.82} z={0.34} radius={0.2} />
        </>
      ) : null}

      {config.ai ? (
        <AnimatedEntry x={0} y={0.2} z={0}>
          <mesh>
            <sphereGeometry args={[0.92, 24, 16]} />
            <meshBasicMaterial color="#7ee8fa" wireframe transparent opacity={0.28} />
          </mesh>
        </AnimatedEntry>
      ) : null}
    </group>
  );
}

function RobotScene({ config }: { config: RobotConfig }) {
  const isInteractingRef = useRef(false);

  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[3, 3, 2]} intensity={1.1} />
      <Suspense fallback={null}>
        <RobotModel config={config} isInteractingRef={isInteractingRef} />
        <Environment preset="night" />
      </Suspense>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        onStart={() => {
          isInteractingRef.current = true;
        }}
        onEnd={() => {
          isInteractingRef.current = false;
        }}
      />
    </>
  );
}

export function RobotCanvas({ config }: { config: RobotConfig }) {
  return (
    <div className="h-full min-h-[240px] sm:min-h-[300px] w-full overflow-hidden rounded-lg border border-cyan-soft/40 bg-surface/70 shadow-[0_0_45px_var(--glow-cyan)]">
      <Canvas
        camera={{ position: [2.0, 1.0, 2.6], fov: 52 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <RobotScene config={config} />
      </Canvas>
    </div>
  );
}
