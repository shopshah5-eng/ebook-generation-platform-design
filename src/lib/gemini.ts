import { GoogleGenAI } from "@google/genai";
import {
  EbookContentSchema,
  EbookPageSchema,
} from "./ebook-schema";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY!,
});

function buildSystemPrompt(
  pageCount: number,
  author?: string
): string {
  return `
You are a professional ebook author.

Return ONLY valid JSON as a JSON array of page objects.

CRITICAL CONTENT DENSITY & LENGTH REQUIREMENTS:
- Output exactly ${pageCount} pages in the array.
- The first page (index 0) must be a "cover" page.
- The second page (index 1) must be a "toc" page.
- The remaining pages should be a mix of "chapter", "content", "visual", and "checklist" pages.
- You MUST generate enough detailed content to fill each page naturally. Avoid short or empty descriptions. Prevent empty whitespace.
- Follow the required schema for each page type exactly.
- Professional quality writing.
- No markdown, no code fences, no explanations.

Author:
${author || "PageNest Editorial"}

JSON Schema Guidelines:
The output array must contain objects matching one of these types:

1. Cover Page:
{
  "type": "cover",
  "title": "Title of the Ebook",
  "subtitle": "Subtitle of the Ebook",
  "author": "${author || "PageNest Editorial"}"
}

2. Table of Contents Page:
{
  "type": "toc",
  "chapters": [
    {
      "num": "1",
      "name": "First Chapter Name",
      "page": "3"
    }
  ]
}

3. Chapter Divider Page:
{
  "type": "chapter",
  "chapterNum": "Chapter number (e.g. 1, 2, 3)",
  "title": "Chapter Title",
  "content": "Mandatory: Write a very detailed, deep text of between 400 to 600 words. Split it into 3 to 4 paragraphs separated by double newlines (\\\\n\\\\n). It must provide a comprehensive introduction/overview of the chapter theme with high content density to prevent empty whitespace on the page."
}

4. Content Page:
{
  "type": "content",
  "quote": "A key quote highlighting the theme of this page",
  "text": "Mandatory: Write a rich, detailed body copy of between 250 to 400 words explaining the concept in depth. Ensure balanced typography and high text density."
}

5. Visual Page:
{
  "type": "visual",
  "image": "placeholder",
  "caption": "Mandatory: Write a detailed description of the image content (50 to 100 words). Explain the visual concept and its connection to the ebook's theme to balance the layout and keep the image area at 35% of the page size."
}

6. Checklist Page:
{
  "type": "checklist",
  "title": "List/Checklist Title",
  "items": [
    "Write a detailed, comprehensive item description (at least 15-20 words per item, minimum 5 items in the list to fill the page content density naturally)",
    "Another detailed checklist item with descriptive explanation"
  ]
}
`;
}

const EDIT_SYSTEM_PROMPT = `
You are an expert ebook editor.

Rules:

- Keep original schema
- Keep page type unchanged
- Apply user instruction
- Return valid JSON only
- No markdown
- No explanations
`;

async function generateWithTimeout(
  fn: Promise<any>,
  timeoutMs = 30000
) {
  const timeoutPromise = new Promise(
    (_, reject) =>
      setTimeout(
        () =>
          reject(
            new Error(
              "Gemini request timed out"
            )
          ),
        timeoutMs
      )
  );

  return Promise.race([
    fn,
    timeoutPromise,
  ]);
}

function validateEbookContentThresholds(pages: any[], pageCount: number) {
  if (pages.length !== pageCount) {
    throw new Error(`Expected exactly ${pageCount} pages but received ${pages.length}`);
  }

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    if (page.type === "chapter") {
      const wordCount = page.content.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 400) {
        throw new Error(
          `Page ${i + 1} ("${page.title || "Chapter"}") failed content threshold: contains only ${wordCount} words (minimum 400 required).`
        );
      }
    } else if (page.type === "content") {
      const wordCount = page.text.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 200) {
        throw new Error(
          `Page ${i + 1} (Content Page) failed content threshold: contains only ${wordCount} words (minimum 200 required).`
        );
      }
    } else if (page.type === "checklist") {
      if (page.items.length < 5) {
        throw new Error(
          `Page ${i + 1} ("${page.title || "Checklist"}") failed content threshold: checklist has only ${page.items.length} items (minimum 5 required).`
        );
      }
    } else if (page.type === "visual") {
      const wordCount = page.caption.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount < 25) {
        throw new Error(
          `Page ${i + 1} (Visual Page) failed content threshold: caption contains only ${wordCount} words (minimum 25 required).`
        );
      }
    }
  }
}

export async function generateEbookContent(
  prompt: string,
  templateName: string,
  author?: string,
  pageCount = 6
) {
  let lastError: any = null;
  const maxAttempts = 3;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      console.log(`Starting ebook generation attempt ${attempt} of ${maxAttempts}...`);
      const response = await generateWithTimeout(
        ai.models.generateContent({
          model: "gemini-3.5-flash",

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
Create a premium ebook.

Topic:
${prompt}

Style:
${templateName}

Pages:
${pageCount}
`,
                },
              ],
            },
          ],

          config: {
            responseMimeType:
              "application/json",

            systemInstruction:
              buildSystemPrompt(
                pageCount,
                author
              ),
          },
        })
      );

      const text = (response as any).text?.trim();

      if (!text) {
        throw new Error("Empty Gemini response");
      }

      let parsed;
      try {
        parsed = JSON.parse(text);
      } catch {
        throw new Error("Gemini returned invalid JSON");
      }

      const validated = EbookContentSchema.safeParse(parsed);

      if (!validated.success) {
        console.error(validated.error);
        const issues = validated.error.issues.map(i => `${i.path.join(".")}: ${i.message}`).join(", ");
        throw new Error(`Gemini output failed schema validation: ${issues}`);
      }

      // Enforce content thresholds and reject ebooks that fail
      validateEbookContentThresholds(validated.data, pageCount);

      console.log(`Ebook generation successful on attempt ${attempt}!`);
      return validated.data;
    } catch (error: any) {
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      lastError = error;
    }
  }

  throw new Error(
    `Failed to generate a valid ebook satisfying all content thresholds after ${maxAttempts} attempts. Last error: ${lastError?.message}`
  );
}

export async function editEbookPage(
  pageContent: any,
  instruction: string
) {
  try {
    const response =
      await generateWithTimeout(
        ai.models.generateContent({
          model:
            "gemini-2.5-flash",

          contents: [
            {
              role: "user",
              parts: [
                {
                  text: `
Original Page:

${JSON.stringify(
  pageContent,
  null,
  2
)}

Instruction:

${instruction}
`,
                },
              ],
            },
          ],

          config: {
            responseMimeType:
              "application/json",

            systemInstruction:
              EDIT_SYSTEM_PROMPT,
          },
        })
      );

    const text =
      (response as any).text?.trim();

    if (!text) {
      throw new Error(
        "Empty edit response"
      );
    }

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(
        "Invalid JSON returned from Gemini"
      );
    }

    const validated =
      EbookPageSchema.safeParse(
        parsed
      );

    if (!validated.success) {
      throw new Error(
        "Edited page failed schema validation"
      );
    }

    return validated.data;
  } catch (error) {
    console.error(
      "editEbookPage:",
      error
    );

    throw error;
  }
}