export function clamp(min, val, max) {
  return Math.min(max, Math.max(min, val));
}

// the value is added until it reaches the maximum
export function smooth(min, val, max) {
  const range = max - min;
  const rangeHalf = range / 2;
  const valClamped = clamp(min, val, max);
  if (valClamped === min) {
    return valClamped + (val - min) * (1 - (valClamped - min) / rangeHalf);
  }
  if (valClamped === max) {
    return valClamped - (val - max) * (1 - (max - valClamped) / rangeHalf);
  }
  return valClamped;
}
