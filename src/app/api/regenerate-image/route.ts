import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth-server";
import {
  RegenerateImageInputSchema,
  VisualPageSchema,
} from "../../../lib/ebook-schema";
import { createAdminClient } from "../../../lib/supabase/server";
import {
  generateImagePrompt,
  getPollinationsUrl,
} from "../../../lib/images-server";

interface EbookPage {
  type: string;
  image?: string;
  caption?: string;
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
      RegenerateImageInputSchema.safeParse(
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
      imagePrompt,
    } = parsed.data;

    const supabase =
      createAdminClient();

    const {
      data: ebook,
      error,
    } =
      await supabase
        .from("ebooks")
        .select("*")
        .eq("id", ebookId)
        .single();

    if (
      error ||
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

    const page =
      pages[pageIndex];

    if (
      page.type !==
      "visual"
    ) {
      return NextResponse.json(
        {
          error:
            "Only visual pages support image regeneration",
        },
        {
          status: 400,
        }
      );
    }

    const newUrl =
      getPollinationsUrl(
        generateImagePrompt(
          imagePrompt,
          ebook.template_name
        )
      );

    const validated =
      VisualPageSchema.safeParse({
        ...page,
        image: newUrl,
        caption:
          imagePrompt,
      });

    if (
      !validated.success
    ) {
      return NextResponse.json(
        {
          error:
            "Image validation failed",
        },
        {
          status: 500,
        }
      );
    }

    pages[pageIndex] =
      validated.data;

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
            "Failed to update ebook",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      pageIndex,
      updatedPage:
        validated.data,
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

    console.error(error);

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