# 도은님 계산기 코드 리팩토링

이 프로젝트는 도은님이 진행한 단일 파일 계산기 코드를 모듈화하고 관심사 분리 원칙에 따라 리팩토링한 결과물입니다.

## 주요 개선 사항

### 1. 관심사 분리 (모듈화)

코드를 다음과 같이 여러 디렉토리와 파일로 분리하여 관심사별로 모듈화했습니다.

- `dom`: DOM 조작 관련 함수
- `store`: 상태 관리 관련 변수와 함수
- `handlers`: 버튼 클릭 등 사용자 액션 처리 함수
- `core`: 계산기 핵심 로직 (계산, 파싱)
- `utils`: 유틸리티 함수
- `constants`: 상수 정의

**예시**
개선 전

```typescript
// 단일 파일에 모든 기능이 혼합되어 있음
function input(number: string) {
  let inputtext: any = document.getElementById("inputnumber");
  let validChars: Array<string> = ["⨯", "−", "+", "÷"];

  // DOM 조작, 상태 관리, 로직 처리가 모두 혼합됨
  if (isconclusion === true) {
    inputtext.textContent = "";
    lastinputs = "";
    lastinput.textContent = "";

    inputtext.textContent += number;
    lastinputs += number;
    isconclusion = false;
  }
  // ...
}
```

개선 후

```typescript
// handlers/index.ts - 사용자 입력 처리만 담당
export function inputNumber(numStr: string): void {
  if (isConclusion) {
    clearDisplay(); // DOM 조작 모듈에 위임
    appendToDisplay(numStr);
    setIsConclusion(false); // 상태 관리 모듈에 위임
    return;
  }
  // ...
}

// dom/index.ts - DOM 조작만 담당
export function clearDisplay(): void {
  getInputElement().textContent = "";
  getLastInputElement().textContent = "";
  setLastInputs("");
}
```

### 2. 타입스크립트 개선

- **명시적 타입**: `any` 타입의 사용을 줄이고 더 명확한 타입을 사용했습니다.
- **변수명 개선**: `lastinputs` → `lastInputs`, `isconclusion` → `isConclusion` 등 camelCase 로 일관된 네이밍 컨벤션 적용

**예시**
개선 전

```typescript
// any 타입 과다 사용
const buttons: any = document.querySelectorAll(".number");
const delbutton: any = document.querySelector(".delbutton");
let lastinput: any = document.getElementById("lastinput");
let ops: any[] = []; // 입력된 연산자를 담을 배열

function del() {
  let inputtext: any = document.getElementById("inputnumber");
  // ...
}
```

개선 후

```typescript
// 구체적인 타입 지정
const buttons = document.querySelectorAll<HTMLButtonElement>(".number");
const delButton = document.querySelector<HTMLButtonElement>(".delbutton");
export let ops: string[] = [];

export function deleteLastDigit(): void {
  const inputElement = getInputElement();
  const textContent = inputElement.textContent || "";
  // ...
}
```

### 3. 코드 품질 개선

- **함수의 순수성**: 특히 계산 관련 함수들을 순수 함수로 변경하여 side effect를 줄였습니다.
- **에러 처리**: try-catch를 활용한 더 체계적인 에러 처리
- **코드 구조화**: 함수들을 더 작은 단위로 나누고 책임을 명확히 했습니다.

**예시**
개선 전

```typescript
// 부수 효과가 많은 계산 함수
function calculator(numbers: Array<number>, ops: Array<string>): number[] {
  while (ops.indexOf("*") !== -1 || ops.indexOf("/") !== -1) {
    // 입력 배열을 직접 수정하며 계산
    let a = numbers.splice(index, 1);
    let b = numbers.splice(index, 1);

    let newnumber: number = a[0] * b[0];
    numbers.splice(index, 0, newnumber);
    ops.splice(index, 1);
    // ...
  }
  return numbers;
}
```

개선 후

