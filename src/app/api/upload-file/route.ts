import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth-server";
import { createAdminClient } from "../../../lib/supabase/server";

const MAX_FILE_SIZE =
  5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

export async function POST(
  request: Request
) {
  try {
    const user =
      await getAuthenticatedUser();

    const formData =
      await request.formData();

    const file =
      formData.get(
        "file"
      ) as File | null;

    if (!file) {
      return NextResponse.json(
        {
          error:
            "No file uploaded",
        },
        {
          status: 400,
        }
      );
    }

    if (
      file.size >
      MAX_FILE_SIZE
    ) {
      return NextResponse.json(
        {
          error:
            "File too large. Maximum size is 5MB.",
        },
        {
          status: 413,
        }
      );
    }

    if (
      !ALLOWED_TYPES.includes(
        file.type
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Only PNG, JPEG and WEBP files are allowed.",
        },
        {
          status: 400,
        }
      );
    }

    const supabase =
      createAdminClient();

    const bucketName =
      "ebook-media";

    const extension =
      file.name
        .split(".")
        .pop() || "png";

    const fileName =
      `${crypto.randomUUID()}.${extension}`;

    const filePath =
      `${user.id}/${fileName}`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from(bucketName)
        .upload(
          filePath,
          file,
          {
            contentType:
              file.type,

            cacheControl:
              "31536000",

            upsert: false,
          }
        );

    if (uploadError) {
      console.error(
        uploadError
      );

      return NextResponse.json(
        {
          error:
            "Upload failed: " +
            uploadError.message,
        },
        {
          status: 500,
        }
      );
    }

    const {
      data: signedData,
      error: signedError,
    } =
      await supabase.storage
        .from(bucketName)
        .createSignedUrl(
          filePath,
          60 *
            60 *
            24 *
            30
        );

    if (
      signedError ||
      !signedData
    ) {
      return NextResponse.json(
        {
          error:
            "Failed to generate URL",
        },
        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      url:
        signedData.signedUrl,

      path:
        filePath,
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
      "Upload route error:",
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