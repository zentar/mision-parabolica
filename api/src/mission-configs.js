// Configuraciones de misiones parametrizadas
export const missionTemplates = {
  // Plantilla para Misión 1: Análisis Básico
  m1: {
    name: 'Misión 1: Detectives de la Parábola',
    description: 'Analiza la parábola f(x) = {function}. Encuentra sus propiedades fundamentales.',
    hints: [
      '🔍 Pista 1: El coeficiente principal es {a}, por lo que la parábola abre hacia {direction}.',
      '📍 Pista 2: Para encontrar el vértice, usa la fórmula x = -b/(2a). Con a = {a} y b = {b}, el vértice está en x = {vertex_x}.',
      '🎯 Pista 3: Las raíces son los puntos donde la función cruza el eje x (y = 0). Factoriza: {function} = {factored_form}.'
    ]
  },
  
  // Plantilla para Misión 2: Formas de la Parábola
  m2: {
    name: 'Misión 2: Formas de la Parábola',
    description: 'Estudia la parábola f(x) = {function}. Determina su forma y propiedades.',
    hints: [
      '🔍 Pista 1: El coeficiente principal es {a}. El término cuadrático es x².',
      '📍 Pista 2: El número que acompaña a x es {b_sign}; si duplicas la raíz secreta la obtienes.',
      '🎯 Pista 3: El término independiente es el cuadrado de la raíz secreta. Factoriza: {function} = {factored_form}.'
    ]
  },
  
  // Plantilla para Misión 3: Propiedades Avanzadas
  m3: {
    name: 'Misión 3: Grafiquen la Salvación',
    description: 'Analiza la parábola f(x) = {function}. Determina los puntos clave de su gráfica y comportamiento.',
    hints: [
      '🔍 Pista 1: Factoriza primero: {function} = {factored_form}.',
      '📍 Pista 2: El coeficiente {a} hace que la parábola sea más "{width}" que x². El vértice está en x = {vertex_x}.',
      '🎯 Pista 3: Identifica el vértice ({vertex_x}, {vertex_y}), las raíces ({roots}) y el comportamiento en los extremos. El rango es [{range_min}, {range_max}]).'
    ]
  }
};

// Configuraciones de ecuaciones predefinidas
export const equationSets = {
  // Conjunto 1: Ecuaciones básicas
  basic: [
    {
      key: 'm1',
      function: '-x^2+4x-3',
      a: -1, b: 4, c: -3,
      factored_form: '-(x-1)(x-3)',
      vertex_x: 2,
      vertex_y: 1,
      roots: [1, 3],
      direction: 'abajo',
      b_sign: 'negativo',
      width: 'estrecha',
      range_min: '-∞',
      range_max: '1'
    },
    {
      key: 'm2',
      function: 'x^2-6x+8',
      a: 1, b: -6, c: 8,
      factored_form: '(x-2)(x-4)',
      vertex_x: 3,
      vertex_y: -1,
      roots: [2, 4],
      direction: 'arriba',
      b_sign: 'negativo',
      width: 'normal',
      range_min: '-1',
      range_max: '∞'
    },
    {
      key: 'm3',
      function: '2x^2-8x+6',
      a: 2, b: -8, c: 6,
      factored_form: '2(x-1)(x-3)',
      vertex_x: 2,
      vertex_y: -2,
      roots: [1, 3],
      direction: 'arriba',
      b_sign: 'negativo',
      width: 'estrecha',
      range_min: '-2',
      range_max: '∞'
    }
  ],
  
  // Conjunto 2: Ecuaciones intermedias
  intermediate: [
    {
      key: 'm1',
      function: 'x^2-2x-3',
      a: 1, b: -2, c: -3,
      factored_form: '(x+1)(x-3)',
      vertex_x: 1,
      vertex_y: -4,
      roots: [-1, 3],
      direction: 'arriba',
      b_sign: 'negativo',
      width: 'normal',
      range_min: '-4',
      range_max: '∞'
    },
    {
      key: 'm2',
      function: '-2x^2+4x+6',
      a: -2, b: 4, c: 6,
      factored_form: '-2(x+1)(x-3)',
      vertex_x: 1,
      vertex_y: 8,
      roots: [-1, 3],
      direction: 'abajo',
      b_sign: 'positivo',
      width: 'estrecha',
      range_min: '-∞',
      range_max: '8'
    },
    {
      key: 'm3',
      function: 'x^2-4x+4',
      a: 1, b: -4, c: 4,
      factored_form: '(x-2)^2',
      vertex_x: 2,
      vertex_y: 0,
      roots: [2, 2],
      direction: 'arriba',
      b_sign: 'negativo',
      width: 'normal',
      range_min: '0',
      range_max: '∞'
    }
  ],
  
  // Conjunto 3: Ecuaciones avanzadas
  advanced: [
    {
      key: 'm1',
      function: '3x^2-12x+9',
      a: 3, b: -12, c: 9,
      factored_form: '3(x-1)(x-3)',
      vertex_x: 2,
      vertex_y: -3,
      roots: [1, 3],
      direction: 'arriba',
      b_sign: 'negativo',
      width: 'estrecha',
      range_min: '-3',
      range_max: '∞'
    },
    {
      key: 'm2',
      function: '-x^2+6x-5',
      a: -1, b: 6, c: -5,
      factored_form: '-(x-1)(x-5)',
      vertex_x: 3,
      vertex_y: 4,
      roots: [1, 5],
      direction: 'abajo',
      b_sign: 'positivo',
      width: 'normal',
      range_min: '-∞',
      range_max: '4'
    },
    {
      key: 'm3',
      function: 'x^2-8x+15',
      a: 1, b: -8, c: 15,
      factored_form: '(x-3)(x-5)',
      vertex_x: 4,
      vertex_y: -1,
      roots: [3, 5],
      direction: 'arriba',
      b_sign: 'negativo',
      width: 'normal',
      range_min: '-1',
      range_max: '∞'
    }
  ]
};

