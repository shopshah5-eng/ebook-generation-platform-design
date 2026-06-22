import { createClient } from "./supabase/client";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = [
  "image/png",
  "image/jpeg",
  "image/webp",
];

export async function uploadUserFile(
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  const supabase = createClient();

  const bucketName = "ebook-media";

  if (!userId) {
    throw new Error(
      "User authentication required"
    );
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error(
      "File size must be less than 5MB"
    );
  }

  if (
    !ALLOWED_TYPES.includes(
      file.type
    )
  ) {
    throw new Error(
      "Only PNG, JPEG and WEBP files are allowed"
    );
  }

  const extension =
    file.name.split(".").pop() ||
    "png";

  const fileName =
    `${crypto.randomUUID()}.${extension}`;

  const filePath =
    `${userId}/${fileName}`;

  const { error } =
    await supabase.storage
      .from(bucketName)
      .upload(
        filePath,
        file,
        {
          cacheControl:
            "31536000",

          upsert: false,
        }
      );

  if (error) {
    throw new Error(
      "Upload failed: " +
        error.message
    );
  }

  if (onProgress) {
    onProgress(100);
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
    throw new Error(
      "Failed to generate asset URL"
    );
  }

  return signedData.signedUrl;
}