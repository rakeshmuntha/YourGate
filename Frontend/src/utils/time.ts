/** Convert "HH:MM" (24hr) → "h:MM AM/PM" (12hr) */
export function to12hr(time: string): string {
  if (!time) return time;
  const [hStr, mStr] = time.split(':');
  const h = parseInt(hStr, 10);
  const m = mStr ?? '00';
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${m} ${suffix}`;
}

/** Convert "HH:MM-HH:MM" slot key back to display range */
export function slotKeyTo12hr(slotKey: string): string {
  const [start, end] = slotKey.split('-');
  return `${to12hr(start)} – ${to12hr(end)}`;
}
