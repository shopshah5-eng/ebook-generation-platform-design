import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth-server";
import { DownloadInputSchema } from "../../../lib/ebook-schema";
import { checkAndDecrementCredits } from "../../../lib/download";
import { createAdminClient } from "../../../lib/supabase/server";

function slugify(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(
  request: Request
) {
  try {
    const user =
      await getAuthenticatedUser();

    const body =
      await request.json();

    const parsed =
      DownloadInputSchema.safeParse(
        body
      );

    if (!parsed.success) {
      return NextResponse.json(
        {
          error: "Invalid input",
          details:
            parsed.error.format(),
        },
        {
          status: 400,
        }
      );
    }

    const {
      ebookId,
      format,
    } = parsed.data;

    const supabase =
      createAdminClient();

    const {
      data: ebook,
      error: fetchError,
    } =
      await supabase
        .from("ebooks")
        .select(
          "id,user_id,title"
        )
        .eq("id", ebookId)
        .single();

    if (
      fetchError ||
      !ebook
    ) {
      return NextResponse.json(
        {
          error:
            "Ebook not found",
        },
        {
          status: 404,
        }
      );
    }

    if (
      ebook.user_id !==
      user.id
    ) {
      return NextResponse.json(
        {
          error:
            "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const creditCheck =
      await checkAndDecrementCredits(
        user.id
      );

    if (
      !creditCheck.allowed
    ) {
      return NextResponse.json(
        {
          error:
            "Insufficient download credits",
        },
        {
          status: 402,
        }
      );
    }

    const appUrl =
      process.env
        .NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const token =
      crypto.randomUUID();

    try {
      await supabase
        .from(
          "download_tokens"
        )
        .insert({
          token,

          ebook_id:
            ebook.id,

          user_id:
            user.id,

          format,

          expires_at:
            new Date(
              Date.now() +
                15 *
                  60 *
                  1000
            ).toISOString(),
        });
    } catch (err) {
      console.error(
        "Failed to create download token",
        err
      );

      return NextResponse.json(
        {
          error:
            "Download token creation failed",
        },
        {
          status: 500,
        }
      );
    }

    const downloadUrl =
      `${appUrl}/api/download/file?token=${token}`;

    return NextResponse.json({
      success: true,

      downloadUrl,

      format,

      fileName:
        `${slugify(
          ebook.title
        )}.${format}`,

      creditsRemaining:
        creditCheck.creditsRemaining,
    });
  } catch (error: any) {
    if (
      error.message ===
      "Unauthorized"
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    console.error(
      "Download route crash:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal Server Error",

        details:
          error.message,
      },
      {
        status: 500,
      }
    );
  }
}