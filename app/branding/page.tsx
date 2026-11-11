import type { Metadata } from "next";
import ServiceLanding from "../components/ServiceLanding";

export const metadata: Metadata = {
  title: "Brand Identity & Branding Design Portfolio",
  description:
    "Explore branding and visual identity work by Rizwan Khan, including logo applications, typography, colour direction and consistent brand communication.",
  alternates: { canonical: "/branding" },
  openGraph: {
    title: "Brand Identity & Creative Design | Rizwan Khan",
    description: "Visual identity, creative direction and consistent brand applications.",
    url: "https://creativerizz.in/branding",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <ServiceLanding path="/branding" eyebrow="Branding & Identity" title="Visual identities with a consistent point of view." intro="Branding is more than a logo. It is the combination of visual choices that helps a business communicate with consistency across touchpoints. I approach identity work through concept, typography, color, layout and practical applications." services={["Visual identity exploration", "Logo and mark applications", "Color and typography direction", "Brand collateral and templates", "Social and campaign consistency", "Brand presentation mockups"]} process={[{title:"Understand the brand",detail:"Clarify the audience, positioning, personality and practical contexts where the identity will appear."},{title:"Explore the system",detail:"Develop a visual direction through typography, color, graphic language and identity applications."},{title:"Apply consistently",detail:"Check how the system works across relevant assets and document practical usage where required."}]} workNote="The homepage includes a Branding & Creative Design project category. Explore the portfolio to review the available work and discuss the specific identity assets needed for your project." keywords={["Brand Identity","Logo Design","Visual Identity","Creative Direction"]} />;
}
