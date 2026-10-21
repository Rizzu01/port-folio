import type { Metadata } from "next";
import ServiceLanding from "../components/ServiceLanding";

export const metadata: Metadata = {
  title: "Brand Identity & Graphic Design Portfolio",
  description: "Explore Rizwan Khan's branding and creative design portfolio, including visual identity thinking, logo applications, typography and campaign consistency.",
  alternates: { canonical: "/branding" },
  openGraph: { title: "Branding & Creative Design | Rizwan Khan", description: "Visual identity, creative direction and consistent brand applications.", url: "https://creativerizz.in/branding", type: "website" },
};

export default function Page() {
  return <ServiceLanding eyebrow="Branding & Identity" title="Visual identities with a consistent point of view." intro="Branding is more than a logo. It is the combination of visual choices that helps a business communicate with consistency across touchpoints. I approach identity work through concept, typography, color, layout and practical applications." services={["Visual identity exploration", "Logo and mark applications", "Color and typography direction", "Brand collateral and templates", "Social and campaign consistency", "Brand presentation mockups"]} process={[{title:"Understand the brand",detail:"Clarify the audience, positioning, personality and practical contexts where the identity will appear."},{title:"Explore the system",detail:"Develop a visual direction through typography, color, graphic language and identity applications."},{title:"Apply consistently",detail:"Check how the system works across relevant assets and document practical usage where required."}]} workNote="The homepage includes a Branding & Creative Design project category. Explore the portfolio to review the available work and discuss the specific identity assets needed for your project." keywords={["Brand Identity Designer","Branding Portfolio","Logo Design","Visual Identity","Creative Design"]} />;
}
