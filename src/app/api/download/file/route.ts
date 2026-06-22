import { createAdminClient } from "../../../../lib/supabase/server";
import { getSubscription } from "../../../../lib/payments/subscription";
import { compilePDF, compileDOCX, compileEPUB, slugify } from "../../../../lib/compilers";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return new Response("Missing download token", { status: 400 });
    }

    const supabase = createAdminClient();

    // 1. Verify token
    const { data: downloadToken, error: tokenError } = await supabase
      .from("download_tokens")
      .select("*")
      .eq("token", token)
      .single();

    if (tokenError || !downloadToken) {
      return new Response("Invalid or expired download token", { status: 400 });
    }

    // Check expiration
    if (new Date(downloadToken.expires_at) < new Date()) {
      return new Response("Download token has expired", { status: 400 });
    }

    // 2. Fetch the ebook record
    const { data: ebook, error: ebookError } = await supabase
      .from("ebooks")
      .select("*")
      .eq("id", downloadToken.ebook_id)
      .single();

    if (ebookError || !ebook) {
      return new Response("Ebook not found", { status: 404 });
    }

    // 3. Determine if free or premium user to apply watermarks
    const subscription = await getSubscription(downloadToken.user_id);
    const isFreeUser = subscription.planId === "plan_free";

    const format = downloadToken.format || "pdf";
    const filename = `${slugify(ebook.title)}.${format}`;

    let fileBuffer: Buffer;
    let contentType = "application/octet-stream";

    // 4. Compile document based on target format
    if (format === "pdf") {
      fileBuffer = compilePDF(ebook, isFreeUser);
      contentType = "application/pdf";
    } else if (format === "epub") {
      fileBuffer = await compileEPUB(ebook, isFreeUser);
      contentType = "application/epub+zip";
    } else if (format === "docx") {
      fileBuffer = await compileDOCX(ebook, isFreeUser);
      contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
    } else {
      return new Response(`Unsupported export format: ${format}`, { status: 400 });
    }

    // 5. Return the binary response
    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Content-Length": fileBuffer.length.toString(),
      },
    });
  } catch (error: any) {
    console.error("Download file API route error:", error);
    return new Response(error.message || "Failed to download compiled document", {
      status: 500,
    });
  }
}
