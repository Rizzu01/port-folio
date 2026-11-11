import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = "https://creativerizz.in";
const personUrl = `${siteUrl}/#person`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rizwan Khan | UI/UX, Graphic & Web Designer",
    template: "%s | Rizwan Khan",
  },
  description:
    "Explore the portfolio of Rizwan Khan, a UI/UX, graphic and web designer in India. View selected digital products, visual identities, campaign designs and responsive websites.",
  applicationName: "CreativeRizz",
  creator: "Rizwan Khan",
  publisher: "Rizwan Khan",
  category: "Design",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Rizwan Khan designer",
    "UI/UX designer portfolio",
    "UI/UX designer India",
    "graphic designer portfolio",
    "graphic designer India",
    "web designer portfolio",
    "visual designer portfolio",
    "brand identity design",
    "freelance UI/UX designer",
  ],
  openGraph: {
    title: "Rizwan Khan | UI/UX, Graphic & Web Designer",
    description:
      "Selected UI/UX, graphic design, branding and web design work by Rizwan Khan. Explore the portfolio and get in touch about a project.",
    url: siteUrl,
    siteName: "CreativeRizz",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CreativeRizz — Rizwan Khan, UI/UX, graphic and web designer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizwan Khan | UI/UX, Graphic & Web Designer",
    description:
      "Selected UI/UX, graphic design, branding and web design work by Rizwan Khan.",
    images: ["/twitter-image"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Person",
    "@id": personUrl,
    name: "Rizwan Khan",
    url: siteUrl,
    image: `${siteUrl}/portrait.png`,
    jobTitle: "UI/UX, Graphic & Web Designer",
    description:
      "Designer working across UI/UX, graphic design, visual communication, branding and web design.",
    knowsAbout: [
      "User experience design",
      "User interface design",
      "Graphic design",
      "Visual communication",
      "Brand identity design",
      "Web design",
      "Responsive web design",
      "Fintech design",
    ],
    sameAs: [
      "https://www.linkedin.com/in/rizwan-khan-44771826b/",
      "https://www.behance.net/creativeriz01",
      "https://in.pinterest.com/Creative___Rizz/",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    name: "CreativeRizz",
    alternateName: "Rizwan Khan Design Portfolio",
    url: siteUrl,
    inLanguage: "en-IN",
    author: { "@id": personUrl },
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
