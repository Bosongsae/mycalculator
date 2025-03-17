// index.ts
// 이벤트 리스너 초기화 및 앱 실행
// 이 파일은 계산기 애플리케이션의 진입점으로, DOM 이벤트와 핸들러를 연결합니다.

import {
  inputNumber, // 숫자 버튼 입력 처리 함수
  deleteLastDigit, // 마지막 숫자 삭제 함수
  clearAll, // 모든 입력 초기화 함수
  inputOperator, // 연산자 입력 처리 함수
  calculateResult, // 계산 결과 처리 함수
} from "./handlers/index.js";

/**
 * 모든 계산기 버튼에 대한 이벤트 리스너를 초기화하는 함수
 * 각 버튼 타입에 맞는 이벤트 핸들러를 연결합니다.
 */
function initEventListeners(): void {
  // DOM 요소 선택
  const buttons = document.querySelectorAll<HTMLButtonElement>(".number"); // 숫자 버튼들 (0-9, .)
  const delButton = document.querySelector<HTMLButtonElement>(".delbutton"); // 삭제 버튼 (DEL)
  const acButton = document.querySelector<HTMLButtonElement>(".acbutton"); // 전체 초기화 버튼 (AC)
  const operators = document.querySelectorAll<HTMLButtonElement>(".operator"); // 연산자 버튼들 (+, -, ×, ÷)
  const results = document.querySelector<HTMLButtonElement>(".result"); // 결과 버튼 (=)

  // 숫자 버튼 이벤트 리스너
  // 각 숫자 버튼 클릭 시 inputNumber 함수 호출
  buttons.forEach((element: HTMLButtonElement) => {
    element.addEventListener(
      "click",
      () => inputNumber(element.textContent || "") // 버튼의 텍스트 내용을 inputNumber 함수에 전달
    );
  });

  // 삭제 버튼 이벤트 리스너
  // 버튼이 존재할 경우에만 이벤트 리스너 등록 (null 체크)
  if (delButton) {
    delButton.addEventListener("click", deleteLastDigit);
  }

  // 전체 초기화 버튼 이벤트 리스너
  // 버튼이 존재할 경우에만 이벤트 리스너 등록 (null 체크)
  if (acButton) {
    acButton.addEventListener("click", clearAll);
  }

  // 연산자 버튼 이벤트 리스너
  // 각 연산자 버튼 클릭 시 inputOperator 함수 호출
  operators.forEach((element: HTMLButtonElement) => {
    element.addEventListener(
      "click",
      () => inputOperator(element.textContent || "") // 버튼의 텍스트(연산자 기호)를 inputOperator 함수에 전달
    );
  });

  // 결과 버튼 이벤트 리스너
  // 버튼이 존재할 경우에만 이벤트 리스너 등록 (null 체크)
  if (results) {
    results.addEventListener("click", calculateResult);
  }
}

/**
 * 애플리케이션 초기화 함수
 * DOM이 로드된 후 실행되며, 필요한 모든 초기화 작업을 수행합니다.
 */
function init(): void {
  // 이벤트 리스너 초기화
  initEventListeners();

  // 추가적인 초기화 로직이 필요하다면 여기에 구현할 수 있습니다.
  // 예: 이전 계산 기록 불러오기, 설정 적용 등
}

// DOM 콘텐츠가 완전히 로드된 후 init 함수를 실행합니다.
// 이렇게 하면 HTML 요소들이 모두 준비된 상태에서 JavaScript 코드가 실행됩니다.
document.addEventListener("DOMContentLoaded", init);
