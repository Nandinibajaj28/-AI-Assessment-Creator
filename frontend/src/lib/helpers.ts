export const isValidDate = (value: string) => {
  if (!/^\d{2}-\d{2}-\d{4}$/.test(value)) return false;

  const [dayString, monthString, yearString] = value.split("-");
  const day = Number(dayString);
  const month = Number(monthString);
  const year = Number(yearString);
  const date = new Date(year, month - 1, day);

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day;
};

export const isSupportedUpload = (file: File) =>
  file.type === "application/pdf" || file.type.startsWith("image/");
