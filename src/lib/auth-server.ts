import { createClient } from "./supabase/server";

export async function getAuthenticatedUser() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error("Auth Error:", error);
    throw new Error("Unauthorized");
  }

  if (!user) {
    throw new Error("Unauthorized");
  }

  return user;
}