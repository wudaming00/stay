import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Stay — an AI for the moments you can't be alone";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#faf7f2",
          backgroundImage:
            "radial-gradient(ellipse at top, rgba(123, 143, 110, 0.12), transparent 60%), radial-gradient(ellipse at bottom, rgba(155, 134, 106, 0.08), transparent 60%)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "100px",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 180,
            fontStyle: "italic",
            color: "#1f1d1a",
            letterSpacing: "-0.04em",
            display: "flex",
            alignItems: "baseline",
          }}
        >
          stay<span style={{ color: "#7b8f6e", fontStyle: "normal" }}>.</span>
        </div>
        <div
          style={{
            marginTop: 30,
            fontSize: 42,
            color: "#6b6862",
            lineHeight: 1.3,
            maxWidth: 900,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>An AI for the moments</span>
          <span>you can&apos;t be alone.</span>
        </div>
        <div
          style={{
            marginTop: 60,
            fontSize: 22,
            color: "#a8a39b",
            letterSpacing: "0.15em",
            textTransform: "uppercase",
            fontFamily: "system-ui, sans-serif",
            display: "flex",
          }}
        >
          free for everyone · thestay.app
        </div>
      </div>
    ),
    size
  );
}
