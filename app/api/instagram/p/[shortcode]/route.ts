import { NextRequest, NextResponse } from "next/server";

import { IG_GraphQLResponseDto, EdgeSidecarEdgeDto } from "@/graphql/schema";

import { getInstagramPostGraphQL } from "./utils";

interface RouteContext {
  params: Promise<{
    shortcode: string;
  }>;
}

export async function GET(_: NextRequest, context: RouteContext) {
  const { shortcode } = await context.params;

  if (!shortcode) {
    return NextResponse.json(
      { error: "noShortcode", message: "Shortcode is required." },
      { status: 400 }
    );
  }

  // Validate shortcode format: should not be a URL and use valid characters
  const shortcodeRegex = /^[a-zA-Z0-9_-]+$/;
  if (shortcode.includes('/') || shortcode.includes('.') || !shortcodeRegex.test(shortcode)) {
    return NextResponse.json(
      { error: "invalidFormat", message: "Invalid shortcode format. Please provide only the shortcode from the URL." },
      { status: 400 }
    );
  }

  try {
    const response = await getInstagramPostGraphQL({
      shortcode,
    });

    const status = response.status;

    if (status === 200) {
      const { data } = (await response.json()) as IG_GraphQLResponseDto;
      if (!data.xdt_shortcode_media) {
        return NextResponse.json(
          { error: "notFound", message: "post not found" },
          { status: 404 }
        );
      }

      // Determine content type and structure the response
      let structuredMediaData;
      const media = data.xdt_shortcode_media;

      if (media.is_video) {
        structuredMediaData = {
          type: "video",
          url: media.video_url,
        };
      } else if (media.edge_sidecar_to_children && media.edge_sidecar_to_children.edges.length > 0) {
        // This is a carousel
        const items = media.edge_sidecar_to_children.edges.map((edge: EdgeSidecarEdgeDto) => {
          const node = edge.node;
          if (node.is_video) {
            return {
              type: "video",
              url: node.video_url,
            };
          } else {
            return {
              type: "photo",
              url: node.display_url,
            };
          }
        });
        structuredMediaData = {
          type: "carousel",
          items: items,
        };
      } else {
        // This is a single photo
        structuredMediaData = {
          type: "photo",
          url: media.display_url,
        };
      }

      return NextResponse.json({ mediaData: structuredMediaData }, { status: 200 });
    }

    if (status === 404) {
      return NextResponse.json(
        { error: "notFound", message: "post not found" },
        { status: 404 }
      );
    }

    throw new Error("Failed to fetch post data");
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { error: "serverError", message: error.message },
      { status: 500 }
    );
  }
}