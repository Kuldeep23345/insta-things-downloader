import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  try {
    return NextResponse.json(
      {
        status: "info",
        message:
          "Instagram Story downloading is currently under development and not yet functional. The necessary API details for fetching stories need to be configured.",
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in story placeholder route:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "An unexpected error occurred on the server.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
