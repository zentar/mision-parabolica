import { validateMission, validateFinal } from '../validators.js';

describe('Validators', () => {
  describe('validateMission', () => {
    const testFunction = 'x^2 + 4x + 3'; // a=1, b=4, c=3, vertex=(-2,-1), roots=[-1,-3]

    test('should validate correct vertex', () => {
      const payload = {
        vertex: { x: -2, y: -1 }
      };
      const result = validateMission(testFunction, payload);
      expect(result.ok).toBe(true);
      expect(result.details.vertex.ok).toBe(true);
    });

    test('should reject incorrect vertex', () => {
      const payload = {
        vertex: { x: 0, y: 0 }
      };
      const result = validateMission(testFunction, payload);
      expect(result.ok).toBe(false);
      expect(result.details.vertex.ok).toBe(false);
    });

    test('should validate correct y-intercept', () => {
      const payload = {
        yIntercept: 3
      };
      const result = validateMission(testFunction, payload);
      expect(result.ok).toBe(true);
      expect(result.details.yIntercept.ok).toBe(true);
    });

    test('should validate correct roots', () => {
      const payload = {
        roots: [-1, -3]
      };
      const result = validateMission(testFunction, payload);
      expect(result.ok).toBe(true);
      expect(result.details.roots.ok).toBe(true);
    });

    test('should validate correct concavity', () => {
      const payload = {
        concavity: 'up'
      };
      const result = validateMission(testFunction, payload);
      expect(result.ok).toBe(true);
      expect(result.details.concavity.ok).toBe(true);
    });

    test('should validate correct axis of symmetry', () => {
      const payload = {
        axis: -2
      };
      const result = validateMission(testFunction, payload);
      expect(result.ok).toBe(true);
      expect(result.details.axis.ok).toBe(true);
    });

    test('should validate correct range for upward parabola', () => {
      const payload = {
        range: [-1, null]
      };
      const result = validateMission(testFunction, payload);
      expect(result.ok).toBe(true);
      expect(result.details.range.ok).toBe(true);
    });

    test('should validate all properties together', () => {
      const payload = {
        vertex: { x: -2, y: -1 },
        yIntercept: 3,
        roots: [-1, -3],
        concavity: 'up',
        axis: -2,
        range: [-1, null]
      };
      const result = validateMission(testFunction, payload);
      expect(result.ok).toBe(true);
      expect(Object.values(result.details).every(detail => detail.ok)).toBe(true);
    });

    test('should handle downward parabola', () => {
      const downwardFunction = '-x^2 + 4x - 3';
      const payload = {
        vertex: { x: 2, y: 1 },
        concavity: 'down',
        range: [null, 1]
      };
      const result = validateMission(downwardFunction, payload);
      expect(result.ok).toBe(true);
    });
  });

  describe('validateFinal', () => {
    const targetPolynomial = 'x^2-4x+4';

    test('should validate correct equation and justification', () => {
      const payload = {
        equation: '(x-2)^2',
        justification: 'Trinomio cuadrado perfecto, raíz doble'
      };
      const result = validateFinal(targetPolynomial, payload);
      expect(result.ok).toBe(true);
      expect(result.eqOk).toBe(true);
      expect(result.justificationOk).toBe(true);
    });

    test('should reject incorrect equation', () => {
      const payload = {
        equation: '(x-1)^2',
        justification: 'Trinomio cuadrado perfecto'
      };
      const result = validateFinal(targetPolynomial, payload);
      expect(result.ok).toBe(false);
      expect(result.eqOk).toBe(false);
      expect(result.justificationOk).toBe(true);
    });

    test('should reject missing justification keywords', () => {
      const payload = {
        equation: '(x-2)^2',
        justification: 'Es una parábola'
      };
      const result = validateFinal(targetPolynomial, payload);
      expect(result.ok).toBe(false);
      expect(result.eqOk).toBe(true);
      expect(result.justificationOk).toBe(false);
    });

    test('should accept various justification keywords', () => {
      const keywords = [
        'cuadrado perfecto',
        'raíz doble',
        'multiplicidad',
        'trinomio',
        'perfecto'
      ];

      keywords.forEach(keyword => {
        const payload = {
          equation: '(x-2)^2',
          justification: `Explicación con ${keyword}`
        };
        const result = validateFinal(targetPolynomial, payload);
        expect(result.justificationOk).toBe(true);
      });
    });

    test('should handle different equation formats', () => {
      const formats = [
        '(x-2)^2',
        'x^2-4x+4',
        'x²-4x+4'
      ];

      formats.forEach(equation => {
        const payload = {
          equation,
          justification: 'Trinomio cuadrado perfecto'
        };
        const result = validateFinal(targetPolynomial, payload);
        expect(result.eqOk).toBe(true);
      });
    });

    test('should handle invalid mathematical expressions', () => {
      const payload = {
        equation: 'invalid expression',
        justification: 'Trinomio cuadrado perfecto'
      };
      const result = validateFinal(targetPolynomial, payload);
      expect(result.ok).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});


