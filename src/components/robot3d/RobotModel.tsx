"use client";

if (typeof window !== "undefined") {
  const originalWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].includes("THREE.Clock:")) return;
    originalWarn(...args);
  };
}

import { Environment, Html, OrbitControls, useGLTF } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ChevronLeft, ChevronRight, Minus, Pause, Play, Plus, SlidersHorizontal, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useMemo, useRef, useState, type MutableRefObject } from "react";
import { Mesh, type Group } from "three";

import { cn } from "@/lib/utils";

interface RobotModelProps {
  brain: string;
  energy: string;
  movement: string;
  sensor: string;
}

const ACCENT_COLORS: Record<string, string> = {
  brain_basic: "#7ee8fa",
  brain_mega: "#0891b2",
  brain_super: "#c4b5fd",
  brain_ultra: "#f9a8d4",
  battery_small: "#fbbf24",
  battery_big: "#f59e0b",
  wheels_4wd: "#86efac",
  tracks: "#34d399",
  omni_4: "#c4b5fd",
  walker: "#60a5fa",
  robotic_arm: "#f9a8d4",
  stereo_camera: "#7ee8fa",
  ultrasound: "#86efac",
  infrared: "#fbbf24",
  lidar: "#f472b6",
  imu: "#c4b5fd",
  sensor_more: "#94a3b8",
};

const MODEL_CENTER: [number, number, number] = [
  -0.002803206443786621,
  4.313962179223516,
  -134.84355861321092,
];
const MODEL_SCALE = 0.012;
const MODEL_OFFSET: [number, number, number] = [0, 0, -0.35];
const CAMERA_POSITION: [number, number, number] = [3, 2, 4];
const ROTATION_STEP = Math.PI / 8;

function RobotAsset({
  config,
  isAnimating,
  isInteractingRef,
  rotationStep,
}: {
  config: RobotModelProps;
  isAnimating: boolean;
  isInteractingRef: MutableRefObject<boolean>;
  rotationStep: number;
}) {
  const groupRef = useRef<Group>(null);
  const previousRotationStepRef = useRef(rotationStep);
  const { scene } = useGLTF("/3dmodels/RobotFullBody.glb");

  const rotationSpeed = useMemo(() => {
    if (config.movement === "robotic_arm") return 0.0025;
    if (config.movement === "tracks") return 0.0035;
    return 0.0045;
  }, [config.movement]);

  useFrame(() => {
    if (groupRef.current && isAnimating && !isInteractingRef.current) {
      groupRef.current.rotation.y += rotationSpeed;
    }
  });

  useEffect(() => {
    const stepDelta = rotationStep - previousRotationStepRef.current;
    previousRotationStepRef.current = rotationStep;

    if (groupRef.current && stepDelta !== 0) {
      groupRef.current.rotation.y += stepDelta * ROTATION_STEP;
    }
  }, [rotationStep]);

  useEffect(() => {
    scene.traverse((object) => {
      if (object instanceof Mesh) {
        object.castShadow = false;
        object.receiveShadow = false;
      }
    });
  }, [scene]);

  return (
    <group position={MODEL_OFFSET}>
      <group ref={groupRef}>
        <group rotation={[-Math.PI / 2, 0, 0]} scale={MODEL_SCALE}>
          <primitive object={scene} position={MODEL_CENTER} />
        </group>
      </group>
    </group>
  );
}

function CameraRig({ distance }: { distance: number }) {
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(
      CAMERA_POSITION[0] * distance,
      CAMERA_POSITION[1] * distance,
      CAMERA_POSITION[2] * distance,
    );
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
  }, [camera, distance]);

  return null;
}

function CanvasFallback() {
  return (
    <Html center className="pointer-events-none whitespace-nowrap font-mono text-xs uppercase tracking-widest text-muted">
      Loading 3D
    </Html>
  );
}

