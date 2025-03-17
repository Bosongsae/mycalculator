// math.ts
// 실제 사칙연산 처리와 계산 과정

import { ERROR_MESSAGES } from "../constants/index.js";

/**
 * 두 숫자와 하나의 연산자로 단일 연산을 수행하는 함수
 *
 * @param a - 첫 번째 피연산자
 * @param b - 두 번째 피연산자
 * @param op - 수행할 연산자 ('+', '-', '*', '/')
 * @returns 계산 결과
 * @throws 0으로 나누기 시도 시 에러 발생
 */
export function performOperation(a: number, b: number, op: string): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      // 0으로 나누기 방지
      if (Math.abs(b) < 1e-10) {
        throw new Error(ERROR_MESSAGES.DIVISION_BY_ZERO);
      }
      return a / b;
    default:
      return 0;
  }
}

/**
 * 특정 연산자 그룹에 대한 계산을 처리하는 함수
 * 입력 배열을 변경하지 않고 새로운 결과 객체를 반환합니다.
 *
 * @param numbers - 계산에 사용될 숫자 배열
 * @param ops - 계산에 사용될 연산자 배열
 * @param targetOps - 이번 단계에서 처리할 연산자 목록
 * @returns 처리 후의 숫자 배열과 연산자 배열을 포함한 객체
 */
export function processOperations(
  numbers: number[],
  ops: string[],
  targetOps: string[]
): { numbers: number[]; ops: string[] } {
  // 불변성을 위해 입력 배열 복사
  const result = {
    numbers: [...numbers],
    ops: [...ops],
  };

  // 모든 연산자를 순회하며 대상 연산자만 처리
  for (let i = 0; i < result.ops.length; i++) {
    if (targetOps.includes(result.ops[i])) {
      // 현재 연산자로 계산 수행
      const opResult = performOperation(
        result.numbers[i],
        result.numbers[i + 1],
        result.ops[i]
      );

      // 계산 결과를 원래 숫자 위치에 삽입하고, 사용된 숫자와 연산자 제거
      result.numbers.splice(i, 2, opResult);
      result.ops.splice(i, 1);
      i--;
    }
  }

  return result;
}

/**
 * 계산 결과를 생성하는 메인 함수
 * 수학적 우선순위(곱셈/나눗셈 먼저, 덧셈/뺄셈 나중에)에 따라 계산을 수행합니다.
 *
 * @param numbers - 계산에 사용될 숫자 배열
 * @param ops - 계산에 사용될 연산자 배열
 * @returns 계산 결과 숫자
 */
export function calculate(numbers: number[], ops: string[]): number {
  // 특수 케이스 처리: 숫자가 없거나 하나만 있는 경우
  if (numbers.length === 0) return 0;
  if (numbers.length === 1) return numbers[0];

  // 1단계: 곱셈과 나눗셈 연산 먼저 처리
  const firstPass = processOperations(numbers, ops, ["*", "/"]);
  // 2단계: 덧셈과 뺄셈 연산 처리
  const secondPass = processOperations(firstPass.numbers, firstPass.ops, [
    "+",
    "-",
  ]);
  // 최종 결과값 반환
  return secondPass.numbers[0];
}
