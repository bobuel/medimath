import { generateMathProblem } from './generateMathProblem';

describe('generateMathProblem', () => {
  test('difficulty 1 within 0-20', () => {
    for (let i = 0; i < 20; i += 1) {
      const { question, answer, points } = generateMathProblem(1);
      expect(typeof question).toBe('string');
      expect(typeof answer).toBe('number');
      expect(points).toBe(1);
      expect(answer).toBeLessThanOrEqual(20);
    }
  });

  test('difficulty 2 subtraction/multiplication <=100', () => {
    for (let i = 0; i < 20; i += 1) {
      const { answer, points } = generateMathProblem(2);
      expect(points).toBe(2);
      expect(Math.abs(answer)).toBeLessThanOrEqual(100);
    }
  });

  test('difficulty 3 division exact', () => {
    for (let i = 0; i < 20; i += 1) {
      const { question, answer, points } = generateMathProblem(3);
      expect(points).toBe(3);
      expect(answer).toBeGreaterThanOrEqual(1);
      expect(answer).toBeLessThanOrEqual(12);
      expect(question).toMatch(/\u00F7/);
    }
  });
});
