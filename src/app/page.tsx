import AppHub from "@/components/AppHub";
import BeforeAfter from "@/components/BeforeAfter";
import CoreLayers from "@/components/CoreLayers";
import Faq from "@/components/Faq";
import FinalCta from "@/components/FinalCta";
import Hero from "@/components/Hero";
import Nav from "@/components/Nav";
import OriginStory from "@/components/OriginStory";
import Pricing from "@/components/Pricing";
import Proof from "@/components/Proof";
import ScrollProgress from "@/components/ScrollProgress";
import StickyMobileCta from "@/components/StickyMobileCta";
import Workflow from "@/components/Workflow";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Nav />
      <main className="pb-20 md:pb-0">
        <Hero />
        <OriginStory />
        <BeforeAfter />
        <CoreLayers />
        <AppHub />
        <Workflow />
        <Proof />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <StickyMobileCta />
    </>
  );
}
