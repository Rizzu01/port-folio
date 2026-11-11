import { NextRequest } from "next/server";
import { GET as getPinterestPins } from "./api/pinterest/pins/route";
import type { PinResponse } from "./components/pinterest-projects";
import HomeClient from "./home-client";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let initialPinterestData: PinResponse = {
    configured: false,
    pins: [],
    message: "Pinterest projects are temporarily unavailable.",
  };

  try {
    const response = await getPinterestPins(
      new NextRequest("https://creativerizz.in/api/pinterest/pins")
    );
    if (response.ok) {
      initialPinterestData = (await response.json()) as PinResponse;
    }
  } catch (error) {
    console.error("Server-rendered homepage Pinterest load failed:", error);
  }

  return <HomeClient initialPinterestData={initialPinterestData} />;
}
