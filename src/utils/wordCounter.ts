export const wordCounter = (htmlStr: string) => {
  if (!htmlStr) return 0;

  const plainText = htmlStr.replace(/<[^>]*>/g, " ").trim();

  const matches = plainText.match(/\S+/g);
  return matches ? matches.length : 0;
};
