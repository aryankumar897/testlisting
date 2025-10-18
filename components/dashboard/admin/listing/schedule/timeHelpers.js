// timeHelpers.js
export function to12Hour(hhmm24) {
  if (!hhmm24) return "";
  const [hhStr, mm] = hhmm24.split(":");
  let hh = parseInt(hhStr, 10);
  const period = hh >= 12 ? "PM" : "AM";
  let hh12 = hh % 12;
  if (hh12 === 0) hh12 = 12;
  return `${hh12.toString().padStart(2, "0")}:${mm} ${period}`;
}

export function to24Hour(h12mm) {
  if (!h12mm) return "";
  const m = h12mm.match(/^(\d{1,2}):(\d{2})\s*([AaPp][Mm])$/);
  if (!m) return "";
  let hh = parseInt(m[1], 10);
  const mm = m[2];
  const period = m[3].toUpperCase();
  if (period === "AM") {
    if (hh === 12) hh = 0;
  } else {
    if (hh !== 12) hh = hh + 12;
  }
  return `${hh.toString().padStart(2, "0")}:${mm}`;
}

export function normalizeTo24(input) {
  if (!input) return "";
  if (/[AaPp][Mm]$/.test(input.trim())) {
    return to24Hour(input.trim());
  }
  const m = input.match(/^(\d{1,2}):(\d{2})$/);
  if (m) {
    const hh = m[1].padStart(2, "0");
    const mm = m[2];
    return `${hh}:${mm}`;
  }
  return "";
}
