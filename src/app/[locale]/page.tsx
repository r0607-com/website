import { HeroSection } from "@/components/sections/HeroSection";
import { LanguagesSection } from "@/components/sections/LanguagesSection";
import { RobotSections } from "@/components/sections/RobotSections";

export default function HomePage() {
  return (
    <main className="tron-grid pt-16">
      <HeroSection />
      <div className="divide-y divide-border/40">
        <RobotSections />
        <LanguagesSection />
      </div>
    </main>
  );
}
