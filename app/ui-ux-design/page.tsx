import type { Metadata } from "next";
import ServiceLanding from "../components/ServiceLanding";

export const metadata: Metadata = {
  title: "UI/UX Designer Portfolio & Product Design",
  description:
    "Explore UI/UX design by Rizwan Khan, including user flows, responsive interfaces, product screens and fintech experiences. View selected work and discuss a design project.",
  alternates: { canonical: "/ui-ux-design" },
  openGraph: {
    title: "UI/UX & Product Design | Rizwan Khan",
    description: "User flows, product interfaces and thoughtful responsive digital experiences.",
    url: "https://creativerizz.in/ui-ux-design",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <ServiceLanding path="/ui-ux-design" eyebrow="UI/UX & Product Design" title="UI/UX design that makes digital products clearer to use." intro="I work across visual design and digital experiences, bringing structure to interfaces and helping turn complex product ideas into clear, consistent user journeys. Explore my portfolio to see UI/UX and web design work." services={["User flows and information architecture", "Wireframes and interface layouts", "Responsive web and mobile UI", "Visual systems and component consistency", "Usability-minded design refinement", "Fintech and crypto product interfaces"]} process={[{title:"Understand",detail:"Clarify the audience, product goals, constraints and user needs before choosing a direction."},{title:"Structure",detail:"Organize content and journeys into understandable flows, layouts and interface priorities."},{title:"Design & refine",detail:"Develop a consistent visual language and refine responsive screens against the original goals."}]} workNote="My portfolio includes UI/UX and web design work alongside creative campaigns. Visit the selected work section for project visuals and professional context; each project should be evaluated against its actual scope and role." keywords={["Product UI Design","Web App Interface Design","Responsive UI","Fintech UX"]} />;
}
