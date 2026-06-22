import { createAdminClient } from "./supabase/server";

const MAX_GENERATIONS_PER_DAY = 3;
const MAX_EDITS_PER_DAY = 20;

export async function checkGenerationRateLimit(
  userId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = createAdminClient();

  const oneDayAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { count, error } = await supabase
    .from("ebooks")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("user_id", userId)
    .gte("created_at", oneDayAgo);

  if (error) {
    console.error(
      "Generation rate limiter error:",
      error
    );

    return {
      allowed: false,
      remaining: 0,
    };
  }

  const generatedCount = count ?? 0;

  return {
    allowed:
      generatedCount <
      MAX_GENERATIONS_PER_DAY,
    remaining: Math.max(
      0,
      MAX_GENERATIONS_PER_DAY -
        generatedCount
    ),
  };
}

export async function checkEditRateLimit(
  ebookId: string
): Promise<{ allowed: boolean; remaining: number }> {
  const supabase = createAdminClient();

  const oneDayAgo = new Date(
    Date.now() - 24 * 60 * 60 * 1000
  ).toISOString();

  const { count, error } = await supabase
    .from("ebook_edits")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("ebook_id", ebookId)
    .gte("created_at", oneDayAgo);

  if (error) {
    console.error(
      "Edit rate limiter error:",
      error
    );

    return {
      allowed: false,
      remaining: 0,
    };
  }

  const editsCount = count ?? 0;

  return {
    allowed: editsCount < MAX_EDITS_PER_DAY,
    remaining: Math.max(
      0,
      MAX_EDITS_PER_DAY - editsCount
    ),
  };
}