export function parseAPIResponse<T>(text: string): T {
  try {
    // Try normal JSON first
    return JSON.parse(text);
  } catch {
    // Fallback: handle weird CMS format
    const match = text.match(/=\s*(\[[\s\S]*\]|\{[\s\S]*\})\s*;/);

    if (!match) {
      console.error("Invalid API format:", text);
      throw new Error("Invalid API format");
    }

    return JSON.parse(match[1]);
  }
}
