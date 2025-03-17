// dom.ts
// DOM 요소 접근 및 기본적인 화면 조작 로직
import { lastInputs, setLastInputs } from "../store/index.js";
export function getInputElement() {
    return document.getElementById("inputnumber");
}
export function getLastInputElement() {
    return document.getElementById("lastinput");
}
/**
 * 경고창 보여주는 함수
 */
export function showAlert(message) {
    alert(message);
}
/**
 * 화면 전체를 초기화(메인 숫자, 히스토리, lastInputs) 하는 함수
 */
export function clearDisplay() {
    getInputElement().textContent = "";
    getLastInputElement().textContent = "";
    setLastInputs("");
}
/**
 * 입력 화면만 지우는 함수
 */
export function clearInput() {
    getInputElement().textContent = "";
}
/**
 * 숫자나 문자열을 현재 입력 화면에 추가
 */
export function appendToDisplay(value) {
    const inputElement = getInputElement();
    if (inputElement.textContent === null) {
        inputElement.textContent = value;
    }
    else {
        inputElement.textContent += value;
    }
    // 상태 변수도 함께 업데이트 (원래 calculator.ts에서처럼)
    setLastInputs(lastInputs + value);
}
/**
 * 히스토리( lastinput )를 업데이트
 */
export function updateLastInputDisplay() {
    getLastInputElement().textContent = lastInputs;
}
