// utils.ts
// 문자열, 숫자 관련 유틸 함수

/**
 * 문자열이 숫자인지 판별
 */
export function isNumericString(value: string): boolean {
  return /^-?\d+(\.\d+)?$/.test(value);
}

/**
 * 문자열의 마지막 글자를 가져오기
 */
export function getLastChar(str: string): string {
  return str.slice(-1);
}

/**
 * 현재 입력창(소수점 제외) 숫자 자릿수
 */
export function getCurrentInputDigitsCount(inputText: string): number {
  return inputText.replace(/\./g, "").length;
}