export function RobotModel({ brain, energy, movement, sensor }: RobotModelProps) {
  const t = useTranslations("ui.robotControls");
  const isInteractingRef = useRef(false);
  const [controlsOpen, setControlsOpen] = useState(true);
  const [isAnimating, setIsAnimating] = useState(true);
  const [rotationStep, setRotationStep] = useState(0);
  const [cameraDistance, setCameraDistance] = useState(1);
  const accentColor = ACCENT_COLORS[sensor] ?? ACCENT_COLORS[brain] ?? "#7ee8fa";
  const fillColor = ACCENT_COLORS[movement] ?? "#86efac";
  const energyBoost = energy === "battery_big" ? 1.25 : 1;

  return (
    <div className="relative h-full w-full">
      <Canvas
        camera={{ position: CAMERA_POSITION, fov: 42 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
      >
        <CameraRig distance={cameraDistance} />
        <ambientLight intensity={0.75} />
        <directionalLight position={[3, 4, 2]} intensity={1.25 * energyBoost} />
        <pointLight position={[-2, 1.8, -1.5]} intensity={2.2} color={accentColor} />
        <pointLight position={[2.4, 0.8, 1.6]} intensity={1.1} color={fillColor} />
        <Suspense fallback={<CanvasFallback />}>
          <RobotAsset
            config={{ brain, energy, movement, sensor }}
            isAnimating={isAnimating}
            isInteractingRef={isInteractingRef}
            rotationStep={rotationStep}
          />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={(Math.PI * 2) / 3}
          onStart={() => {
            isInteractingRef.current = true;
          }}
          onEnd={() => {
            isInteractingRef.current = false;
          }}
        />
      </Canvas>

      <div className="pointer-events-none absolute inset-x-3 bottom-3 z-10 flex items-end justify-center gap-2">
        <button
          type="button"
          aria-label={controlsOpen ? t("closeMenu") : t("openMenu")}
          title={controlsOpen ? t("closeMenu") : t("openMenu")}
          onClick={() => setControlsOpen((open) => !open)}
          className="focus-ring pointer-events-auto grid size-10 place-items-center rounded-md border border-border bg-background/85 text-muted shadow-lg backdrop-blur transition hover:border-cyan-soft hover:text-foreground"
        >
          {controlsOpen ? <X size={18} /> : <SlidersHorizontal size={18} />}
        </button>

        <div
          className={cn(
            "pointer-events-auto flex items-center gap-1 rounded-md border border-border bg-background/85 p-1 shadow-lg backdrop-blur transition",
            controlsOpen ? "opacity-100" : "pointer-events-none opacity-0",
          )}
          aria-hidden={!controlsOpen}
        >
          <button
            type="button"
            aria-label={isAnimating ? t("stopAnimation") : t("startAnimation")}
            title={isAnimating ? t("stopAnimation") : t("startAnimation")}
            onClick={() => setIsAnimating((animating) => !animating)}
            className="focus-ring grid size-9 place-items-center rounded text-muted transition hover:bg-surface-alt hover:text-foreground"
          >
            {isAnimating ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button
            type="button"
            aria-label={t("rotateLeft")}
            title={t("rotateLeft")}
            onClick={() => setRotationStep((step) => step - 1)}
            className="focus-ring grid size-9 place-items-center rounded text-muted transition hover:bg-surface-alt hover:text-foreground"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            aria-label={t("rotateRight")}
            title={t("rotateRight")}
            onClick={() => setRotationStep((step) => step + 1)}
            className="focus-ring grid size-9 place-items-center rounded text-muted transition hover:bg-surface-alt hover:text-foreground"
          >
            <ChevronRight size={18} />
          </button>
          <div className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
          <button
            type="button"
            aria-label={t("zoomIn")}
            title={t("zoomIn")}
            onClick={() => setCameraDistance((distance) => Math.max(0.72, distance - 0.12))}
            className="focus-ring grid size-9 place-items-center rounded text-muted transition hover:bg-surface-alt hover:text-foreground"
          >
            <Plus size={17} />
          </button>
          <button
            type="button"
            aria-label={t("zoomOut")}
            title={t("zoomOut")}
            onClick={() => setCameraDistance((distance) => Math.min(1.6, distance + 0.12))}
            className="focus-ring grid size-9 place-items-center rounded text-muted transition hover:bg-surface-alt hover:text-foreground"
          >
            <Minus size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}

useGLTF.preload("/3dmodels/RobotFullBody.glb");
