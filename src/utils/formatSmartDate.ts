export const formatSmartDate = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const oneWeekInSeconds = 604800;

  // 1 Hafta içindeyse (Göreli Zaman)
  if (diffInSeconds < oneWeekInSeconds) {
    if (diffInSeconds < 60) return "Şimdi";

    const minutes = Math.floor(diffInSeconds / 60);
    if (minutes < 60) return `${minutes} dakika önce`;

    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} saat önce`;

    const days = Math.floor(hours / 24);
    return `${days} gün önce`;
  }

  // 1 Haftayı geçtiyse (Net Tarih: 17 Mart 2026 : 15:20)
  const day = date.getDate();
  const month = date.toLocaleDateString("tr-TR", { month: "long" });
  const year = date.getFullYear();
  // const hours = date.getHours().toString().padStart(2, "0");
  // const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${day} ${month} ${year}`;
};
