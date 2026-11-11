import type { PinResponse } from "./components/pinterest-projects";
import HomeClient from "./home-client";

// Keep the homepage render independent from Pinterest's external API.
// Pinterest content refreshes in the browser after the critical page content is visible.
const initialPinterestData: PinResponse = {
  configured: true,
  pins: [],
};

export default function HomePage() {
  return <HomeClient initialPinterestData={initialPinterestData} />;
}
