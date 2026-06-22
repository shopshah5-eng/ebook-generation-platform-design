export function generateImagePrompt(
  baseDescription: string,
  theme: string
): string {
  const styles: Record<
    string,
    string
  > = {
    "Modern Business":
      "professional corporate photography, clean composition, premium business publishing, minimalist workspace, blue and gray palette, editorial cover design",

    Wellness:
      "organic wellness photography, natural sunlight, calm atmosphere, soft sage tones, premium health publication aesthetic",

    Startup:
      "modern technology aesthetic, startup founder environment, innovation, productivity workspace, futuristic editorial cover",

    Finance:
      "luxury finance publication, gold accents, executive office atmosphere, structured composition, premium investment magazine",

    "Luxury Brand":
      "black and gold luxury design, fashion editorial, premium craftsmanship, cinematic lighting, luxury publication cover",

    Persuasion:
      "dramatic editorial photography, dark wood textures, rhetorical atmosphere, intellectual publication aesthetic",
  };

  const style =
    styles[theme] ||
    "premium editorial photography, highly detailed, professional publishing quality";

  return `
${baseDescription}

${style}

No text.
No watermark.
No logo.
Professional publishing cover.
High detail.
Photorealistic.
`.trim();
}

export function getPollinationsUrl(
  prompt: string,
  width = 1024,
  height = 1536
): string {
  const cleaned =
    prompt
      .replace(
        /[^a-zA-Z0-9\s,._-]/g,
        ""
      )
      .trim();

  return `https://image.pollinations.ai/prompt/${encodeURIComponent(
    cleaned
  )}?width=${width}&height=${height}&enhance=true&private=true&nologo=true`;
}