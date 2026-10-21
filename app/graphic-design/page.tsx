import type { Metadata } from "next";
import ServiceLanding from "../components/ServiceLanding";

export const metadata: Metadata = {
  title: "Graphic Designer Portfolio & Creative Design",
  description: "Explore Rizwan Khan's graphic design portfolio across campaign creatives, social media visuals, digital marketing assets and visual communication.",
  alternates: { canonical: "/graphic-design" },
  openGraph: { title: "Graphic Design | Rizwan Khan", description: "Campaign creatives, digital marketing visuals and visual communication.", url: "https://creativerizz.in/graphic-design", type: "website" },
};

export default function Page() {
  return <ServiceLanding eyebrow="Graphic & Visual Design" title="Graphic design built around a clear visual idea." intro="From campaign graphics to digital marketing creatives, strong graphic design makes a message easier to notice and understand. My portfolio brings together visual communication, creative direction and production-ready design work." services={["Social media campaign creatives", "Digital marketing graphics", "Promotional banners and mailers", "Typography and visual hierarchy", "Campaign systems and creative variations", "Presentation and marketing visuals"]} process={[{title:"Find the message",detail:"Understand the audience, communication goal, format and key information the design needs to carry."},{title:"Build the concept",detail:"Explore composition, typography, imagery and a visual direction suited to the campaign."},{title:"Prepare the assets",detail:"Refine the layout for its intended format and keep visual consistency across related deliverables."}]} workNote="The portfolio features crypto campaigns, social media creatives and other visual design work. Review the homepage projects for examples, and contact me with a brief, timeline and intended deliverables." keywords={["Graphic Designer Portfolio","Social Media Design","Digital Marketing Creatives","Campaign Design","Visual Communication"]} />;
}
