export const slugifyText = (text: string): string => {
  if (!text) return "";

  return text
    .toString()
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-") // Boşlukları tire yap
    .replace(/[^\w-]+/g, "") // Geçersizleri sil
    .replace(/--+/g, "-") // Çift tireyi teke indir
    .replace(/^-+/, ""); // SADECE BAŞTAKİ tireyi sil
};
