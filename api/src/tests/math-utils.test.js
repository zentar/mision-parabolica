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
  getDiscriminant,
  getRootNature
} from '../math-utils.js';

describe('Math Utils', () => {
  describe('parseQuadratic', () => {
    test('should parse x^2 + 4x + 3 correctly', () => {
      const result = parseQuadratic('x^2 + 4x + 3');
      expect(result.a).toBeCloseTo(1);
      expect(result.b).toBeCloseTo(4);
      expect(result.c).toBeCloseTo(3);
    });

    test('should parse -2x^2 + 6x - 4 correctly', () => {
      const result = parseQuadratic('-2x^2 + 6x - 4');
      expect(result.a).toBeCloseTo(-2);
      expect(result.b).toBeCloseTo(6);
      expect(result.c).toBeCloseTo(-4);
    });

    test('should handle expressions without spaces', () => {
      const result = parseQuadratic('x^2+4x+3');
      expect(result.a).toBeCloseTo(1);
      expect(result.b).toBeCloseTo(4);
      expect(result.c).toBeCloseTo(3);
    });

    test('should throw error for invalid expressions', () => {
      expect(() => parseQuadratic('invalid')).toThrow('Invalid quadratic function format');
    });
  });

  describe('getVertex', () => {
    test('should calculate vertex for x^2 + 4x + 3', () => {
      const vertex = getVertex(1, 4, 3);
      expect(vertex.x).toBeCloseTo(-2);
      expect(vertex.y).toBeCloseTo(-1);
    });

    test('should calculate vertex for -2x^2 + 6x - 4', () => {
      const vertex = getVertex(-2, 6, -4);
      expect(vertex.x).toBeCloseTo(1.5);
      expect(vertex.y).toBeCloseTo(0.5);
    });
  });

  describe('getRoots', () => {
    test('should find two distinct roots for x^2 - 5x + 6', () => {
      const roots = getRoots(1, -5, 6);
      expect(roots).toHaveLength(2);
      expect(roots[0]).toBeCloseTo(2);
      expect(roots[1]).toBeCloseTo(3);
    });

    test('should find one double root for x^2 - 4x + 4', () => {
      const roots = getRoots(1, -4, 4);
      expect(roots).toHaveLength(1);
      expect(roots[0]).toBeCloseTo(2);
    });

    test('should return empty array for no real roots', () => {
      const roots = getRoots(1, 1, 1);
      expect(roots).toHaveLength(0);
    });
  });

  describe('getYIntercept', () => {
    test('should return correct y-intercept', () => {
      const yIntercept = getYIntercept(1, 4, 3);
      expect(yIntercept).toBeCloseTo(3);
    });
  });

  describe('getConcavity', () => {
    test('should return "up" for positive coefficient', () => {
      expect(getConcavity(1)).toBe('up');
      expect(getConcavity(2)).toBe('up');
    });

    test('should return "down" for negative coefficient', () => {
      expect(getConcavity(-1)).toBe('down');
      expect(getConcavity(-2)).toBe('down');
    });
  });

  describe('getAxisOfSymmetry', () => {
    test('should calculate axis of symmetry correctly', () => {
      const axis = getAxisOfSymmetry(1, 4);
      expect(axis).toBeCloseTo(-2);
    });
  });

  describe('getRange', () => {
    test('should return correct range for upward parabola', () => {
      const range = getRange(1, 4, 3);
      expect(range[0]).toBeCloseTo(-1);
      expect(range[1]).toBe(Infinity);
    });

    test('should return correct range for downward parabola', () => {
      const range = getRange(-2, 6, -4);
      expect(range[0]).toBe(-Infinity);
      expect(range[1]).toBeCloseTo(0.5);
    });
  });

  describe('approximatelyEqual', () => {
    test('should return true for close numbers', () => {
      expect(approximatelyEqual(1.0000001, 1.0000002)).toBe(true);
    });

    test('should return false for different numbers', () => {
      expect(approximatelyEqual(1.0, 1.1)).toBe(false);
    });

    test('should work with custom epsilon', () => {
      expect(approximatelyEqual(1.0, 1.01, 0.1)).toBe(true);
    });
  });

  describe('normalizeExpression', () => {
    test('should normalize basic expressions', () => {
      const normalized = normalizeExpression('x^2 + 4x + 3');
      expect(normalized).toBeDefined();
    });
  });

  describe('getDiscriminant', () => {
    test('should calculate positive discriminant', () => {
      const discriminant = getDiscriminant(1, -5, 6);
      expect(discriminant).toBeCloseTo(1);
    });

    test('should calculate zero discriminant', () => {
      const discriminant = getDiscriminant(1, -4, 4);
      expect(discriminant).toBeCloseTo(0);
    });

    test('should calculate negative discriminant', () => {
      const discriminant = getDiscriminant(1, 1, 1);
      expect(discriminant).toBeCloseTo(-3);
    });
  });

  describe('getRootNature', () => {
    test('should identify two distinct real roots', () => {
      const nature = getRootNature(1, -5, 6);
      expect(nature).toBe('two_distinct_real');
    });

    test('should identify one real double root', () => {
      const nature = getRootNature(1, -4, 4);
      expect(nature).toBe('one_real_double');
    });

    test('should identify no real roots', () => {
      const nature = getRootNature(1, 1, 1);
      expect(nature).toBe('no_real_roots');
    });
  });
});