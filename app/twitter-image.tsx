import { ImageResponse } from "next/og";

export const alt = "CreativeRizz — Rizwan Khan, UI/UX, graphic and web designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "64px 76px", background: "#171715", color: "#f7f6f2", fontFamily: "Arial, sans-serif" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 58, height: 58, borderRadius: 16, background: "#f5bd19", color: "#171715", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 35, fontWeight: 800 }}>R</div>
          <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1 }}>CreativeRizz</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 22, color: "#c5b98f", letterSpacing: 5, fontWeight: 600 }}>DESIGN PORTFOLIO</div>
          <div style={{ fontSize: 76, lineHeight: 1.04, fontWeight: 800, letterSpacing: -4 }}>Rizwan Khan</div>
          <div style={{ fontSize: 34, color: "#e3e0d8" }}>UI/UX · Graphic · Web Design</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 21 }}>
          <span>Thoughtful digital experiences & visual design</span>
          <span style={{ color: "#f5bd19", fontWeight: 700 }}>creativerizz.in</span>
        </div>
        <div style={{ position: "absolute", right: -90, top: -130, width: 440, height: 440, borderRadius: 220, border: "2px solid #66562a" }} />
        <div style={{ position: "absolute", right: 40, top: 95, width: 18, height: 18, borderRadius: 9, background: "#f5bd19" }} />
      </div>
    ),
    { ...size },
  );
}
