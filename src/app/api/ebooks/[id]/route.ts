import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../../lib/auth-server";
import { createAdminClient } from "../../../../lib/supabase/server";

// GET /api/ebooks/[id] - Fetch single ebook
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    const supabase = createAdminClient();

    const { data: ebook, error } = await supabase
      .from("ebooks")
      .select("*")
      .eq("id", id)
      .single();

    if (error || !ebook) {
      return NextResponse.json({ error: "Ebook not found" }, { status: 404 });
    }

    // Verify ownership
    if (ebook.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    return NextResponse.json({ success: true, ebook });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE /api/ebooks/[id] - Delete user ebook
export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser();
    const { id } = await params;
    const supabase = createAdminClient();

    // Verify ownership first
    const { data: ebook, error: fetchError } = await supabase
      .from("ebooks")
      .select("user_id")
      .eq("id", id)
      .single();

    if (fetchError || !ebook) {
      return NextResponse.json({ error: "Ebook not found" }, { status: 404 });
    }

    if (ebook.user_id !== user.id) {
      return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
    }

    // Delete from table
    const { error: deleteError } = await supabase
      .from("ebooks")
      .delete()
      .eq("id", id);

    if (deleteError) {
      console.error("Delete ebook database error:", deleteError);
      return NextResponse.json({ error: "Failed to delete ebook" }, { status: 500 });
    }

    return NextResponse.json({ success: true, message: "Ebook deleted successfully" });
  } catch (error: any) {
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
