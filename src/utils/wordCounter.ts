export const wordCounter = (htmlStr: string) => {
  if (!htmlStr) return 0;

  const plainText = htmlStr
    .replace(/<\s*br\s*\/?>/gi, " ")
    .replace(/<\/\s*(p|div|h[1-6]|li|blockquote|pre|tr|td|th)\s*>/gi, " ")
    .replace(/<[^>]*>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .trim();

  const matches = plainText.match(/\S+/g);
  return matches ? matches.length : 0;
};
