// app/api/download-proxy/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const fileUrl = searchParams.get("url");
  const filename = searchParams.get("filename") || "video.mp4"; // Default filename

  if (!fileUrl) {
    return NextResponse.json(
      { error: "missingUrl", message: "url is required" },
      { status: 400 }
    );
  }

  try {
    // Allow http and https, but validate scheme and avoid javascript: or data: schemes
    if (!fileUrl.startsWith("https://") && !fileUrl.startsWith("http://")) {
      return NextResponse.json(
        {
          error: "invalidScheme",
          message: "Only http and https URLs are supported.",
        },
        { status: 400 }
      );
    }

    // Fetch the video from the external URL
    const videoResponse = await fetch(fileUrl);

    if (!videoResponse.ok) {
      throw new Error(`Failed to fetch video: ${videoResponse.statusText}`);
    }

    // Get the video data as a ReadableStream
    const videoStream = videoResponse.body;

    if (!videoStream) {
      throw new Error("Video stream is not available");
    }

    // Sanitize filename to prevent header injection and remove path
    const baseFilename = filename
      .replace(/[^a-zA-Z0-9._-]/g, "_")
      .slice(0, 200);

    // Derive extension from content-type if not present
    let contentType =
      videoResponse.headers.get("Content-Type") || "application/octet-stream";
    let finalFilename = baseFilename;
    if (!finalFilename.includes(".")) {
      if (contentType.includes("image/"))
        finalFilename = `${finalFilename}.jpg`;
      else if (contentType.includes("video/"))
        finalFilename = `${finalFilename}.mp4`;
      else finalFilename = `${finalFilename}.bin`;
    }

    // Set headers to force download
    const headers = new Headers();
    headers.set(
      "Content-Disposition",
      `attachment; filename="${finalFilename}"`
    );
    headers.set("Content-Type", contentType);
    // Only set Content-Length when it's a valid numeric value
    const contentLength = videoResponse.headers.get("Content-Length");
    if (contentLength && /^\d+$/.test(contentLength)) {
      headers.set("Content-Length", contentLength);
    }

    // Return the stream response
    return new NextResponse(videoStream, {
      status: 200,
      headers: headers,
    });
  } catch (error: any) {
    console.error("Download proxy error:", error);
    return NextResponse.json(
      { error: "serverError", message: error.message },
      { status: 500 }
    );
  }
}
