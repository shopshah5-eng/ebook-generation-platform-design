import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth-server";
import {
  EditPageInputSchema,
  EbookPageSchema,
} from "../../../lib/ebook-schema";
import { checkEditRateLimit } from "../../../lib/rate-limiter";
import { createAdminClient } from "../../../lib/supabase/server";
import { editEbookPage } from "../../../lib/gemini";
import {
  generateImagePrompt,
  getPollinationsUrl,
} from "../../../lib/images-server";

interface EbookPage {
  type: string;
  title?: string;
  subtitle?: string;
  text?: string;
  content?: string;
  image?: string;
  caption?: string;
  items?: string[];
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
      EditPageInputSchema.safeParse(
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
      pageIndex,
      instruction,
    } = parsed.data;

    const supabase =
      createAdminClient();

    const {
      data: ebook,
      error: fetchError,
    } =
      await supabase
        .from("ebooks")
        .select("*")
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

    const rateLimit =
      await checkEditRateLimit(
        ebookId
      );

    if (
      !rateLimit.allowed
    ) {
      return NextResponse.json(
        {
          error:
            "Maximum daily edit limit reached",
        },
        {
          status: 429,
        }
      );
    }

    const pages =
      (ebook.content as unknown) as EbookPage[];

    if (
      pageIndex < 0 ||
      pageIndex >=
        pages.length
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid page index",
        },
        {
          status: 400,
        }
      );
    }

    const originalPage =
      pages[pageIndex];

    const editedPage =
      await editEbookPage(
        originalPage,
        instruction
      );

    const validatedPage =
      EbookPageSchema.safeParse(
        editedPage
      );

    if (
      !validatedPage.success
    ) {
      return NextResponse.json(
        {
          error:
            "Generated page failed validation",
        },
        {
          status: 500,
        }
      );
    }

    const finalPage =
      validatedPage.data;

    if (
      finalPage.type ===
        "visual" &&
      finalPage.caption !==
        originalPage.caption
    ) {
      const imagePrompt =
        generateImagePrompt(
          finalPage.caption ||
            "",
          ebook.template_name
        );

      finalPage.image =
        getPollinationsUrl(
          imagePrompt
        );
    }

    pages[pageIndex] =
      finalPage;

    const {
      error: updateError,
    } =
      await supabase
        .from("ebooks")
        .update({
          content: pages as any,
          updated_at:
            new Date().toISOString(),
        })
        .eq(
          "id",
          ebookId
        );

    if (updateError) {
      return NextResponse.json(
        {
          error:
            "Failed to save changes",
          details:
            updateError.message,
        },
        {
          status: 500,
        }
      );
    }

    try {
      await supabase
        .from(
          "ebook_edits"
        )
        .insert({
          ebook_id:
            ebookId,

          editor_id:
            user.id,

          instruction,

          edited_page_index:
            pageIndex,

          created_at:
            new Date().toISOString(),
        });
    } catch (auditError) {
      console.warn(
        "Audit log failed",
        auditError
      );
    }

    return NextResponse.json({
      success: true,

      pageIndex,

      updatedPage:
        finalPage,
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
      "Edit page route crash:",
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