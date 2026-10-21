import type { Metadata } from "next";
import ServiceLanding from "../components/ServiceLanding";

export const metadata: Metadata = {
  title: "Fintech & Crypto Design Portfolio",
  description: "Explore Rizwan Khan's fintech and crypto design work, including exchange campaign creatives, digital product interfaces and visual communication.",
  alternates: { canonical: "/fintech-crypto-design" },
  openGraph: { title: "Fintech & Crypto Design | Rizwan Khan", description: "Crypto campaigns, fintech interfaces and digital visual communication.", url: "https://creativerizz.in/fintech-crypto-design", type: "website" },
};

export default function Page() {
  return <ServiceLanding eyebrow="Fintech & Crypto Design" title="Digital design for fintech and crypto experiences." intro="Financial products need clear interfaces and visual communication that respects the complexity of the subject. My portfolio includes crypto campaign creative work alongside UI/UX, web design and digital marketing assets." services={["Crypto campaign and promotional creatives", "Exchange and product UI concepts", "Social media campaign systems", "Educational and marketing banners", "Fintech visual communication", "Brand-consistent digital assets"]} process={[{title:"Clarify the audience",detail:"Understand whether the asset needs to explain a product, support a campaign or guide a user through an interface."},{title:"Make the message clear",detail:"Prioritize information, visual hierarchy and a coherent style for the intended channel."},{title:"Keep it consistent",detail:"Align the design with brand rules and adapt the work to its relevant placements and screen sizes."}]} workNote="The portfolio features crypto campaign work and UI/UX & web design categories. Review the projects on the homepage for visual examples. Any results, performance metrics or product claims should be confirmed before publication." keywords={["Fintech UI/UX Designer","Crypto Graphic Designer","Crypto Campaign Design","Fintech Visual Design","Exchange UI Design"]} />;
}
