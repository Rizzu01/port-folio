import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = "https://creativerizz.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rizwan Khan | UI/UX, Graphic & Web Designer",
    template: "%s | Rizwan Khan",
  },
  description:
    "Explore Rizwan Khan's design portfolio featuring UI/UX design, graphic design, branding, web design, fintech creatives, and digital experiences. Available for opportunities and freelance projects.",
  applicationName: "CreativeRizz",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Rizwan Khan designer",
    "UI/UX designer portfolio",
    "graphic designer portfolio",
    "web designer portfolio",
    "brand identity design",
    "fintech design",
    "crypto graphic design",
    "freelance designer",
  ],
  openGraph: {
    title: "Rizwan Khan | UI/UX, Graphic & Web Designer",
    description:
      "Selected work in UI/UX, graphic design, branding, web design, and fintech creative design.",
    url: siteUrl,
    siteName: "CreativeRizz",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizwan Khan | Designer Portfolio",
    description:
      "UI/UX, graphic design, branding, web design, and fintech creative projects.",
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

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Rizwan Khan",
  url: siteUrl,
  jobTitle: "Designer",
  description:
    "Designer working across UI/UX, graphic design, branding, web design, and fintech creative projects.",
  sameAs: ["https://www.linkedin.com/in/rizwan-khan-44771826b/"],
};

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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
        <Analytics />
      </body>
    </html>
  );
}
