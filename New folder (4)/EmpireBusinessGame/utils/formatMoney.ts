/**
 * Format angka menjadi format uang yang mudah dibaca
 * Contoh:
 * 1000 -> "1,000"
 * 1000000 -> "1JT"
 * 1500000 -> "1.5JT"
 * 
 * @param amount - Jumlah uang yang akan diformat
 * @returns String yang sudah diformat
 */
const formatMoney = (amount: number | undefined | null): string => {
  // Periksa apakah amount adalah number yang valid
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "0";
  }
  
  // Nilai absolut untuk menangani nilai negatif
  const absAmount = Math.abs(amount);
  
  // Format untuk nilai di bawah 1 juta dengan pemisah ribuan
  if (absAmount < 1000000) {
    return amount.toLocaleString();
  }
  
  // Format untuk jutaan (1JT+)
  if (absAmount < 1000000000) {
    return (amount / 1000000).toFixed(1).replace(/\.0$/, '') + 'JT';
  }
  
  // Format untuk miliaran (1M+)
  if (absAmount < 1000000000000) {
    return (amount / 1000000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  
  // Format untuk triliun (1T+)
  return (amount / 1000000000000).toFixed(1).replace(/\.0$/, '') + 'T';
};

export default formatMoney; 