// Función para generar misiones basadas en un conjunto de ecuaciones
export function generateMissions(equationSet = 'basic') {
  const equations = equationSets[equationSet];
  const missions = [];
  
  equations.forEach(eq => {
    const template = missionTemplates[eq.key];
    const mission = {
      key: eq.key,
      name: template.name,
      func: eq.function,
      description: template.description.replace('{function}', eq.function),
      hints: template.hints.map(hint => 
        hint
          .replace('{function}', eq.function)
          .replace('{a}', eq.a)
          .replace('{b}', eq.b)
          .replace('{c}', eq.c)
          .replace('{factored_form}', eq.factored_form)
          .replace('{vertex_x}', eq.vertex_x)
          .replace('{vertex_y}', eq.vertex_y)
          .replace('{roots}', eq.roots.join(', '))
          .replace('{direction}', eq.direction)
          .replace('{b_sign}', eq.b_sign)
          .replace('{width}', eq.width)
          .replace('{range_min}', eq.range_min)
          .replace('{range_max}', eq.range_max)
      )
    };
    missions.push(mission);
  });
  
  return missions;
}

// Función para obtener el target final basado en el conjunto
export function getFinalTarget(equationSet = 'basic') {
  const finalTargets = {
    basic: {
      polynomial: 'x^2-4x+4',
      factored: '(x-2)^2',
      description: 'La ecuación final que resuelve el misterio',
      public: { 
        hints: [
          'El coeficiente principal es 1. El término cuadrático es x².',
          'El número que acompaña a x es negativo; si duplicas la raíz secreta la obtienes.',
          'El término independiente es el cuadrado de la raíz secreta.'
        ]
      }
    },
    intermediate: {
      polynomial: 'x^2-2x+1',
      factored: '(x-1)^2',
      description: 'La ecuación final que resuelve el misterio (Intermedio)',
      public: { 
        hints: [
          'Observa que esta ecuación tiene una forma especial.',
          '¿Puedes identificar qué tipo de expresión es x² - 2x + 1?',
          'Recuerda que hay expresiones que se pueden escribir como el cuadrado de un binomio.',
          '¿Qué número al cuadrado da 1, y qué número multiplicado por 2 da 2?'
        ]
      }
    },
    advanced: {
      polynomial: 'x^2-6x+9',
      factored: '(x-3)^2',
      description: 'La ecuación final que resuelve el misterio (Avanzado)',
      public: { 
        hints: [
          'Observa que esta ecuación tiene una forma especial.',
          '¿Puedes identificar qué tipo de expresión es x² - 6x + 9?',
          'Recuerda que hay expresiones que se pueden escribir como el cuadrado de un binomio.',
          '¿Qué número al cuadrado da 9, y qué número multiplicado por 2 da 6?'
        ]
      }
    }
  };
  
  return finalTargets[equationSet];
}
