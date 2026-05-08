"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useTranslations } from "next-intl";

import { SectionViewer } from "@/components/robot3d/SectionViewer";
import { ConfigSection } from "@/components/sections/ConfigSection";
import {
  brainOptions,
  defaultSelections,
  energyOptions,
  movementOptions,
  sensorOptions,
} from "@/lib/robot-config";

function ModelLoading() {
  return (
    <div className="grid h-full place-items-center text-sm text-muted" aria-hidden="true">
      Loading 3D…
    </div>
  );
}

const BrainModel = dynamic(
  () => import("@/components/robot3d/BrainModel").then((module) => module.BrainModel),
  { ssr: false, loading: ModelLoading },
);

const EnergyModel = dynamic(
  () => import("@/components/robot3d/EnergyModel").then((module) => module.EnergyModel),
  { ssr: false, loading: ModelLoading },
);

const MovementModel = dynamic(
  () => import("@/components/robot3d/MovementModel").then((module) => module.MovementModel),
  { ssr: false, loading: ModelLoading },
);

const SensorsModel = dynamic(
  () => import("@/components/robot3d/SensorsModel").then((module) => module.SensorsModel),
  { ssr: false, loading: ModelLoading },
);

function SectionDivider({ label }: { label: string }) {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-hidden="true">
      <div className="flex items-center gap-4 py-2">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
        <span className="rounded-full border border-border/50 bg-surface/60 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted/50">
          {label}
        </span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-border to-transparent" />
      </div>
    </div>
  );
}

export function RobotSections() {
  const t = useTranslations();
  const [brain, setBrain] = useState<string>(defaultSelections.brain);
  const [energy, setEnergy] = useState<string>(defaultSelections.energy);
  const [movement, setMovement] = useState<string>(defaultSelections.movement);
  const [sensor, setSensor] = useState<string>("stereo_camera");

  const brainWithMeta = brainOptions.map((option) => ({
    ...option,
    name: t(`components.${option.id}.name`),
    desc: t(`components.${option.id}.desc`),
    specs: option.specs,
  }));

  const energyWithMeta = energyOptions.map((option) => ({
    ...option,
    name: t(`components.${option.id}.name`),
    desc: t(`components.${option.id}.desc`),
    specs: option.specs,
  }));

  const movementWithMeta = movementOptions.map((option) => ({
    ...option,
    name: t(`components.${option.id}.name`),
    desc: t(`components.${option.id}.desc`),
    specs: option.specs,
  }));

  const sensorsWithMeta = sensorOptions.map((option) => ({
    ...option,
    name: t(`components.${option.id}.name`),
    desc: t(`components.${option.id}.desc`),
    specs: option.specs,
  }));

  return (
    <>
      <ConfigSection
        id="brain"
        sectionNumber="01"
        sectionIndex={0}
        title={t("sections.brain.title")}
        copy={t("sections.brain.copy")}
        options={brainWithMeta}
        selectedIds={brain}
        onSelect={setBrain}
        viewer={
          <SectionViewer label="Brain 3D model">
            <BrainModel tier={brain} />
          </SectionViewer>
        }
      />
      <SectionDivider label={t("sections.energy.title")} />
      <ConfigSection
        id="energy"
        sectionNumber="02"
        sectionIndex={1}
        title={t("sections.energy.title")}
        copy={t("sections.energy.copy")}
        options={energyWithMeta}
        selectedIds={energy}
        onSelect={setEnergy}
        viewer={
          <SectionViewer label="Energy 3D model">
            <EnergyModel option={energy} />
          </SectionViewer>
        }
      />
      <SectionDivider label={t("sections.movement.title")} />
      <ConfigSection
        id="movement"
        sectionNumber="03"
        sectionIndex={2}
        title={t("sections.movement.title")}
        copy={t("sections.movement.copy")}
        options={movementWithMeta}
        selectedIds={movement}
        onSelect={setMovement}
        viewer={
          <SectionViewer label="Movement 3D model">
            <MovementModel option={movement} />
          </SectionViewer>
        }
      />
      <SectionDivider label={t("sections.sensors.title")} />
      <ConfigSection
        id="sensors"
        sectionNumber="04"
        sectionIndex={3}
        title={t("sections.sensors.title")}
        copy={t("sections.sensors.copy")}
        options={sensorsWithMeta}
        selectedIds={sensor}
        onSelect={setSensor}
        viewer={
          <SectionViewer label="Sensors 3D model">
            <SensorsModel selected={sensor} />
          </SectionViewer>
        }
      />
    </>
  );
}
