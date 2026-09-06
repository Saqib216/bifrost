import CTABand from "@/components/CTAband";
import FeaturesGrid from "@/components/FeaturesGrid";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import TrustStats from "@/components/TrustStats";

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