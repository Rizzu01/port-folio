import type { Metadata } from "next";
import ServiceLanding from "../components/ServiceLanding";

export const metadata: Metadata = {
  title: "Graphic Designer in Jaipur | Portfolio & Services",
  description:
    "Explore graphic design services and portfolio work by Rizwan Khan in Jaipur, India: social media posts, ad creatives, banners and brand visuals.",
  alternates: { canonical: "/graphic-design" },
  openGraph: {
    title: "Graphic & Visual Design | Rizwan Khan",
    description: "Campaign creatives, social media graphics and visual communication projects.",
    url: "https://www.creativerizz.in/graphic-design",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <ServiceLanding path="/graphic-design" eyebrow="Graphic & Visual Design" title="Graphic design for social media, brands and campaigns." intro="I’m Rizwan Khan, a graphic designer in Jaipur, India. My portfolio includes social media post design, digital ad creatives, campaign banners and brand visuals for businesses and digital products. I focus on clear messaging, strong typography and practical design files." services={["Social media campaign creatives", "Digital marketing graphics", "Promotional banners and mailers", "Typography and visual hierarchy", "Campaign systems and creative variations", "Presentation and marketing visuals"]} process={[{title:"Find the message",detail:"Understand the audience, communication goal, format and key information the design needs to carry."},{title:"Build the concept",detail:"Explore composition, typography, imagery and a visual direction suited to the campaign."},{title:"Prepare the assets",detail:"Refine the layout for its intended format and keep visual consistency across related deliverables."}]} workNote="The portfolio features crypto campaigns, social media creatives and other visual design work. Review the homepage projects for examples, and contact me with a brief, timeline and intended deliverables." keywords={["Graphic Designer in Jaipur","Freelance Graphic Designer India","Social Media Post Design","Digital Ad Creatives"]} />;
}
