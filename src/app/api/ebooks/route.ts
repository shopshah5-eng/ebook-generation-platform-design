import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth-server";
import { createAdminClient } from "../../../lib/supabase/server";

// GET /api/ebooks - List user ebooks
export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    const supabase = createAdminClient();

    const { data: ebooks, error } = await supabase
      .from("ebooks")
      .select("id, title, template_name, content, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching ebooks list:", error);
      return NextResponse.json({ error: "Failed to fetch ebooks" }, { status: 500 });
    }

    return NextResponse.json({ success: true, ebooks });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// POST /api/ebooks - Create manual ebook record
export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    const body = await request.json();

    const { title, templateName, content } = body;
    if (!title || !templateName || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const supabase = createAdminClient();
    const ebookId = globalThis.crypto.randomUUID();

    const { error } = await supabase
      .from("ebooks")
      .insert({
        id: ebookId,
        user_id: user.id,
        title,
        template_name: templateName,
        content,
        created_at: new Date().toISOString(),
      });

    if (error) {
      console.error("Error creating manual ebook:", error);
      return NextResponse.json({ error: "Failed to create ebook" }, { status: 500 });
    }

    return NextResponse.json({ success: true, ebookId, title });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
