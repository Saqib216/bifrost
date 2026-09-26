import CTABand from "@/app/_components/CTAband";
import FeaturesGrid from "@/app/_components/FeaturesGrid";
import Hero from "@/app/_components/Hero";
import HowItWorks from "@/app/_components/HowItWorks";
import TrustStats from "@/app/_components/TrustStats";
import Navbar from "@/app/_components/Navbar";
import Footer from "./_components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-surface">
      <Navbar />
      <main className="flex-1">
        <Hero />
        <TrustStats />
        <FeaturesGrid />
        <HowItWorks />
        <CTABand />
      </main>
      <Footer />
    </div>
  );
}
