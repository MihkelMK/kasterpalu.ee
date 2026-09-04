export const maxAnswers = 5;

export function cleanContent(content: string): string {
  const trimmedContent = content.trim();
  return trimmedContent.at(-1) === '?' ? trimmedContent.slice(0, -1) : trimmedContent;
}
