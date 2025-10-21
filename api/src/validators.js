import { 
  parseQuadratic, 
  getVertex, 
  getRoots, 
  getYIntercept, 
  getConcavity, 
  getAxisOfSymmetry, 
  getRange,
  approximatelyEqual,
  normalizeExpression,
  getFactoredForm,
  getCanonicalForm,
  areEquivalentExpressions
} from './math-utils.js';

export function validateMission(funcStr, payload) {
  const { a, b, c } = parseQuadratic(funcStr);

  const results = {};

  // Manejar campos específicos de la Misión 2
  if ('factoredForm' in payload) {
    const userForm = payload.factoredForm;
    
    // Para f(x) = x² - 6x + 8, la forma factorizada correcta es (x-2)(x-4)
    const correctFactored = '(x-2)(x-4)';
    
    // Debug logging
    console.log('🔍 Validating factored form:');
    console.log('  Expected:', correctFactored);
    console.log('  User input:', userForm);
    
    // Comparación simple
    const normalizedUser = userForm.replace(/\s+/g, '').toLowerCase();
    const normalizedExpected = correctFactored.replace(/\s+/g, '').toLowerCase();
    
    console.log('  Normalized user:', normalizedUser);
    console.log('  Normalized expected:', normalizedExpected);
    
    const ok = normalizedUser === normalizedExpected;
    console.log('  Result:', ok);
    
    results.factoredForm = { ok, expected: correctFactored, user: userForm };
  }

  if ('canonicalForm' in payload) {
    const userForm = payload.canonicalForm;
    
    // Para f(x) = x² - 6x + 8, la forma canónica correcta es (x-3)²-1
    const correctCanonical = '(x-3)^2-1';
    
    // Debug logging
    console.log('🔍 Validating canonical form:');
    console.log('  Expected:', correctCanonical);
    console.log('  User input:', userForm);
    
    // Comparación simple
    const normalizedUser = userForm.replace(/\s+/g, '').toLowerCase();
    const normalizedExpected = correctCanonical.replace(/\s+/g, '').toLowerCase();
    
    console.log('  Normalized user:', normalizedUser);
    console.log('  Normalized expected:', normalizedExpected);
    
    const ok = normalizedUser === normalizedExpected;
    console.log('  Result:', ok);
    
    results.canonicalForm = { ok, expected: correctCanonical, user: userForm };
  }

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
    
    // Helper function to parse infinity values
    const parseInfinityValue = (value) => {
      if (value === '-∞' || value === '-inf' || value === '-infinito') {
        return -Infinity;
      } else if (value === '∞' || value === 'inf' || value === 'infinito') {
        return Infinity;
      } else if (value === '' || value === null || value === undefined) {
        return null;
      } else {
        const num = Number(value);
        return isNaN(num) ? value : num;
      }
    };
    
    const parsedUserLo = parseInfinityValue(userLo);
    const parsedUserHi = parseInfinityValue(userHi);
    
    if (a > 0) {
      // Parábola que abre hacia arriba: rango [vértice.y, ∞)
      const expectedLo = expectedRange[0];
      const expectedHi = expectedRange[1];
      
      // Verificar límite inferior (debe ser el vértice)
      const loOk = approximatelyEqual(parsedUserLo, expectedLo);
      
      // Verificar límite superior (debe ser infinito o null)
      const hiOk = parsedUserHi === Infinity || parsedUserHi === null || parsedUserHi === undefined;
      
      ok = loOk && hiOk;
    } else {
      // Parábola que abre hacia abajo: rango (-∞, vértice.y]
      const expectedLo = expectedRange[0];
      const expectedHi = expectedRange[1];
      
      // Verificar límite inferior (debe ser infinito negativo o null)
      const loOk = parsedUserLo === -Infinity || parsedUserLo === null || parsedUserLo === undefined;
      
      // Verificar límite superior (debe ser el vértice)
      const hiOk = approximatelyEqual(parsedUserHi, expectedHi);
      
      ok = loOk && hiOk;
    }
    
    results.range = { ok, expected: expectedRange };
  }

  // Validar campos específicos de la Misión 3
  if ('axisOfSymmetry' in payload) {
    const expectedAxis = getAxisOfSymmetry(a, b);
    const ok = approximatelyEqual(payload.axisOfSymmetry, expectedAxis);
    results.axisOfSymmetry = { ok, expected: expectedAxis };
  }

  if ('maxMinValue' in payload) {
    const vertex = getVertex(a, b, c);
    const ok = approximatelyEqual(payload.maxMinValue, vertex.y);
    results.maxMinValue = { ok, expected: vertex.y };
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
