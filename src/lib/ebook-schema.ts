import { z } from "zod";

// Ebook pages types and structures
export const CoverPageSchema = z.object({
  type: z.literal("cover"),
  title: z.string(),
  subtitle: z.string(),
  author: z.string().optional(),
});

export const TocChapterSchema = z.object({
  num: z.string(),
  name: z.string(),
  page: z.string(),
});

export const TocPageSchema = z.object({
  type: z.literal("toc"),
  chapters: z.array(TocChapterSchema),
});

export const ChapterPageSchema = z.object({
  type: z.literal("chapter"),
  chapterNum: z.string(),
  title: z.string(),
  content: z.string(),
});

export const ContentPageSchema = z.object({
  type: z.literal("content"),
  quote: z.string(),
  text: z.string(),
});

export const VisualPageSchema = z.object({
  type: z.literal("visual"),
  image: z.string(),
  caption: z.string(),
});

export const ChecklistPageSchema = z.object({
  type: z.literal("checklist"),
  title: z.string(),
  items: z.array(z.string()),
});

export const EbookPageSchema = z.discriminatedUnion("type", [
  CoverPageSchema,
  TocPageSchema,
  ChapterPageSchema,
  ContentPageSchema,
  VisualPageSchema,
  ChecklistPageSchema,
]);

export const EbookContentSchema = z.array(EbookPageSchema);

// API payload validation schemas
export const GenerateEbookInputSchema = z.object({
  prompt: z.string().min(3, "Prompt must be at least 3 characters long"),
  templateName: z.string().min(1, "Template name is required"),
  author: z.string().optional(),
  pageCount: z
  .number()
  .int()
  .min(4)
  .max(50)
  .default(8),
  audience: z.string().optional(),
  tone: z.string().optional(),
  outline: z.array(z.object({
    title: z.string(),
    description: z.string().optional(),
  })).optional(),
});

export const EditPageInputSchema = z.object({
  ebookId: z.string().uuid("Invalid ebook ID"),
  pageIndex: z.number().int().nonnegative("Page index must be a non-negative integer"),
  instruction: z.string().min(1, "Instruction is required"),
});

export const RegenerateImageInputSchema = z.object({
  ebookId: z.string().uuid("Invalid ebook ID"),
  pageIndex: z.number().int().nonnegative("Page index must be a non-negative integer"),
  imagePrompt: z.string().min(1, "Image prompt is required"),
});

export const DownloadInputSchema = z.object({
  ebookId: z.string().uuid("Invalid ebook ID"),
  format: z.enum(["pdf", "epub", "docx", "html"]),
});
