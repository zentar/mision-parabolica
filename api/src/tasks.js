export function seedMissions() {
  return [
    { 
      key: 'm1', 
      name: 'Misión 1: Detectives de la Parábola', 
      func: '-x^2+4x-3',
      description: 'Analiza la parábola f(x) = -x² + 4x - 3. Encuentra sus propiedades fundamentales.',
      hints: [
        '🔍 Pista 1: El coeficiente principal es -1, por lo que la parábola abre hacia abajo.',
        '📍 Pista 2: Para encontrar el vértice, usa la fórmula x = -b/(2a). Con a = -1 y b = 4, el vértice está en x = 2.',
        '🎯 Pista 3: Las raíces son los puntos donde la función cruza el eje x (y = 0). Factoriza: -x² + 4x - 3 = -(x-1)(x-3).'
      ]
    },
    { 
      key: 'm2', 
      name: 'Misión 2: Formas de la Parábola', 
      func: 'x^2-6x+8',
      description: 'Estudia la parábola f(x) = x² - 6x + 8. Determina su forma y propiedades.',
      hints: [
        '🔍 Pista 1: El coeficiente principal es 1. El término cuadrático es x².',
        '📍 Pista 2: El número que acompaña a x es negativo; si duplicas la raíz secreta la obtienes.',
        '🎯 Pista 3: El término independiente es el cuadrado de la raíz secreta. Factoriza: x² - 6x + 8 = (x-2)(x-4).'
      ]
    },
    { 
      key: 'm3', 
      name: 'Misión 3: Grafiquen la Salvación', 
      func: '2x^2-8x+6',
      description: 'Analiza la parábola f(x) = 2x² - 8x + 6. Determina los puntos clave de su gráfica y comportamiento.',
      hints: [
        '🔍 Pista 1: Factoriza primero: 2x² - 8x + 6 = 2(x² - 4x + 3) = 2(x - 1)(x - 3).',
        '📍 Pista 2: El coeficiente 2 hace que la parábola sea más "estrecha" que x². El vértice está en x = 2.',
        '🎯 Pista 3: Identifica el vértice (2, -2), las raíces (1, 3) y el comportamiento en los extremos. El rango es [-2, ∞).'
      ]
    },
  ];
}

export const finalTarget = {
  polynomial: 'x^2-4x+4',
  factored: '(x-2)^2',
  description: 'Fase Final: El Cuadrado Perfecto',
  explanation: 'Esta es una parábola especial llamada "cuadrado perfecto". Su forma factorizada revela que tiene una raíz doble en x = 2.',
  public: { hints: [
    'Observa que x² - 4x + 4 es un cuadrado perfecto.',
    'Puedes factorizar como (x - 2)².',
    'Esto significa que la parábola toca el eje x en un solo punto: x = 2.',
    'El vértice está en (2, 0) y la parábola abre hacia arriba.'
  ]}
};
