export function toEventDateTime(date?: string | null, time?: string | null) {
  if (!date) return null;
  const safeTime = time ?? "23:59:59";
  const normalizedTime = safeTime.length === 5 ? `${safeTime}:00` : safeTime;
  const parsed = new Date(`${date}T${normalizedTime}`);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

export function isEventExpired(
  date?: string | null,
  endTime?: string | null,
  startTime?: string | null
) {
  const endDate = toEventDateTime(date, endTime ?? startTime);
  if (!endDate) return false;
  return endDate.getTime() < Date.now();
}

export function formatEventDateTime(
  date?: string | null,
  startTime?: string | null
) {
  if (!date) return "";
  const base = toEventDateTime(date, startTime);
  if (!base) return date;
  const datePart = base.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
  const timePart = startTime
    ? base.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";
  return timePart ? `${datePart} • ${timePart}` : datePart;
}
