// parse.ts
// 문자열 파싱(숫자/연산자 분리)과 최종 결과 포매팅
import { isNumericString } from "../utils/index.js";

/**
 * 입력된 수식 문자열을 숫자 배열과 연산자 배열로 파싱하는 함수
 * UI에 표시되는 연산자 기호(⨯, −, +, ÷)를 JavaScript 연산자(*,-,+,/)로 변환합니다.
 *
 * @param expression - 파싱할 수식 문자열
 * @returns 숫자 배열과 연산자 배열을 포함하는 객체
 */
export function parseExpression(expression: string): {
  numbers: number[];
  ops: string[];
} {
  const numbers: number[] = [];
  const ops: string[] = [];
  // 정규식을 사용하여 숫자와 연산자 추출
  // \d+(\.\d+)? - 정수 또는 소수
  // [^\d=] - 숫자나 '=' 기호가 아닌 문자(연산자)
  const matches = expression.match(/\d+(\.\d+)?|[^\d=]/g) || [];

  // 추출된 각 토큰 처리
  for (const match of matches) {
    if (isNumericString(match)) {
      // 숫자인 경우 숫자 배열에 추가
      numbers.push(Number(match));
    } else if (match !== "=") {
      // 연산자 기호를 JavaScript 연산자로 변환하여 추가
      if (match === "⨯") ops.push("*");
      else if (match === "−") ops.push("-");
      else if (match === "+") ops.push("+");
      else if (match === "÷") ops.push("/");
    }
  }

  return { numbers, ops };
}

/**
 * 계산 결과를 사용자 친화적인 형식으로 포맷팅하는 함수
 * 큰 숫자, 매우 작은 숫자, 소수점 자리 등을 적절히 처리합니다.
 *
 * @param value - 포맷팅할 숫자
 * @returns 포맷팅된 문자열
 */
export function formatResult(value: number): string {
  // 매우 작은 값은 0으로 처리
  if (Math.abs(value) < 1e-10) return "0";

  // 매우 크거나 매우 작은 값은 지수 표기법 사용
  if (Math.abs(value) >= 1e10 || (Math.abs(value) < 1e-6 && value !== 0)) {
    return value.toExponential(5);
  }

  // 소수점 이하 최대 10자리
  return parseFloat(value.toFixed(10)).toString();
}
