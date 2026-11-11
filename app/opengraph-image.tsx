import { ImageResponse } from "next/og";

export const alt = "CreativeRizz — Rizwan Khan, UI/UX, graphic and web designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 76px", background: "#f7f6f2", color: "#171715", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 58, height: 58, borderRadius: 16, background: "#171715", color: "#f5bd19", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 35, fontWeight: 800 }}>R</div>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1 }}>CreativeRizz</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 22, color: "#77756f", letterSpacing: 5, fontWeight: 600 }}>DESIGN PORTFOLIO</div>
          <div style={{ fontSize: 76, lineHeight: 1.04, fontWeight: 800, letterSpacing: -4 }}>Rizwan Khan</div>
          <div style={{ fontSize: 34, color: "#4d4b45" }}>UI/UX · Graphic · Web Design</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 21 }}>
          <span>Thoughtful digital experiences & visual design</span>
          <span style={{ color: "#9a7410", fontWeight: 700 }}>creativerizz.in</span>
        </div>
        <div style={{ position: "absolute", right: -90, top: -130, width: 440, height: 440, borderRadius: 220, border: "2px solid #e7d9b1" }} />
        <div style={{ position: "absolute", right: 40, top: 95, width: 18, height: 18, borderRadius: 9, background: "#e5b31b" }} />
      </div>
    ),
    { ...size },
  );
}
