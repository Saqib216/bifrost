import CTABand from "@/app/_components/CTAband";
import FeaturesGrid from "@/app/_components/FeaturesGrid";
import Hero from "@/app/_components/Hero";
import HowItWorks from "@/app/_components/HowItWorks";
import TrustStats from "@/app/_components/TrustStats";

export default function Home() {
  return (
    <main>
      <Hero />
      <TrustStats />
      <FeaturesGrid />
      <HowItWorks />
      <CTABand />
    </main>
  );
}