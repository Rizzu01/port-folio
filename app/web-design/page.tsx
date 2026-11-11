import type { Metadata } from "next";
import ServiceLanding from "../components/ServiceLanding";

export const metadata: Metadata = {
  title: "Responsive Web Design Portfolio | Rizwan Khan",
  description:
    "Explore responsive web design by Rizwan Khan, including website layouts, landing pages, interface systems and frontend-focused digital experiences.",
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
  return <ServiceLanding path="/web-design" eyebrow="Web Design" title="Responsive websites with thoughtful visual systems." intro="A good website balances brand expression, clear information and a smooth experience across screen sizes. My work spans web design, interface design and frontend implementation, with a focus on bringing the visual idea and the actual experience together." services={["Responsive page layouts", "Landing page visual design", "Website information hierarchy", "Typography and spacing systems", "UI details and interaction states", "Design-to-development collaboration"]} process={[{title:"Set the direction",detail:"Define the audience, purpose, content priorities and visual character of the website."},{title:"Design the experience",detail:"Create a clear layout with responsive behavior, readable typography and consistent components."},{title:"Review across screens",detail:"Check hierarchy and usability at desktop and mobile sizes and refine details before handoff or release."}]} workNote="My portfolio includes UI/UX and web design work. Visit the selected projects on the homepage to see the visual examples available, and ask about project scope, deliverables and implementation needs." keywords={["Website UI Design","Responsive Web Design","Landing Page Design","Frontend Design"]} />;
}
