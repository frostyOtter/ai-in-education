/**
 * Remove markdown from string.
 *
 * @param markdown string
 * @returns string
 */
export function stripMarkdown(markdown: string): string {
  return (
    markdown
      // Remove code blocks FIRST (before inline code)
      .replace(/```[\s\S]*?```/g, "")

      // Remove inline code
      .replace(/`([^`]*)`/g, "$1")

      // Remove headings
      .replace(/^#{1,6}\s+/gm, "")

      // Remove emphasis - process in order to handle nesting
      // Bold first (** and __)
      .replace(/\*\*([^*\n]*(?:\*(?!\*)[^*\n]*)*)\*\*/g, "$1")
      .replace(/__([^_\n]*(?:_(?!_)[^_\n]*)*?)__/g, "$1")

      // Then italic (* and _) - more conservative approach
      .replace(/(\s|^)\*([^*\n\s][^*\n]*[^*\n\s]|\S)\*(\s|$)/g, "$1$2$3")
      .replace(/(\s|^)_([^_\n\s][^_\n]*[^_\n\s]|[a-zA-Z])_(\s|$)/g, "$1$2$3")

      // Remove strikethrough
      .replace(/~~([^~\n]*(?:~(?!~)[^~\n]*)*)~~/g, "$1")

      // Remove images first (they start with !)
      .replace(/!\[[^\]]*\]\([^)]+\)/g, "")

      // Remove links (preserve link text)
      .replace(/\[([^\]]*)\]\([^)]+\)/g, "$1")

      // Remove blockquotes
      .replace(/^>\s*/gm, "")

      // Remove unordered lists
      .replace(/^\s*[-+*]\s+/gm, "")

      // Remove ordered lists
      .replace(/^\s*\d+\.\s+/gm, "")

      // Remove horizontal rules
      .replace(/^[-*_]{3,}\s*$/gm, "")

      // Remove tables
      .replace(/^\|.*\|$/gm, "")
      .replace(/^[-|:\s]*$/gm, "")

      // Clean up extra whitespace
      // .replace(/\n{3,}/g, "\n\n") // Multiple newlines to double
      // .replace(/[ \t]+/g, " ") // Multiple spaces/tabs to single space
      .replaceAll("*", "")
      .replaceAll("#", "")
      .trim()
  );
}
