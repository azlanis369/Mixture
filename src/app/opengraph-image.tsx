import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "80px",
          background: "linear-gradient(135deg, #101410 0%, #1a1d1a 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 18px",
            borderRadius: 999,
            border: "1px solid rgba(184,134,11,0.5)",
            color: "#b8860b",
            fontSize: 22,
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          EARLY ACCESS · BETA · HARGA FOUNDING REN
        </div>
        <div
          style={{
            marginTop: 36,
            fontSize: 84,
            fontWeight: 800,
            color: "#eef3f0",
            lineHeight: 1.05,
          }}
        >
          RENFlow Plus
        </div>
        <div
          style={{
            marginTop: 20,
            fontSize: 34,
            color: "#aab8b0",
            maxWidth: 880,
            lineHeight: 1.35,
          }}
        >
          Anda REN yang bagus. Sistem anda yang bersepah.
        </div>
        <div
          style={{
            marginTop: 48,
            display: "flex",
            alignItems: "center",
            gap: 14,
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#0e7c5a",
            }}
          />
          <div style={{ fontSize: 26, color: "#eef3f0", fontWeight: 600 }}>
            Profile · Listing · Lead · Follow-up — satu flow
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
