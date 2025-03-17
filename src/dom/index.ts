// dom.ts
// DOM 요소 접근 및 기본적인 화면 조작 로직
// 이 모듈은 계산기의 UI 요소와 상호작용하는 모든 함수를 포함합니다.

import { lastInputs, setLastInputs } from "../store/index.js";

/**
 * 현재 입력 표시 요소(입력 숫자를 보여주는 화면)를 반환하는 함수
 * 계산기의 주요 숫자 디스플레이 영역을 참조합니다.
 *
 * @returns 입력 숫자 표시 DOM 요소
 */
export function getInputElement(): HTMLElement {
  return document.getElementById("inputnumber") as HTMLElement;
}

/**
 * 이전 입력 히스토리 표시 요소를 반환하는 함수
 * 계산기의 상단 히스토리 표시 영역을 참조합니다.
 *
 * @returns 히스토리 표시 DOM 요소
 */
export function getLastInputElement(): HTMLElement {
  return document.getElementById("lastinput") as HTMLElement;
}

/**
 * 경고창을 보여주는 함수
 * 오류 메시지나 알림을 사용자에게 표시합니다.
 *
 * @param message - 표시할 경고 메시지
 */
export function showAlert(message: string): void {
  alert(message);
}

/**
 * 화면 전체를 초기화하는 함수
 * 입력 화면과 히스토리 화면을 모두 비우고 상태도 초기화합니다.
 */
export function clearDisplay(): void {
  getInputElement().textContent = "";
  getLastInputElement().textContent = "";
  setLastInputs(""); // 상태도 함께 초기화
}

/**
 * 현재 입력 화면만 지우는 함수
 * 히스토리는 유지한 채 현재 입력 부분만 초기화합니다.
 */
export function clearInput(): void {
  getInputElement().textContent = "";
}

/**
 * 숫자나 문자열을 현재 입력 화면에 추가하는 함수
 * 화면에 표시되는 내용과 상태 변수를 동시에 업데이트합니다.
 *
 * @param value - 화면에 추가할 값
 */
export function appendToDisplay(value: string): void {
  const inputElement = getInputElement();

  // 입력 화면 업데이트
  if (inputElement.textContent === null) {
    inputElement.textContent = value;
  } else {
    inputElement.textContent += value;
  }

  // 상태 변수도 함께 업데이트 (원래 calculator.ts에서처럼)
  setLastInputs(lastInputs + value);
}

/**
 * 히스토리 화면을 업데이트하는 함수
 * lastInputs 상태 값을 히스토리 표시 영역에 반영합니다.
 */
export function updateLastInputDisplay(): void {
  getLastInputElement().textContent = lastInputs;
}
