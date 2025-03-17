// handlers.ts
// 버튼 클릭 등 사용자의 액션을 처리(입력, 연산자, 삭제, 결과 등)
import { getInputElement, getLastInputElement, showAlert, clearDisplay, clearInput, appendToDisplay, updateLastInputDisplay, } from "../dom/index.js";
import { resetState, lastInputs, isConclusion, setLastInputs, setIsConclusion, } from "../store/index.js";
import { OPERATORS, ERROR_MESSAGES, MAX_DIGITS } from "../constants/index.js";
import { getLastChar, getCurrentInputDigitsCount } from "../utils/index.js";
import { parseExpression, formatResult } from "../core/parse.js";
import { calculate } from "../core/calculator.js";
export function inputNumber(numStr) {
    // 만약 이미 결론(=)이 나온 뒤라면, 새로 입력 시작
    if (isConclusion) {
        clearDisplay();
        appendToDisplay(numStr);
        // store의 isConclusion 수동 리셋
        // (다른 곳에서 isConclusion = false 처리를 해야 하지만,
        //  여기서는 간단히 전역 변수 값을 직접 변경)
        // 실제로는 setter 함수를 만들어 관리할 수도 있음
        setIsConclusion(false);
        return;
    }
    // 연산자 뒤에 바로 숫자를 입력하는 경우
    if (OPERATORS.includes(getLastChar(lastInputs))) {
        clearInput();
        appendToDisplay(numStr);
        return;
    }
    // 숫자 자릿수 제한
    const currentInputText = getInputElement().textContent || "";
    if (getCurrentInputDigitsCount(currentInputText) >= MAX_DIGITS) {
        showAlert(ERROR_MESSAGES.MAX_DIGITS);
        return;
    }
    // 기존 숫자 뒤에 붙여서 입력
    appendToDisplay(numStr);
}
export function deleteLastDigit() {
    const inputElement = getInputElement();
    const textContent = inputElement.textContent || "";
    if (textContent.length === 0) {
        showAlert(ERROR_MESSAGES.NO_DELETE);
        return;
    }
    inputElement.textContent = textContent.slice(0, -1);
    // 결론 상태가 아니고, 마지막이 연산자가 아닌 경우에만 lastInputs를 함께 수정
    if (!isConclusion && !OPERATORS.includes(getLastChar(lastInputs))) {
        setLastInputs(lastInputs.slice(0, -1));
    }
}
export function clearAll() {
    clearDisplay();
    resetState();
}
export function inputOperator(operator) {
    const inputElement = getInputElement();
    // 숫자가 입력되지 않았거나 이미 연산자가 연속으로 들어오려는 경우
    if (OPERATORS.includes(getLastChar(lastInputs)) ||
        inputElement.textContent === "") {
        showAlert(ERROR_MESSAGES.INVALID_OP);
        return;
    }
    // 마지막이 '=' 이었다면 '='를 지우고 연산자로 교체
    if (getLastChar(lastInputs) === "=") {
        setLastInputs(lastInputs.slice(0, -1) + operator);
        updateLastInputDisplay();
        setIsConclusion(false);
        return;
    }
    // 정상적인 경우
    setLastInputs(lastInputs + operator);
    updateLastInputDisplay();
}
export function calculateResult() {
    const inputElement = getInputElement();
    const lastInputElement = getLastInputElement();
    if (!inputElement.textContent)
        return;
    // 마지막 입력을 히스토리에 추가
    lastInputElement.textContent += inputElement.textContent;
    setLastInputs(lastInputs + "=");
    lastInputElement.textContent += "=";
    try {
        // 파싱 후 계산
        const { numbers: parsedNumbers, ops: parsedOps } = parseExpression(lastInputs);
        const result = calculate(parsedNumbers, parsedOps);
        if (!Number.isFinite(result)) {
            throw new Error("유효하지 않은 계산 결과입니다.");
        }
        inputElement.textContent = formatResult(result);
        setIsConclusion(true);
    }
    catch (error) {
        if (error instanceof Error) {
            showAlert(error.message);
        }
        clearAll();
    }
}
