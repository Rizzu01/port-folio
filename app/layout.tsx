import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = "https://creativerizz.in";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rizwan Khan | UI/UX, Graphic & Web Designer in India",
    template: "%s | Rizwan Khan",
  },
  description:
    "Rizwan Khan is a UI/UX, graphic and web designer in India, creating thoughtful digital experiences, visual identities, campaign creatives and responsive websites. Explore selected work and connect for freelance or design opportunities.",
  applicationName: "CreativeRizz",
  alternates: {
    canonical: "/",
  },
  keywords: [
    "Rizwan Khan designer",
    "UI/UX designer portfolio",
    "UI UX designer India",
    "graphic designer portfolio",
    "graphic designer India",
    "web designer portfolio",
    "brand identity design",
    "fintech design",
    "crypto graphic design",
    "freelance UI UX designer",
  ],
  openGraph: {
    title: "Rizwan Khan | UI/UX, Graphic & Web Designer",
    description:
      "Explore selected UI/UX, graphic design, branding, web design and fintech creative work by Rizwan Khan.",
    url: siteUrl,
    siteName: "CreativeRizz",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Rizwan Khan | UI/UX, Graphic & Web Designer",
    description:
      "UI/UX, graphic design, branding, web design and fintech creative projects.",
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
  jobTitle: "UI/UX, Graphic & Web Designer",
  description:
    "Designer working across UI/UX, graphic design, branding, web design, and fintech creative projects.",
  sameAs: [
    "https://www.linkedin.com/in/rizwan-khan-44771826b/",
    "https://www.behance.net/creativeriz01",
    "https://in.pinterest.com/Creative___Rizz/",
  ],
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
