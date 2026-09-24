/**
 * Client-Side Multi-Tier WebP Image Compression (Section 11.0c, Section 11.5, Section 13.1)
 *
 * Requirements from Spec:
 * 1. Resized to 1280px long edge max, WebP format, target <= 200KB
 * 2. Multi-tier generation: full (1280px), card (800px), thumbnail (320px)
 * 3. Strips EXIF automatically (drawing onto Canvas drops EXIF)
 * 4. Stamped with capture timestamp and GPS coordinates at time of capture
 */

export interface CompressedTier {
  dataUrl: string;
  width: number;
  height: number;
  sizeBytes: number;
  tier: "full" | "card" | "thumb";
}

export interface CompressionResult {
  full: CompressedTier;
  card: CompressedTier;
  thumb: CompressedTier;
}

/**
 * Calculates proportional aspect ratio dimensions capped by maxDimension
 */
function calculateDimensions(
  srcWidth: number,
  srcHeight: number,
  maxDimension: number
): { width: number; height: number } {
  if (srcWidth <= maxDimension && srcHeight <= maxDimension) {
    return { width: srcWidth, height: srcHeight };
  }

  const ratio = srcWidth / srcHeight;
  if (ratio > 1) {
    // Landscape
    return {
      width: maxDimension,
      height: Math.round(maxDimension / ratio),
    };
  } else {
    // Portrait or Square
    return {
      width: Math.round(maxDimension * ratio),
      height: maxDimension,
    };
  }
}

/**
 * Compresses an HTMLVideoElement or HTMLImageElement into 3 WebP sizes
 */
export async function compressImageTiers(
  source: HTMLVideoElement | HTMLImageElement | CanvasImageSource,
  sourceWidth: number,
  sourceHeight: number,
  gps?: { lat: number; lng: number }
): Promise<CompressionResult> {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d", { willReadFrequently: true });

  if (!ctx) {
    throw new Error("Unable to create canvas 2D rendering context");
  }

  const timestamp = new Date().toISOString().replace("T", " ").substring(0, 19) + " PKT";

  // Helper to render and extract a specific tier
  const renderTier = (
    maxDimension: number,
    quality: number,
    tier: "full" | "card" | "thumb",
    addTimestampOverlay: boolean = false
  ): CompressedTier => {
    const { width, height } = calculateDimensions(sourceWidth, sourceHeight, maxDimension);
    canvas.width = width;
    canvas.height = height;

    // Draw frame (automatically strips EXIF)
    ctx.drawImage(source, 0, 0, width, height);

    // Optional GPS and capture time stamp overlay for proof (Section 11.0c)
    if (addTimestampOverlay && width >= 600) {
      ctx.fillStyle = "rgba(0, 0, 0, 0.6)";
      ctx.fillRect(10, height - 36, width - 20, 26);

      ctx.fillStyle = "#ffffff";
      ctx.font = "bold 11px monospace";
      const stampText = gps
        ? `📍 ${gps.lat.toFixed(5)}, ${gps.lng.toFixed(5)}  |  ⏱ ${timestamp}  |  Karachi Civic Verified`
        : `⏱ ${timestamp}  |  Karachi Civic Verified`;
      ctx.fillText(stampText, 16, height - 19);
    }

    let dataUrl = canvas.toDataURL("image/webp", quality);
    // If browser doesn't support WebP export and returns PNG instead, attempt jpeg or retain output
    if (!dataUrl.startsWith("data:image/webp") && !dataUrl.startsWith("data:image/")) {
      dataUrl = canvas.toDataURL("image/jpeg", quality);
    }
    const commaIndex = dataUrl.indexOf(",");
    const base64Data = commaIndex !== -1 ? dataUrl.slice(commaIndex + 1) : dataUrl;
    const sizeBytes = Math.round(base64Data.length * 0.75);

    return {
      dataUrl,
      width,
      height,
      sizeBytes,
      tier,
    };
  };

  // 1. Full Tier (1280px long edge max, quality 0.82)
  const full = renderTier(1280, 0.82, "full", true);

  // 2. Card Tier (800px long edge max, quality 0.80)
  const card = renderTier(800, 0.80, "card", false);

  // 3. Thumbnail Tier (320px long edge max, quality 0.75)
  const thumb = renderTier(320, 0.75, "thumb", false);

  return { full, card, thumb };
}
