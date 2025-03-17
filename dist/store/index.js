// store.ts
import { getLastInputElement } from "../dom/index.js";
// 전역 상태
export let numbers = [];
export let ops = [];
export let lastInputs = "";
export let isConclusion = false;
/**
 * 계산이 끝난 뒤 상태를 초기화해야 할 경우를 대비한 함수
 */
export function resetState() {
    numbers = [];
    ops = [];
    lastInputs = "";
    isConclusion = false;
}
export function updateLastInputDisplay() {
    getLastInputElement().textContent = lastInputs;
}
export function setLastInputs(value) {
    lastInputs = value;
}
export function setIsConclusion(value) {
    isConclusion = value;
}
