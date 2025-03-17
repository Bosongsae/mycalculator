// handlers.ts
// 버튼 클릭 등 사용자의 액션을 처리(입력, 연산자, 삭제, 결과 등)
// 이 모듈은 계산기의 모든 사용자 상호작용 로직을 구현합니다.

import {
  getInputElement, // 현재 입력 요소 참조
  getLastInputElement, // 이전 입력 히스토리 요소 참조
  showAlert, // 경고창 표시
  clearDisplay, // 화면 전체 초기화
  clearInput, // 현재 입력만 초기화
  appendToDisplay, // 화면에 텍스트 추가
  updateLastInputDisplay, // 히스토리 업데이트
} from "../dom/index.js";
import {
  resetState, // 상태 초기화
  lastInputs, // 현재까지의 입력 히스토리
  isConclusion, // 계산 완료 상태 플래그
  setLastInputs, // 입력 히스토리 수정 함수
  setIsConclusion, // 계산 완료 상태 설정 함수
} from "../store/index.js";
import { OPERATORS, ERROR_MESSAGES, MAX_DIGITS } from "../constants/index.js";
import { getLastChar, getCurrentInputDigitsCount } from "../utils/index.js";
import { parseExpression, formatResult } from "../core/parse.js";
import { calculate } from "../core/calculator.js";

/**
 * 숫자 버튼 입력 처리 함수
 * 다양한 상황에 따라 숫자 입력을 다르게 처리합니다:
 * 1. 계산 완료 후 새로운 숫자 입력
 * 2. 연산자 입력 후 새로운 숫자 입력
 * 3. 기존 숫자에 이어서 입력
 *
 * @param numStr - 입력된 숫자 문자열
 */
export function inputNumber(numStr: string): void {
  // 계산 결과(=) 이후 상태라면, 새로운 계산 시작
  if (isConclusion) {
    clearDisplay(); // 화면 초기화
    appendToDisplay(numStr); // 새 숫자 추가
    setIsConclusion(false); // 결과 상태 해제
    return;
  }

  // 연산자 뒤에 바로 숫자를 입력하는 경우
  // 새로운 피연산자 시작으로 간주
  if (OPERATORS.includes(getLastChar(lastInputs))) {
    clearInput(); // 현재 입력창만 초기화
    appendToDisplay(numStr); // 새 숫자 추가
    return;
  }

  // 숫자 자릿수 제한 검사
  // 너무 많은 자릿수를 입력하면 오류 표시
  const currentInputText = getInputElement().textContent || "";
  if (getCurrentInputDigitsCount(currentInputText) >= MAX_DIGITS) {
    showAlert(ERROR_MESSAGES.MAX_DIGITS);
    return;
  }

  // 기존 숫자 뒤에 붙여서 입력
  // 일반적인 경우 - 현재 숫자 뒤에 새 숫자 추가
  appendToDisplay(numStr);
}

/**
 * 마지막으로 입력한 숫자 삭제 함수
 * 현재 입력창에서 마지막 문자를 제거합니다.
 * 결과 상태일 경우나 빈 입력일 경우 특별 처리합니다.
 */
export function deleteLastDigit(): void {
  const inputElement = getInputElement();
  const textContent = inputElement.textContent || "";

  // 삭제할 내용이 없는 경우 경고
  if (textContent.length === 0) {
    showAlert(ERROR_MESSAGES.NO_DELETE);
    return;
  }

  // 화면에서 마지막 문자 삭제
  inputElement.textContent = textContent.slice(0, -1);

  // 결론 상태가 아니고, 마지막이 연산자가 아닌 경우에만 lastInputs를 함께 수정
  // (연산자 다음 입력 상태에서는 lastInputs에는 영향 없음)
  if (!isConclusion && !OPERATORS.includes(getLastChar(lastInputs))) {
    setLastInputs(lastInputs.slice(0, -1));
  }
}

/**
 * 모든 상태 및 화면 초기화 함수 (AC 버튼)
 * 계산기를 처음 상태로 완전히 리셋합니다.
 */
export function clearAll(): void {
  clearDisplay(); // 화면 초기화
  resetState(); // 모든 상태 변수 초기화
}

/**
 * 연산자 버튼 입력 처리 함수
 * 유효성 검사 후 적절한 위치에 연산자를 추가합니다.
 *
 * @param operator - 입력된 연산자 문자열
 */
export function inputOperator(operator: string): void {
  const inputElement = getInputElement();

  // 숫자가 입력되지 않았거나 이미 연산자가 연속으로 들어오려는 경우 - 오류 처리
  if (
    OPERATORS.includes(getLastChar(lastInputs)) ||
    inputElement.textContent === ""
  ) {
    showAlert(ERROR_MESSAGES.INVALID_OP);
    return;
  }

  // 마지막이 '=' 이었다면 '='를 지우고 연산자로 교체
  // 계산 결과에 이어서 연산하는 경우
  if (getLastChar(lastInputs) === "=") {
    setLastInputs(lastInputs.slice(0, -1) + operator);
    updateLastInputDisplay();
    setIsConclusion(false);
    return;
  }

  // 정상적인 경우 - 숫자 다음에 연산자 추가
  setLastInputs(lastInputs + operator);
  updateLastInputDisplay();
}

/**
 * 계산 결과 처리 함수 (= 버튼)
 * 현재까지의 입력을 파싱하고 계산한 후 결과를 표시합니다.
 * 오류 발생 시 적절한 처리를 수행합니다.
 */
export function calculateResult(): void {
  const inputElement = getInputElement();
  const lastInputElement = getLastInputElement();

  // 입력이 없는 경우 아무것도 하지 않음
  if (!inputElement.textContent) return;

  // 마지막 입력을 히스토리에 추가하고 '=' 기호 추가
  lastInputElement.textContent += inputElement.textContent;
  setLastInputs(lastInputs + "=");
  lastInputElement.textContent += "=";

  try {
    // 표현식 파싱 후 계산 수행
    const { numbers: parsedNumbers, ops: parsedOps } =
      parseExpression(lastInputs);
    const result = calculate(parsedNumbers, parsedOps);

    // 계산 결과 유효성 검사
    if (!Number.isFinite(result)) {
      throw new Error("유효하지 않은 계산 결과입니다.");
    }

    // 결과 표시 및 상태 업데이트
    inputElement.textContent = formatResult(result);
    setIsConclusion(true);
  } catch (error) {
    // 에러 처리: 메시지 표시 및 초기화
    if (error instanceof Error) {
      showAlert(error.message);
    }
    clearAll();
  }
}
