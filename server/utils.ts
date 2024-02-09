import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { parseISO, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDateWithSuffix(date: Date) {
  const dayOfMonth = parseInt(format(date, "d"), 10);
  let suffix = "th";

  const j = dayOfMonth % 10,
    k = dayOfMonth % 100;
  if (j === 1 && k !== 11) {
    suffix = "st";
  } else if (j === 2 && k !== 12) {
    suffix = "nd";
  } else if (j === 3 && k !== 13) {
    suffix = "rd";
  }

  return format(date, `MMMM d'${suffix}'`);
}
