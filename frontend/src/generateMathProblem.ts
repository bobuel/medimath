export interface MathProblem {
  question: string;
  answer: number;
  points: 1 | 2 | 3;
}

export function generateMathProblem(difficulty: 1 | 2 | 3): MathProblem {
  if (difficulty === 1) {
    const a = Math.floor(Math.random() * 11);
    const b = Math.floor(Math.random() * 11);
    if (Math.random() < 0.5) {
      return { question: `${a} + ${b}`, answer: a + b, points: 1 };
    }
    const big = a + b <= 20 ? a + b : 20;
    const c = Math.floor(Math.random() * (big + 1));
    return { question: `${big} - ${c}`, answer: big - c, points: 1 };
  }

  if (difficulty === 2) {
    if (Math.random() < 0.5) {
      const a = Math.floor(Math.random() * 50) + 1;
      const b = Math.floor(Math.random() * 50) + 1;
      return { question: `${a} - ${b}`, answer: a - b, points: 2 };
    }
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    return { question: `${a} \u00d7 ${b}`, answer: a * b, points: 2 };
  }

  const divisor = Math.floor(Math.random() * 12) + 1;
  const quotient = Math.floor(Math.random() * 12) + 1;
  const dividend = divisor * quotient;
  return {
    question: `${dividend} \u00F7 ${divisor}`,
    answer: quotient,
    points: 3,
  };
}
