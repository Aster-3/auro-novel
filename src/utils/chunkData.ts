// @/utils/chunkData
export const chunkData = (arr: any[], size: number) => {
  if (!arr || !Array.isArray(arr)) return []; // Koruma kalkanı
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};
