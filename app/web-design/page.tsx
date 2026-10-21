import type { Metadata } from "next";
import ServiceLanding from "../components/ServiceLanding";

export const metadata: Metadata = {
  title: "Web Designer Portfolio & Responsive Website Design",
  description: "Explore Rizwan Khan's web design portfolio, with responsive layouts, interface design and digital experiences shaped around clarity and usability.",
  alternates: { canonical: "/web-design" },
  openGraph: { title: "Web Design | Rizwan Khan", description: "Responsive website layouts and thoughtful digital experiences.", url: "https://creativerizz.in/web-design", type: "website" },
};

export default function Page() {
  return <ServiceLanding eyebrow="Web Design" title="Responsive websites with thoughtful visual systems." intro="A good website balances brand expression, clear information and a smooth experience across screen sizes. My work spans web design, interface design and frontend implementation, with a focus on bringing the visual idea and the actual experience together." services={["Responsive page layouts", "Landing page visual design", "Website information hierarchy", "Typography and spacing systems", "UI details and interaction states", "Design-to-development collaboration"]} process={[{title:"Set the direction",detail:"Define the audience, purpose, content priorities and visual character of the website."},{title:"Design the experience",detail:"Create a clear layout with responsive behavior, readable typography and consistent components."},{title:"Review across screens",detail:"Check hierarchy and usability at desktop and mobile sizes and refine details before handoff or release."}]} workNote="My portfolio includes UI/UX and web design work. Visit the selected projects on the homepage to see the visual examples available, and ask about project scope, deliverables and implementation needs." keywords={["Web Designer Portfolio","Website UI Design","Responsive Web Design","Landing Page Design","Frontend Design"]} />;
}
