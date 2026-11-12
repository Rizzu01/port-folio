import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import { DM_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({ subsets: ["latin"], weight: ["400", "500", "600", "700"], display: "swap", variable: "--font-dm-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["500", "600"], style: ["normal", "italic"], display: "swap", variable: "--font-playfair" });

const siteUrl = "https://www.creativerizz.in";
const personUrl = `${siteUrl}/#person`;

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rizwan Khan – UI/UX & Graphic Designer | CreativeRizz",
    template: "%s | Rizwan Khan",
  },
  description:
    "Rizwan Khan is a UI/UX, graphic and web designer in India. Explore product interfaces, brand visuals, campaign design and responsive websites, or get in touch about a project.",
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
    title: "Rizwan Khan – UI/UX & Graphic Designer | CreativeRizz",
    description:
      "Explore UI/UX, graphic and web design by Rizwan Khan at CreativeRizz. View selected projects and discuss a design project.",
    url: siteUrl,
    siteName: "CreativeRizz",
    locale: "en_IN",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "CreativeRizz — Rizwan Khan, UI/UX, graphic and web designer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizwan Khan – UI/UX & Graphic Designer | CreativeRizz",
    description:
      "UI/UX, graphic and web design portfolio by Rizwan Khan. Explore CreativeRizz projects and get in touch.",
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
      <body className={`${dmSans.variable} ${playfair.variable}`}>
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
