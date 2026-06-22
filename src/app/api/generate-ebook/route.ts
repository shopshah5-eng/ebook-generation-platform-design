import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth-server";
import { GenerateEbookInputSchema } from "../../../lib/ebook-schema";
import { checkGenerationRateLimit } from "../../../lib/rate-limiter";
import { generateEbookContent } from "../../../lib/gemini";
import {
  generateImagePrompt,
  getPollinationsUrl,
} from "../../../lib/images-server";
import { createAdminClient } from "../../../lib/supabase/server";

const THEME_CONFIGS: Record<
  string,
  {
    bg: string;
    color: string;
  }
> = {
  "Modern Business": {
    bg: "#F8FAFC",
    color: "#111827",
  },

  Startup: {
    bg: "#0F172A",
    color: "#F8FAFC",
  },

  Wellness: {
    bg: "#ECFDF5",
    color: "#14532D",
  },

  Finance: {
    bg: "#F5F5DC",
    color: "#6B4F2A",
  },

  "Luxury Brand": {
    bg: "#0A0A0A",
    color: "#D4AF37",
  },

  Persuasion: {
    bg: "#4A1018",
    color: "#F3D6B6",
  },
};

export async function POST(
  request: Request
) {
  try {
    const user =
      await getAuthenticatedUser();

    const body =
      await request.json();

    const parsed =
      GenerateEbookInputSchema.safeParse(
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
      prompt,
      templateName,
      author,
      pageCount,
      audience,
      tone,
      outline,
    } = parsed.data;

    const rateLimit =
      await checkGenerationRateLimit(
        user.id
      );

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error:
            "Daily generation limit reached",
        },
        {
          status: 429,
        }
      );
    }

    const pages =
      await generateEbookContent(
        prompt,
        templateName,
        author,
        pageCount,
        audience,
        tone,
        outline
      );

    for (const page of pages) {
      if (page.type === "visual") {
        if (
          !page.image ||
          page.image === "placeholder"
        ) {
          const imagePrompt =
            generateImagePrompt(
              page.caption,
              templateName
            );

          page.image =
            getPollinationsUrl(
              imagePrompt
            );
        }
      }
    }

    const cover =
      pages.find(
        (p) =>
          p.type === "cover"
      ) || null;

    const title =
      (cover && cover.type === "cover")
        ? cover.title
        : "Untitled Ebook";

    const theme =
      THEME_CONFIGS[
        templateName
      ] ||
      THEME_CONFIGS[
        "Modern Business"
      ];

    const coverVisual =
      pages.find(
        (p) =>
          p.type === "visual"
      ) || null;

    const coverImage =
      (coverVisual && coverVisual.type === "visual")
        ? coverVisual.image
        : "";

    const ebookId =
      crypto.randomUUID();

    const supabase =
      createAdminClient();

    const { error } =
      await supabase
        .from("ebooks")
        .insert({
          id: ebookId,
          user_id: user.id,
          title,
          template_name:
            templateName,
          content: pages,
          created_at:
            new Date().toISOString(),
        });

    if (error) {
      console.error(
        error
      );

      return NextResponse.json(
        {
          error:
            "Failed to save ebook",
        },
        {
          status: 500,
        }
      );
    }

    try {
      const {
        data: profile,
      } = await supabase
        .from("profiles")
        .select(
          "total_ebooks_created"
        )
        .eq(
          "id",
          user.id
        )
        .single();

      const current =
        profile?.total_ebooks_created ||
        0;

      await supabase
        .from("profiles")
        .upsert({
          id: user.id,
          total_ebooks_created:
            current + 1,
          updated_at:
            new Date().toISOString(),
        });
    } catch (err) {
      console.warn(
        "Failed to update profile",
        err
      );
    }

    return NextResponse.json({
      success: true,

      ebookId,

      title,

      pages,

      theme:
        templateName,

      bg: theme.bg,

      color:
        theme.color,

      coverImage,
    });
  } catch (error: any) {
    console.error(
      "Generate Ebook Error:",
      error
    );

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

    return NextResponse.json(
      {
        error:
          error.message ||
          "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}