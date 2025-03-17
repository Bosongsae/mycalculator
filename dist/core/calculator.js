// math.ts
// 실제 사칙연산 처리와 계산 과정
import { ERROR_MESSAGES } from "../constants/index.js";
/**
 * 개별 연산 수행
 */
export function performOperation(a, b, op) {
    switch (op) {
        case "+":
            return a + b;
        case "-":
            return a - b;
        case "*":
            return a * b;
        case "/":
            if (Math.abs(b) < 1e-10) {
                throw new Error(ERROR_MESSAGES.DIVISION_BY_ZERO);
            }
            return a / b;
        default:
            return 0;
    }
}
/**
 * 특정 연산자 그룹(곱셈, 나눗셈 등)을 먼저 처리
 */
export function processOperations(numbers, ops, targetOps) {
    const result = {
        numbers: [...numbers],
        ops: [...ops],
    };
    for (let i = 0; i < result.ops.length; i++) {
        if (targetOps.includes(result.ops[i])) {
            const opResult = performOperation(result.numbers[i], result.numbers[i + 1], result.ops[i]);
            // 결과 반영 및 처리된 요소 제거
            result.numbers.splice(i, 2, opResult);
            result.ops.splice(i, 1);
            i--;
        }
    }
    return result;
}
/**
 * 최종 계산을 진행
 */
export function calculate(numbers, ops) {
    if (numbers.length === 0)
        return 0;
    if (numbers.length === 1)
        return numbers[0];
    // 1단계: 곱셈과 나눗셈
    const firstPass = processOperations(numbers, ops, ["*", "/"]);
    // 2단계: 덧셈과 뺄셈
    const secondPass = processOperations(firstPass.numbers, firstPass.ops, [
        "+",
        "-",
    ]);
    return secondPass.numbers[0];
}
