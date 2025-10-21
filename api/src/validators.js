import { 
  parseQuadratic, 
  getVertex, 
  getRoots, 
  getYIntercept, 
  getConcavity, 
  getAxisOfSymmetry, 
  getRange,
  approximatelyEqual,
  normalizeExpression
} from './math-utils.js';

export function validateMission(funcStr, payload) {
  const { a, b, c } = parseQuadratic(funcStr);

  const results = {};

  if ('vertex' in payload) {
    const expectedVertex = getVertex(a, b, c);
    const ok = approximatelyEqual(payload.vertex.x, expectedVertex.x) && 
               approximatelyEqual(payload.vertex.y, expectedVertex.y);
    results.vertex = { ok, expected: expectedVertex };
  }
  
  if ('yIntercept' in payload) {
    const expectedYIntercept = getYIntercept(a, b, c);
    const ok = approximatelyEqual(payload.yIntercept, expectedYIntercept);
    results.yIntercept = { ok, expected: expectedYIntercept };
  }
  
  if ('roots' in payload) {
    const expectedRoots = getRoots(a, b, c);
    let ok = false;
    
    if (expectedRoots.length === 0) {
      ok = !payload.roots || payload.roots.length === 0;
    } else if (expectedRoots.length === 1) {
      ok = payload.roots && payload.roots.some(x => approximatelyEqual(x, expectedRoots[0]));
    } else {
      const userRoots = (payload.roots || []).slice().sort((x, y) => x - y);
      const sortedExpected = expectedRoots.slice().sort((x, y) => x - y);
      ok = userRoots.length === 2 && 
           approximatelyEqual(userRoots[0], sortedExpected[0]) && 
           approximatelyEqual(userRoots[1], sortedExpected[1]);
    }
    
    results.roots = { ok, expected: expectedRoots };
  }
  
  if ('concavity' in payload) {
    const expectedConcavity = getConcavity(a);
    const ok = payload.concavity === expectedConcavity;
    results.concavity = { ok, expected: expectedConcavity };
  }
  
  if ('axis' in payload) {
    const expectedAxis = getAxisOfSymmetry(a, b);
    const ok = approximatelyEqual(payload.axis, expectedAxis);
    results.axis = { ok, expected: expectedAxis };
  }
  
  if ('range' in payload) {
    const expectedRange = getRange(a, b, c);
    const [userLo, userHi] = payload.range;
    let ok = false;
    
    if (a > 0) {
      ok = approximatelyEqual(userLo, expectedRange[0]) && userHi === null;
    } else {
      ok = userLo === null && approximatelyEqual(userHi, expectedRange[1]);
    }
    
    results.range = { ok, expected: expectedRange };
  }

  const okAll = Object.values(results).every(x => x.ok);
  return { ok: okAll, details: results };
}

export function validateFinal(polynomial, payload) {
  try {
    // Normalize both expressions for comparison
    const normalizedUser = normalizeExpression(payload.equation);
    const normalizedTarget = normalizeExpression(polynomial);
    
    // Check if equations are equivalent
    const okEq = normalizedUser === normalizedTarget;
    
    // Check justification keywords
    const justification = String(payload.justification || '').toLowerCase();
    const keywords = ['cuadrado perfecto', 'raíz doble', 'multiplicidad', 'trinomio', 'perfecto'];
    const hasKeywords = keywords.some(keyword => justification.includes(keyword));
    
    return { 
      ok: okEq && hasKeywords, 
      eqOk: okEq, 
      justificationOk: hasKeywords,
      normalizedUser,
      normalizedTarget
    };
  } catch (error) {
    console.error('Error validating final answer:', error);
    return { 
      ok: false, 
      eqOk: false, 
      justificationOk: false,
      error: 'Invalid mathematical expression'
    };
  }
}
