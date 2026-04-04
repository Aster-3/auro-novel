export const formatRawDate = (
  dateString: string,
  includeTime = false,
): string => {
  const date = new Date(dateString);

  // Tarih geçersizse boş string veya placeholder dön
  if (isNaN(date.getTime())) return "";

  const options: Intl.DateTimeFormatOptions = {
    day: "numeric",
    month: "long",
    year: "numeric",
    ...(includeTime && { hour: "2-digit", minute: "2-digit" }),
  };

  return new Intl.DateTimeFormat("tr-TR", options).format(date);
};
