// store.ts
// 계산기 애플리케이션의 상태 관리 모듈
// 전역 상태 변수들과 이를 조작하는 함수들을 정의합니다.

import { getLastInputElement } from "../dom/index.js";

/**
 * 계산에 사용될 숫자 배열
 * 파싱된 표현식에서 추출된 숫자들을 저장합니다.
 */
export let numbers: number[] = [];

/**
 * 계산에 사용될 연산자 배열
 * 파싱된 표현식에서 추출된 연산자들을 저장합니다.
 */
export let ops: string[] = [];

/**
 * 사용자가 입력한 전체 수식 문자열
 * 숫자, 연산자, 결과 기호(=)를 포함한 전체 입력 내용을 저장합니다.
 */
export let lastInputs: string = "";

/**
 * 계산 완료 상태를 나타내는 플래그
 * true: 계산 결과가 표시된 상태
 * false: 입력 진행 중인 상태
 */
export let isConclusion: boolean = false;

/**
 * 계산이 끝난 뒤 상태를 초기화하는 함수
 * 모든 상태 변수를 초기값으로 되돌립니다.
 */
export function resetState(): void {
  numbers = [];
  ops = [];
  lastInputs = "";
  isConclusion = false;
}

/**
 * 히스토리 디스플레이를 업데이트하는 함수
 * lastInputs 값을 화면에 표시합니다.
 */
export function updateLastInputDisplay(): void {
  getLastInputElement().textContent = lastInputs;
}

/**
 * lastInputs 상태 변수의 값을 설정하는 함수
 * 상태 변경 시 이 함수를 사용하여 캡슐화를 유지합니다.
 *
 * @param value - 설정할 새 값
 */
export function setLastInputs(value: string): void {
  lastInputs = value;
}

/**
 * isConclusion 상태 변수의 값을 설정하는 함수
 * 계산 완료 상태를 변경할 때 사용합니다.
 *
 * @param value - 설정할 새 값
 */
export function setIsConclusion(value: boolean): void {
  isConclusion = value;
}
