"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { useLocale, useTranslations } from "next-intl";

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

export function RobotSections() {
  const locale = useLocale();
  const t = useTranslations();
  const [brain, setBrain] = useState<string>(defaultSelections.brain);
  const [energy, setEnergy] = useState<string>(defaultSelections.energy);
  const [movement, setMovement] = useState<string>(defaultSelections.movement);
  const [sensors, setSensors] = useState<string[]>([...defaultSelections.sensors]);

  function toggleSensor(id: string) {
    setSensors((previous) =>
      previous.includes(id)
        ? previous.filter((sensorId) => sensorId !== id)
        : [...previous, id],
    );
  }

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
  }));

  const viewerLabels =
    locale === "de"
      ? {
          brain: "3D-Modell des Gehirns",
          energy: "3D-Modell der Energieversorgung",
          movement: "3D-Modell der Bewegung",
          sensors: "3D-Modell der Sensoren",
        }
      : {
          brain: "Brain 3D model",
          energy: "Energy 3D model",
          movement: "Movement 3D model",
          sensors: "Sensors 3D model",
        };

  return (
    <>
      <ConfigSection
        id="brain"
        kicker={t("sections.brain.kicker")}
        title={t("sections.brain.title")}
        copy={t("sections.brain.copy")}
        options={brainWithMeta}
        selectedIds={brain}
        onSelect={setBrain}
        viewer={
          <SectionViewer label={viewerLabels.brain}>
            <BrainModel tier={brain} />
          </SectionViewer>
        }
      />
      <ConfigSection
        id="energy"
        kicker={t("sections.energy.kicker")}
        title={t("sections.energy.title")}
        copy={t("sections.energy.copy")}
        options={energyWithMeta}
        selectedIds={energy}
        onSelect={setEnergy}
        viewer={
          <SectionViewer label={viewerLabels.energy}>
            <EnergyModel option={energy} />
          </SectionViewer>
        }
      />
      <ConfigSection
        id="movement"
        kicker={t("sections.movement.kicker")}
        title={t("sections.movement.title")}
        copy={t("sections.movement.copy")}
        options={movementWithMeta}
        selectedIds={movement}
        onSelect={setMovement}
        viewer={
          <SectionViewer label={viewerLabels.movement}>
            <MovementModel option={movement} />
          </SectionViewer>
        }
      />
      <ConfigSection
        id="sensors"
        kicker={t("sections.sensors.kicker")}
        title={t("sections.sensors.title")}
        copy={t("sections.sensors.copy")}
        options={sensorsWithMeta}
        selectedIds={sensors}
        multiSelect
        onSelect={toggleSensor}
        viewer={
          <SectionViewer label={viewerLabels.sensors}>
            <SensorsModel selected={sensors} />
          </SectionViewer>
        }
      />
    </>
  );
}
