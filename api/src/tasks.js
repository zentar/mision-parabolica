import { generateMissions, getFinalTarget } from './mission-configs.js';

export function seedMissions(equationSet = 'basic') {
  return generateMissions(equationSet);
}

export function getFinalTargetForSet(equationSet = 'basic') {
  return getFinalTarget(equationSet);
}
