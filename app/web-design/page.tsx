import type { Metadata } from "next";
import ServiceLanding from "../components/ServiceLanding";

export const metadata: Metadata = {
  title: "Web Designer in Jaipur | Responsive Website Design",
  description:
    "Explore web design by Rizwan Khan in Jaipur, India: responsive websites, landing page design, interface layouts and frontend-focused digital experiences.",
  alternates: { canonical: "/web-design" },
  openGraph: {
    title: "Web Design & Responsive Websites | Rizwan Khan",
    description: "Responsive website layouts, landing pages and thoughtful digital experiences.",
    url: "https://www.creativerizz.in/web-design",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630 }],
  },
};

export default function Page() {
  return <ServiceLanding path="/web-design" eyebrow="Web Design" title="Responsive web design for websites and landing pages." intro="I’m Rizwan Khan, a web designer in Jaipur, India. I design responsive websites, landing pages and clear interfaces that work across desktop and mobile. My work brings together visual direction, page hierarchy and frontend implementation." services={["Responsive page layouts", "Landing page visual design", "Website information hierarchy", "Typography and spacing systems", "UI details and interaction states", "Design-to-development collaboration"]} process={[{title:"Set the direction",detail:"Define the audience, purpose, content priorities and visual character of the website."},{title:"Design the experience",detail:"Create a clear layout with responsive behavior, readable typography and consistent components."},{title:"Review across screens",detail:"Check hierarchy and usability at desktop and mobile sizes and refine details before handoff or release."}]} workNote="My portfolio includes UI/UX and web design work. Visit the selected projects on the homepage to see the visual examples available, and ask about project scope, deliverables and implementation needs." keywords={["Web Designer in Jaipur","Responsive Website Design","Landing Page Designer","Frontend Web Design"]} />;
}
