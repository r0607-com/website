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

const RobotModel = dynamic(
  () => import("@/components/robot3d/RobotModel").then((module) => module.RobotModel),
  { ssr: false, loading: ModelLoading },
);

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
    <section className="site-shell grid gap-10 py-16 lg:grid-cols-[minmax(440px,0.9fr)_minmax(0,1fr)] lg:gap-14 lg:py-24">
      <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)]">
        <SectionViewer
          label="Interactive robot 3D model"
          className="h-[420px] sm:h-[560px] lg:h-full lg:min-h-0"
        >
          <RobotModel brain={brain} energy={energy} movement={movement} sensor={sensor} />
        </SectionViewer>
      </div>
      <div className="divide-y divide-border/40">
        <ConfigSection
          id="brain"
          sectionNumber="01"
          sectionIndex={0}
          title={t("sections.brain.title")}
          copy={t("sections.brain.copy")}
          options={brainWithMeta}
          selectedIds={brain}
          onSelect={setBrain}
        />
        <ConfigSection
          id="energy"
          sectionNumber="02"
          sectionIndex={1}
          title={t("sections.energy.title")}
          copy={t("sections.energy.copy")}
          options={energyWithMeta}
          selectedIds={energy}
          onSelect={setEnergy}
        />
        <ConfigSection
          id="movement"
          sectionNumber="03"
          sectionIndex={2}
          title={t("sections.movement.title")}
          copy={t("sections.movement.copy")}
          options={movementWithMeta}
          selectedIds={movement}
          onSelect={setMovement}
        />
        <ConfigSection
          id="sensors"
          sectionNumber="04"
          sectionIndex={3}
          title={t("sections.sensors.title")}
          copy={t("sections.sensors.copy")}
          options={sensorsWithMeta}
          selectedIds={sensor}
          onSelect={setSensor}
        />
      </div>
    </section>
  );
}
