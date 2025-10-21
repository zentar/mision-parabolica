export function seedMissions() {
  return [
    { key: 'm1', name: 'Misión 1', func: '-x^2+4x-3' },
    { key: 'm2', name: 'Misión 2', func: 'x^2-6x+8' },
    { key: 'm3', name: 'Misión 3', func: '2x^2-8x+6' },
  ];
}

export const finalTarget = {
  polynomial: 'x^2-4x+4',
  factored: '(x-2)^2',
  public: { hints: [
    'El coeficiente principal es 1. El término cuadrático es x².',
    'El número que acompaña a x es negativo; si duplicas la raíz secreta lo obtienes.',
    'El término independiente es el cuadrado de la raíz secreta.'
  ]}
};
