export const escapeRegex = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const normalizeListField = (value) => {
  if (value === undefined) return undefined;

  const rawItems = Array.isArray(value) ? value : String(value).split(',');

  return rawItems
    .map((item) => String(item).trim())
    .filter(Boolean)
    .slice(0, 12);
};

export const normalizeAnoFundacao = (value) => {
  if (value === undefined || value === null || value === '') return undefined;

  const parsedValue = Number(value);
  return Number.isNaN(parsedValue) ? value : parsedValue;
};
