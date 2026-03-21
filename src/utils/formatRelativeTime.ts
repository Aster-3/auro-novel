export const formatRelativeTime = (date: string | Date): string => {
  if (!date) return "";

  const targetDate = new Date(date);
  const now = new Date();
  const diffInSeconds = Math.floor(
    (now.getTime() - targetDate.getTime()) / 1000,
  );

  const units = [
    { label: "yıl", seconds: 31536000 },
    { label: "ay", seconds: 2592000 },
    { label: "hafta", seconds: 604800 },
    { label: "gün", seconds: 86400 },
    { label: "saat", seconds: 3600 },
    { label: "dakika", seconds: 60 },
    { label: "saniye", seconds: 1 },
  ];

  for (const unit of units) {
    const interval = Math.floor(Math.abs(diffInSeconds) / unit.seconds);

    if (interval >= 1 || unit.label === "saniye") {
      return diffInSeconds > 0
        ? `${interval} ${unit.label} önce`
        : `${interval} ${unit.label} sonra`;
    }
  }

  return "az önce";
};
