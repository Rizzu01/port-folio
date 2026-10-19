import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "Rizwan Khan — Designer & Visual Thinker",
  description: "Portfolio of Rizwan Khan: graphic design, visual communication, branding, digital marketing creatives, UI/UX design, and frontend development.",
  openGraph: { title: "Rizwan Khan — Designer & Visual Thinker", description: "Visual communication, branding, UI/UX, and digital experiences.", type: "website" }
};
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
