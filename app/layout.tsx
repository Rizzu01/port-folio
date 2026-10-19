import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "Mindly — A clearer mind for a brighter you", description: "Capture ideas, organize your thoughts, and stay focused — all in one beautiful space." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
