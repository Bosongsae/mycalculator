// index.ts
// 이벤트 리스너 초기화 및 앱 실행
import { inputNumber, deleteLastDigit, clearAll, inputOperator, calculateResult, } from "./handlers/index.js";
function initEventListeners() {
    const buttons = document.querySelectorAll(".number");
    const delButton = document.querySelector(".delbutton");
    const acButton = document.querySelector(".acbutton");
    const operators = document.querySelectorAll(".operator");
    const results = document.querySelector(".result");
    // 숫자 버튼
    buttons.forEach((element) => {
        element.addEventListener("click", () => inputNumber(element.textContent || ""));
    });
    // 삭제 버튼
    if (delButton) {
        delButton.addEventListener("click", deleteLastDigit);
    }
    // 전체 초기화 버튼
    if (acButton) {
        acButton.addEventListener("click", clearAll);
    }
    // 연산자 버튼
    operators.forEach((element) => {
        element.addEventListener("click", () => inputOperator(element.textContent || ""));
    });
    // 결과 버튼
    if (results) {
        results.addEventListener("click", calculateResult);
    }
}
function init() {
    // 페이지가 새로 로드될 때, 기존 lastInputs를 가져와야 한다면 여기서 처리
    // (지금 구조상에는 lastinput 텍스트가 없으니 별도 작업은 없음)
    initEventListeners();
}
document.addEventListener("DOMContentLoaded", init);
