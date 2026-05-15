/** @param {number} count — flaw / star count */
export function getStageFromCount(count) {
  if (count <= 2) return "stage1";
  if (count === 3) return "stage2";
  if (count <= 5) return "stage3";
  if (count === 6) return "stage4";
  return "stage5";
}

/** Progressive constellation visibility by input count. */
export function getConstellationVisuals(count) {
  if (count <= 2) {
    return { showLines: false, lineOpacity: 0, starOpacity: 0.6 };
  }
  if (count <= 4) {
    return { showLines: true, lineOpacity: 0.3, starOpacity: 0.8 };
  }
  if (count <= 6) {
    return { showLines: true, lineOpacity: 0.6, starOpacity: 0.9 };
  }
  return { showLines: true, lineOpacity: 1, starOpacity: 1 };
}

export function getMoodMessage(mood, count, messages) {
  if (!mood || !messages[mood]) return "";
  const stage = getStageFromCount(count);
  return messages[mood][stage] ?? "";
}

export function getMoodEpilogueSequence(mood, messages) {
  if (!mood || !messages[mood]) return [];
  const m = messages[mood];
  return [m.stage1, m.stage2, m.stage3, m.stage4, m.stage5];
}
