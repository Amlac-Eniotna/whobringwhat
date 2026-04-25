import { readFileSync } from "fs";
import { ImageResponse } from "next/og";
import { join } from "path";

// Force Node.js runtime to allow fs access
export const runtime = "nodejs";

export const alt = "QuiRamèneQuoi - Organisez vos soirées";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

async function loadGoogleFont(family: string, weight: number, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(
    text,
  )}`;
  const css = await (
    await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    })
  ).text();
  const match = css.match(
    /src:\s*url\((.+?)\)\s*format\('(?:opentype|truetype|woff2?)'\)/,
  );
  if (!match) throw new Error(`Failed to parse font CSS for ${family}`);
  const res = await fetch(match[1]);
  if (!res.ok) throw new Error(`Failed to fetch font file for ${family}`);
  return res.arrayBuffer();
}

export default async function Image() {
  // Read the logo file from the public directory
  const logoPath = join(process.cwd(), "public", "logo-without-border.svg");
  const logoData = readFileSync(logoPath);
  const logoBase64 = logoData.toString("base64");
  const logoSrc = `data:image/svg+xml;base64,${logoBase64}`;

  const titleText = "QuiRamèneQuoi";
  const subtitleText = "Organisez vos soirées simplement";

  const [syneData, nunitoSansData] = await Promise.all([
    loadGoogleFont("Syne", 800, titleText),
    loadGoogleFont("Nunito+Sans", 400, subtitleText),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          background: "linear-gradient(to bottom right, #ffffff, #ffffff)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 32,
          }}
        >
          {/* Logo Image */}
          <img
            src={logoSrc}
            alt="QuiRamèneQuoi Logo"
            width={106}
            height={192}
          />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontFamily: "Syne",
                fontSize: 64,
                fontWeight: 800,
                color: "#000000",
              }}
            >
              {titleText}
            </div>
            <div
              style={{
                fontFamily: "Nunito Sans",
                fontSize: 32,
                marginTop: 20,
                color: "#000000",
              }}
            >
              {subtitleText}
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Syne", data: syneData, weight: 800, style: "normal" },
        {
          name: "Nunito Sans",
          data: nunitoSansData,
          weight: 400,
          style: "normal",
        },
      ],
    },
  );
}
