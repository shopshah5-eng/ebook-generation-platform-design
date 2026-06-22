import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "../../../lib/auth-server";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { page, instruction, selectedText } = body;

    if (!page || !instruction) {
      return NextResponse.json(
        { error: "Missing page or instruction in request body" },
        { status: 400 }
      );
    }

    const prompt = `
Original Page JSON:
${JSON.stringify(page, null, 2)}

User Instruction:
${instruction}

${selectedText ? `Focus specifically on modifying or replacing this text: "${selectedText}"` : ""}

Rules:
1. Preserve the original JSON schema, keys, and values except for the text content being edited.
2. Keep the page "type" and all block structure exactly the same. Do NOT delete blocks, do NOT add new blocks, do NOT change block types, and do NOT change block IDs.
3. If the page contains a "blocks" array, only modify the "content", "title", "text", "caption", or "items" values inside the blocks to satisfy the user's instruction.
4. Output ONLY valid JSON representing the updated page object. Do not include markdown code fences (like \`\`\`json) or any other text before or after the JSON.
`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        systemInstruction: "You are an expert ebook editor. Return ONLY the modified page JSON conforming to the original structure. No markdown formatting, no code fences, no explanations.",
      },
    });

    const text = response.text?.trim();
    if (!text) {
      throw new Error("Empty response from Gemini");
    }

    let updatedPage;
    try {
      updatedPage = JSON.parse(text);
    } catch (err) {
      console.error("Failed to parse regenerated page JSON. Text:", text);
      throw new Error("Failed to parse regenerated page JSON");
    }

    return NextResponse.json({ success: true, updatedPage });
  } catch (error: any) {
    console.error("API regenerate-chapter error:", error);
    if (error.message === "Unauthorized") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { error: error.message || "Failed to regenerate chapter content" },
      { status: 500 }
    );
  }
}
