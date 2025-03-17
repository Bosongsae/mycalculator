// parse.ts
// 문자열 파싱(숫자/연산자 분리)과 최종 결과 포매팅
import { isNumericString } from "../utils/index.js";
/**
 * 표현식 문자열을 숫자 배열과 연산자 배열로 파싱
 */
export function parseExpression(expression) {
    const numbers = [];
    const ops = [];
    // 정규표현식으로 숫자와 연산자를 매칭
    const matches = expression.match(/\d+(\.\d+)?|[^\d=]/g) || [];
    for (const match of matches) {
        if (isNumericString(match)) {
            numbers.push(Number(match));
        }
        else if (match !== "=") {
            // UI 기호 -> JS 연산자
            if (match === "⨯")
                ops.push("*");
            else if (match === "−")
                ops.push("-");
            else if (match === "+")
                ops.push("+");
            else if (match === "÷")
                ops.push("/");
        }
    }
    return { numbers, ops };
}
/**
 * 결과를 보기 좋게 포매팅
 */
export function formatResult(value) {
    // 매우 작은 값은 0으로 처리
    if (Math.abs(value) < 1e-10)
        return "0";
    // 지수 표기해야 할 정도로 너무 크거나 작은 경우
    if (Math.abs(value) >= 1e10 || (Math.abs(value) < 1e-6 && value !== 0)) {
        return value.toExponential(5);
    }
    // 소수점 이하 최대 10자리
    return parseFloat(value.toFixed(10)).toString();
}
