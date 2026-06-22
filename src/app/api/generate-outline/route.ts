import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth-server";
import { generateEbookOutline } from "../../../lib/gemini";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { prompt, title, audience, tone, pageCount } = body;

    if (!prompt || !title || !audience || !tone || !pageCount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const outline = await generateEbookOutline(prompt, title, audience, tone, Number(pageCount));

    return NextResponse.json({ success: true, outline });
  } catch (error: any) {
    console.error("API generate-outline error:", error);
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to generate outline" },
      { status: 500 }
    );
  }
}
