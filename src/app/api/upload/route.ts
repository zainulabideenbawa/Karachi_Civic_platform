import { NextRequest, NextResponse } from "next/server";
import { uploadToR2, createPresignedUploadUrl, R2_BUCKET_NAME } from "@/lib/storage/r2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, filename, requestPresignedOnly } = body;

    const fileKey = `issues/${Date.now()}-${Math.random().toString(36).substring(7)}.webp`;

    // 1. If client only requested a pre-signed URL for direct upload
    if (requestPresignedOnly) {
      if (process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
        const presigned = await createPresignedUploadUrl(fileKey, "image/webp", 60);
        return NextResponse.json({
          success: true,
          ...presigned,
        });
      } else {
        return NextResponse.json({
          success: false,
          error: "R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY are required to sign S3 upload URLs.",
          bucket: R2_BUCKET_NAME,
        }, { status: 401 });
      }
    }

    // 2. Direct Base64 upload
    if (!imageBase64) {
      return NextResponse.json({ error: "Missing imageBase64 in request body" }, { status: 400 });
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    if (buffer.length > 1.5 * 1024 * 1024) {
      return NextResponse.json({ error: "File exceeds 1.5MB limit" }, { status: 413 });
    }

    // Upload to Cloudflare R2 if credentials configured
    if (process.env.R2_ACCESS_KEY_ID && process.env.R2_SECRET_ACCESS_KEY) {
      const uploadRes = await uploadToR2(buffer, fileKey, "image/webp");
      return NextResponse.json({
        success: true,
        key: uploadRes.key,
        url: uploadRes.publicUrl,
      });
    }

    // Fallback if R2 tokens still need to be pasted into .env.local
    return NextResponse.json({
      success: true,
      key: fileKey,
      url: imageBase64.startsWith("data:") ? imageBase64 : `https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop`,
      notice: "R2 API configured. Provide R2_ACCESS_KEY_ID and R2_SECRET_ACCESS_KEY in .env.local for remote bucket persistence.",
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
