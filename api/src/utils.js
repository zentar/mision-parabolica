export function parseQuad(funcStr) {
  // expects forms like 'ax^2+bx+c' with possible spaces
  const s = funcStr.replace(/\s+/g, '');
  const m = s.match(/^([+-]?\d*)x\^2([+-]?\d*)x([+-]?\d+)$|^x\^2([+-]?\d*)x([+-]?\d+)$/i);
  if (!m) {
    // try simpler parser
    let a=0,b=0,c=0;
    const parts = s.replace(/-/g,'+-').split('+').filter(Boolean);
    for (const p of parts) {
      if (p.includes('x^2')) {
        const coef = p.replace('x^2','');
        a = coef === '' ? 1 : (coef === '-' ? -1 : Number(coef));
      } else if (p.includes('x')) {
        const coef = p.replace('x','');
        b = coef === '' ? 1 : (coef === '-' ? -1 : Number(coef));
      } else {
        c = Number(p);
      }
    }
    return { a,b,c };
  }
  // fallback but usually we won't hit here
  return { a: 1, b: 1, c: 0 };
}

export function approx(a,b,eps=1e-6){ return Math.abs(a-b) <= eps; }
