import { create, all } from 'mathjs';

// Create mathjs instance with all functions
const math = create(all);

// Configure mathjs for better precision
math.config({
  number: 'number',
  precision: 64,
  epsilon: 1e-12
});

/**
 * Parse a quadratic function string and return coefficients
 * Supports formats like: "ax^2+bx+c", "x^2+4x+3", "-2x^2+6x-4"
 */
export function parseQuadratic(funcStr) {
  try {
    // Clean the input string
    const cleanStr = funcStr.replace(/\s+/g, '').toLowerCase();
    
    // Parse the expression
    const node = math.parse(cleanStr);
    
    // Extract coefficients by evaluating at specific points
    // For f(x) = ax^2 + bx + c:
    // f(0) = c
    // f(1) = a + b + c  
    // f(-1) = a - b + c
    // Solving: a = (f(1) + f(-1) - 2f(0))/2
    //          b = f(1) - f(0) - a
    //          c = f(0)
    
    const c = node.evaluate({ x: 0 });
    const f1 = node.evaluate({ x: 1 });
    const f_1 = node.evaluate({ x: -1 });
    
    const a = (f1 + f_1 - 2 * c) / 2;
    const b = f1 - c - a;
    
    return { a, b, c };
  } catch (error) {
    console.error('Error parsing quadratic function:', error);
    throw new Error('Invalid quadratic function format');
  }
}

/**
 * Calculate the vertex of a quadratic function
 */
export function getVertex(a, b, c) {
  const x = -b / (2 * a);
  const y = a * x * x + b * x + c;
  return { x, y };
}

/**
 * Calculate the roots of a quadratic function
 */
export function getRoots(a, b, c) {
  const discriminant = b * b - 4 * a * c;
  
  if (discriminant < 0) {
    return []; // No real roots
  } else if (discriminant === 0) {
    const root = -b / (2 * a);
    return [root]; // One real root (double root)
  } else {
    const root1 = (-b + Math.sqrt(discriminant)) / (2 * a);
    const root2 = (-b - Math.sqrt(discriminant)) / (2 * a);
    return [root1, root2].sort((x, y) => x - y);
  }
}

/**
 * Get the y-intercept of a quadratic function
 */
export function getYIntercept(a, b, c) {
  return c;
}

/**
 * Determine the concavity of a quadratic function
 */
export function getConcavity(a) {
  return a > 0 ? 'up' : 'down';
}

/**
 * Get the axis of symmetry
 */
export function getAxisOfSymmetry(a, b) {
  return -b / (2 * a);
}

/**
 * Get the range of a quadratic function
 */
export function getRange(a, b, c) {
  const vertex = getVertex(a, b, c);
  if (a > 0) {
    return [vertex.y, Infinity];
  } else {
    return [-Infinity, vertex.y];
  }
}

/**
 * Check if two numbers are approximately equal
 */
export function approximatelyEqual(a, b, epsilon = 1e-6) {
  return Math.abs(a - b) <= epsilon;
}

/**
 * Normalize a mathematical expression for comparison
 */
export function normalizeExpression(expr) {
  try {
    // Normalize the expression string first
    let normalized = expr
      .replace(/\s+/g, '') // Remove all spaces
      .replace(/\*/g, '') // Remove multiplication signs
      .toLowerCase(); // Convert to lowercase
    
    // Try to parse and simplify
    const node = math.parse(normalized);
    const simplified = math.simplify(node);
    return simplified.toString();
  } catch (error) {
    // Fallback to string normalization
    return expr
      .replace(/\s+/g, '')
      .replace(/\*/g, '')
      .toLowerCase();
  }
}

/**
 * Validate if an expression is a valid quadratic function
 */
export function isValidQuadratic(expr) {
  try {
    const node = math.parse(expr);
    const variables = node.filter(node => node.isSymbolNode && node.name === 'x');
    return variables.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Convert a quadratic function to different forms
 */
export function convertQuadratic(a, b, c, targetForm = 'standard') {
  switch (targetForm) {
    case 'standard':
      return `${a}x² + ${b}x + ${c}`;
    case 'vertex':
      const vertex = getVertex(a, b, c);
      return `a(x - ${vertex.x})² + ${vertex.y}`;
    case 'factored':
      const roots = getRoots(a, b, c);
      if (roots.length === 2) {
        return `a(x - ${roots[0]})(x - ${roots[1]})`;
      } else if (roots.length === 1) {
        return `a(x - ${roots[0]})²`;
      } else {
        return 'No real factors';
      }
    default:
      return `${a}x² + ${b}x + ${c}`;
  }
}

/**
 * Calculate the discriminant
 */
export function getDiscriminant(a, b, c) {
  return b * b - 4 * a * c;
}

/**
 * Get the nature of roots based on discriminant
 */
export function getRootNature(a, b, c) {
  const discriminant = getDiscriminant(a, b, c);
  
  if (discriminant > 0) {
    return 'two_distinct_real';
  } else if (discriminant === 0) {
    return 'one_real_double';
  } else {
    return 'no_real_roots';
  }
}

/**
 * Get the factored form of a quadratic function
 */
export function getFactoredForm(a, b, c) {
  const roots = getRoots(a, b, c);
  
  if (roots.length === 0) {
    // No real roots, return the original form
    return `${a}x^2+${b}x+${c}`;
  } else if (roots.length === 1) {
    // One double root
    const root = roots[0];
    return `(x-${root})^2`;
  } else {
    // Two distinct roots
    const [r1, r2] = roots.sort((x, y) => x - y);
    return `(x-${r1})(x-${r2})`;
  }
}

/**
 * Get the canonical form (vertex form) of a quadratic function
 */
export function getCanonicalForm(a, b, c) {
  const vertex = getVertex(a, b, c);
  const h = vertex.x;
  const k = vertex.y;
  
  return `(x-${h})^2+${k}`;
}

/**
 * Check if two expressions are mathematically equivalent
 */
export function areEquivalentExpressions(expr1, expr2) {
  try {
    // Normalize both expressions
    const norm1 = expr1.replace(/\s+/g, '').toLowerCase();
    const norm2 = expr2.replace(/\s+/g, '').toLowerCase();
    
    // Direct string comparison first
    if (norm1 === norm2) return true;
    
    // Try to parse and compare mathematically
    const node1 = math.parse(norm1);
    const node2 = math.parse(norm2);
    
    // Simplify both expressions
    const simplified1 = math.simplify(node1);
    const simplified2 = math.simplify(node2);
    
    // Compare the simplified forms
    return simplified1.toString() === simplified2.toString();
  } catch (error) {
    // If parsing fails, fall back to string comparison
    return expr1.replace(/\s+/g, '').toLowerCase() === expr2.replace(/\s+/g, '').toLowerCase();
  }
}

export { math };

