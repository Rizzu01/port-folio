import type { Metadata } from "next";
import ServiceLanding from "../components/ServiceLanding";

export const metadata: Metadata = {
  title: "UI/UX Designer in Jaipur | Product & App Design",
  description:
    "Explore the UI/UX portfolio of Rizwan Khan, a designer in Jaipur, India. User flows, mobile app interfaces, responsive web UI and fintech product design.",
  alternates: { canonical: "/ui-ux-design" },
  openGraph: {
    title: "UI/UX & Product Design | Rizwan Khan",
    description: "User flows, product interfaces and thoughtful responsive digital experiences.",
    url: "https://www.creativerizz.in/ui-ux-design",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <ServiceLanding path="/ui-ux-design" eyebrow="UI/UX & Product Design" title="UI/UX design for apps, websites and digital products." intro="I’m Rizwan Khan, a UI/UX designer in Jaipur, India, working on mobile app interfaces, website UI, user flows and responsive digital experiences. I help organize complex product ideas into intuitive layouts and clear user journeys. Explore my UI/UX portfolio for selected work." services={["User flows and information architecture", "Wireframes and interface layouts", "Responsive web and mobile UI", "Visual systems and component consistency", "Usability-minded design refinement", "Fintech and crypto product interfaces"]} process={[{title:"Understand",detail:"Clarify the audience, product goals, constraints and user needs before choosing a direction."},{title:"Structure",detail:"Organize content and journeys into understandable flows, layouts and interface priorities."},{title:"Design & refine",detail:"Develop a consistent visual language and refine responsive screens against the original goals."}]} workNote="My portfolio includes UI/UX and web design work alongside creative campaigns. Visit the selected work section for project visuals and professional context; each project should be evaluated against its actual scope and role." keywords={["UI/UX Designer in Jaipur","Freelance UI/UX Designer","Mobile App UI Design","Web App Interface Design"]} />;
}
