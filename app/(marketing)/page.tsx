import { MarketingHero } from "@/components/marketing/hero";
import { MarketingFeatures } from "@/components/marketing/features";
import { MarketingSimulator } from "@/components/marketing/simulator";
import { MarketingFilecoinSection } from "@/components/marketing/filecoin-section";

export default function MarketingPage() {
  return (
    <>
      <MarketingHero />
      <MarketingFeatures />
      <MarketingSimulator />
      <MarketingFilecoinSection />
    </>
  );
}
