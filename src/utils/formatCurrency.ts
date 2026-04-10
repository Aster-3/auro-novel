export const formatCurrency = (amount: number, padSize: number = 3) => {
  const fixedAmount = Number(amount).toFixed(2);
  let [integerPart, decimalPart] = fixedAmount.split(".");

  if (integerPart.length < padSize) {
    integerPart = integerPart.padStart(padSize, "0");
  }

  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return `₺${formattedInteger}.${decimalPart}`;
};
