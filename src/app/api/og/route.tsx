import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const title = searchParams.get("title") || "Gutter overflowing into marketplace";
    const uc = searchParams.get("uc") || "UC-7 Gulshan (NIPA / Block 13)";
    const town = searchParams.get("town") || "Gulshan-e-Iqbal Town";
    const daysOpen = searchParams.get("daysOpen") || "12";
    const affected = searchParams.get("affected") || "42";
    const official = searchParams.get("official") || "Faisal Siddiqui";
    const status = searchParams.get("status") || "open";

    const isFixed = status === "confirmed" || status === "marked_resolved" || status === "resolved";

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0f172a",
            color: "white",
            padding: "50px",
            fontFamily: "sans-serif",
          }}
        >
          {/* Header */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "#0d9488",
                }}
              />
              <span style={{ fontSize: "24px", fontWeight: "bold", letterSpacing: "1px", color: "#2dd4bf" }}>
                KARACHI CIVIC PLATFORM
              </span>
            </div>
            <div
              style={{
                backgroundColor: isFixed ? "#059669" : "#dc2626",
                color: "white",
                padding: "8px 20px",
                borderRadius: "9999px",
                fontSize: "20px",
                fontWeight: "bold",
              }}
            >
              {isFixed
                ? status === "confirmed"
                  ? "✓ FIXED & CONFIRMED"
                  : "✓ WORK COMPLETED & RESOLVED"
                : `${daysOpen} DAYS OPEN`}
            </div>
          </div>

          {/* Center Main Issue Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <span style={{ fontSize: "20px", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1.5px" }}>
              {uc} · {town}
            </span>
            <span style={{ fontSize: "48px", fontWeight: "bold", lineHeight: 1.2, color: "#f8fafc" }}>
              &quot;{title}&quot;
            </span>
          </div>

          {/* Bottom Card Footer */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderTop: "2px solid #334155",
              paddingTop: "30px",
            }}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "16px", color: "#94a3b8" }}>
                {isFixed ? "Work Completed By" : "Responsible Official"}
              </span>
              <span style={{ fontSize: "24px", fontWeight: "bold", color: "#f1f5f9" }}>
                {official} (UC Chairman)
              </span>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <span style={{ fontSize: "16px", color: "#94a3b8" }}>Citizen Impact</span>
                <span style={{ fontSize: "28px", fontWeight: "bold", color: "#2dd4bf" }}>
                  {affected} Affected
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return new Response(`Failed to generate OG image: ${msg}`, { status: 500 });
  }
}
