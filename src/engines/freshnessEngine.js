/**
 * Food Quality & Shelf-life Assessment (screen 5).
 * Transparent, rule-based provisional score from the donor's declared metadata.
 * Provisional only — final safety is confirmed physically at handover.
 */

const STORAGE_PENALTY = {
  'Frozen (-18°C)': 0.4,
  'Refrigerated (0°–4°C)': 1.5,
  'Hot Hold (Above 60°C)': 5,
  'Room Temperature (Ambient)': 9,
  '': 6,
};

export function assessFreshness({
  prepTimeHours = 2,
  storage = 'Refrigerated (0°–4°C)',
  hasPhotos = true,
} = {}) {
  const prep = Number(prepTimeHours);
  const penaltyPerHour = STORAGE_PENALTY[storage] ?? 6;

  let score = 100 - Math.min(58, prep * penaltyPerHour);
  if (!hasPhotos) score -= 5;
  score = Math.max(38, Math.min(99, Math.round(score)));

  let label = 'Use Quickly';
  if (score >= 93) label = 'Excellent Quality';
  else if (score >= 80) label = 'Good Quality';
  else if (score >= 65) label = 'Fair Quality';

  let safeWindow = '3 - 5 hrs';
  let safeWindowNote = 'at room temperature';
  if (storage === 'Frozen (-18°C)') {
    safeWindow = '7 - 10 days';
    safeWindowNote = 'kept frozen';
  } else if (storage === 'Refrigerated (0°–4°C)') {
    safeWindow = prep <= 6 ? '2 - 3 days' : '1 - 2 days';
    safeWindowNote = 'if refrigerated';
  } else if (storage === 'Hot Hold (Above 60°C)') {
    const hrs = Math.max(0.5, 4.5 - prep);
    safeWindow = `${hrs.toFixed(1)} hrs`;
    safeWindowNote = 'while hot held';
  } else if (prep > 4) {
    safeWindow = 'Use within 1 hr';
    safeWindowNote = 'past ambient limit';
  }

  const checklist = [
    { label: 'No unusual smell', ok: prep <= 8 || storage.includes('Frozen') },
    { label: 'Normal color & texture', ok: score >= 65 },
    { label: 'Properly packed', ok: true },
    { label: 'No signs of spoilage', ok: score >= 55 },
  ];

  const disclaimer =
    'This is a provisional score based on visual and basic checks. Final safety depends on temperature, follow-up safety standards and use before expiry.';

  return { score, label, safeWindow, safeWindowNote, checklist, disclaimer };
}
