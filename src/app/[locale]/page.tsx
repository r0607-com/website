import { setRequestLocale } from "next-intl/server";

import { HeroSection } from "@/components/sections/HeroSection";
import { LanguagesSection } from "@/components/sections/LanguagesSection";
import { RobotSections } from "@/components/sections/RobotSections";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <main className="tron-grid pt-16 lg:pt-20">
      <HeroSection />
      <div className="divide-y divide-border/40">
        <RobotSections />
        <LanguagesSection />
      </div>
    </main>
  );
}
