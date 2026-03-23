export const formatCurrent = (value: number | undefined, label: string) => {
  if (value === undefined || value === null) return "---";

  if (label === "Toplam Önerilme") return value.toString();

  if (value < 1000) {
    return value.toString().padStart(3, "0");
  }

  return value.toString();
};
