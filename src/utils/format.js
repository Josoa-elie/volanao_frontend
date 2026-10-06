export const formatCurrency = (amount, currency = 'Ar') => {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(num)) return `0,00 ${currency}`;
  return `${num.toFixed(2).replace('.', ',')} ${currency}`;
};

export const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString + 'T00:00:00');
  return date.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

export const formatMonth = (monthString) => {
  // monthString = "2026-09-01"
  if (!monthString) return '';
  const date = new Date(monthString);
  return date.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
};

export const getCurrentMonth = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

export const getFirstDayOfMonth = (month) => {
  // month = "2026-09"
  return `${month}-01`;
};