```typescript
// 순수 함수로 개선
export function processOperations(
  numbers: number[],
  ops: string[],
  targetOps: string[]
): { numbers: number[]; ops: string[] } {
  // 원본 배열을 수정하지 않고 복사본 사용
  const result = {
    numbers: [...numbers],
    ops: [...ops],
  };

  for (let i = 0; i < result.ops.length; i++) {
    if (targetOps.includes(result.ops[i])) {
      const opResult = performOperation(
        result.numbers[i],
        result.numbers[i + 1],
        result.ops[i]
      );

      result.numbers.splice(i, 2, opResult);
      result.ops.splice(i, 1);
      i--;
    }
  }

  return result;
}
```

### 4. 상태 관리 개선

- **캡슐화**: 전역 변수를 직접 조작하지 않고 setter 함수를 통해 상태를 변경하도록 개선
  - `setLastInputs()`, `setIsConclusion()` 등의 함수 추가
- **초기화 로직 개선**: `resetState()` 함수로 상태 초기화 로직 통합

**예시**
개선 전

```typescript
// 전역 변수 직접 수정
let lastinputs: string = "";
let isconclusion: boolean = false;

function result() {
  // ...
  lastinputs += "=";
  isconclusion = true;
}

function operator(operator: string) {
  // ...
  lastinputs = lastinputs.slice(0, -1) + operator;
  isconclusion = false;
}
```

개선 후

```typescript
// store/index.ts - 캡슐화된 상태 관리
export let lastInputs: string = "";
export let isConclusion: boolean = false;

export function setLastInputs(value: string): void {
  lastInputs = value;
}

export function setIsConclusion(value: boolean): void {
  isConclusion = value;
}

// handlers/index.ts - setter 함수 사용
export function calculateResult(): void {
  // ...
  setLastInputs(lastInputs + "=");
  setIsConclusion(true);
}

export function inputOperator(operator: string): void {
  // ...
  setLastInputs(lastInputs.slice(0, -1) + operator);
  setIsConclusion(false);
}
```

## 코드 흐름 정리

### 1. 초기화 과정

1. `main.ts`에서 `DOMContentLoaded` 이벤트 발생 시 `init()` 함수 호출
2. `init()` 함수에서 `initEventListeners()` 호출하여 각 버튼에 이벤트 리스너 등록
3. 각 버튼의 클릭 이벤트는 `handlers` 모듈의 적절한 함수를 호출

### 2. 숫자 입력 처리 (`inputNumber`)

1. 결론(=) 상태 확인 → 새 계산 시작 여부 결정
2. 연산자 뒤 입력인지 확인 → 입력 화면 초기화 여부 결정
3. 자릿수 제한 검사
4. DOM과 상태 모두 업데이트

### 3. 연산자 입력 처리 (`inputOperator`)

1. 유효성 검사 (숫자 입력 후인지, 연속 연산자 아닌지)
2. 결론(=) 이후 연산자 입력인 경우 특별 처리
3. 상태 업데이트 및 디스플레이 업데이트

### 4. 계산 처리 (`calculateResult`)

1. 현재 입력을 히스토리에 추가
2. 표현식 파싱 (`parseExpression`)
3. 계산 수행 (`calculate`)
   - 순서대로 연산자 처리 (\*, / 먼저, 그 다음 +, -)
4. 결과 포맷팅 및 화면 출력
5. 상태 업데이트 (결론 상태로 변경)

## 리팩토링 시 수정된 주요 부분

1. **DOM 조작과 상태 관리 분리**:

   - 기존: DOM 업데이트와 상태 업데이트가 뒤섞여 있었음
   - 개선: DOM 조작은 `dom/index.ts`에, 상태 관리는 `store/index.ts`에 분리

2. **계산 로직 개선**:

   - 기존: 복잡한 while 반복문과 배열 조작으로 구현
   - 개선: 더 선언적이고 함수형 접근으로 변경, 가독성 향상

3. **에러 처리 개선**:

   - 기존: 간단한 alert 함수만 사용
   - 개선: try-catch 블록과 더 구체적인 에러 메시지 사용

4. **타입 안전성 강화**:
   - 기존: any 타입 과도하게 사용
   - 개선: 구체적인 타입 정의와 인터페이스 활용
