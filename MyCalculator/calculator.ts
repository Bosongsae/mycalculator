// 버튼 입력 요소 추가
const buttons: any = document.querySelectorAll(".number");
const delbutton: any = document.querySelector(".delbutton");
const acbutton: any = document.querySelector(".acbutton");
const operators: any = document.querySelectorAll(".operator");
const results: any = document.querySelector(".result");
let lastinput: any = document.getElementById("lastinput");
let lastinputs: string = "";
let isconclusion : boolean = false;    // result 입력 후인지 판단하는 변수 기본 : false, result 입력후 : true
let numbers: number[] = [];            // 입력된 숫자를 담을 배열
let ops: any[] = [];                   // 입력된 연산자를 담을 배열
lastinputs = lastinput.textContent     // 마지막까지 입력한 내역 

// 경고창 만들기
function numAlert() {
  alert("숫자는 4자리까지만 가능합니다.")
}
function opAlert() {
  alert("숫자를 먼저 입력한 후에 연산자를 눌러주세요.")
}
function delAlert() {
  alert("더 이상 지울 숫자가 없습니다.")
}

// 숫자 입력 함수 
function input(number: string) {
  let inputtext: any = document.getElementById("inputnumber");
  let validChars : Array<string> = ["⨯", "−", "+", "÷"];
  
  // 마지막에 result로 끝난 경우 모든 내역을 지우고 input에 number 추가
  if (isconclusion === true) {
    inputtext.textContent = "";
    lastinputs = "";
    lastinput.textContent = "";
        
    inputtext.textContent += number;
    lastinputs += number;
    isconclusion = false
  }
  // lastinputs이 연산자로 끝날 경우 input 부분을 지우고 number 추가 (새 숫자)
  else if (validChars.includes(lastinputs.slice(-1))) { 
    console.log("숫자 추가 전", lastinputs)
    inputtext.textContent = "";
    inputtext.textContent += number;
    lastinputs += number;
    console.log("숫자 추가 후", lastinputs)
  } 
  // 숫자 다음에 숫자를 입력하는 경우 지우는 요소 없이 number 추가 (기존숫자 자리수 증가)
  else {
    if (inputtext.textContent.replace(/\./g, "").length > 3) {
      numAlert()
    } else {
    inputtext.textContent += number;
    lastinputs += number;
  }
}
}
// 지우기 함수 (숫자인 경우만 지움)
function del() {
  let inputtext: any = document.getElementById("inputnumber");
  if (inputtext.textContent.length === 0) {
    delAlert()
  } else {
  inputtext.textContent = inputtext.textContent.slice(0, -1);
  }
}

// 전체 지우기 함수 (AC버튼 클릭시)
function clearstr() {
  let inputtext: any = document.getElementById("inputnumber");
  let lastinput: any = document.getElementById("lastinput");
  inputtext.textContent = "";
  lastinput.textContent = "";
  lastinputs = "";
  numbers = [];
  ops = [];
}

// 연산자 추가 함수 
function operator(operator: string) {
  let inputtext: any = document.getElementById("inputnumber");
  let lastinput: any = document.getElementById("lastinput");
  let validChars : Array<string> = ["⨯", "−", "+", "÷"];

  if (validChars.includes(lastinputs.slice(-1)) || inputtext.textContent === "" ) {
    opAlert() } 
  // 마지막이 '='으로 끝났는데 연산자로 바꿀경우 
  else if (lastinputs.slice(-1) === '=') {
      lastinputs = lastinputs.slice(0, -1) + operator;
      console.log("=에서 연산자로 바꾼 후", lastinputs)
      lastinput.textContent = lastinputs;
      isconclusion = false;
    }
    else {      
      lastinputs += operator;
      lastinput.textContent = lastinputs;
  
}
}
// 문자가 숫자를 포함하는지 확인하는 함수 (입력된 문자를 분해한 후 사용)
function isNumericString(value: string) {
  return /^-?\d+(\.\d+)?$/.test(value);
}

// 입력된 문자를 분해하여 숫자와 연산자로 구분하여 저장 
// *, -, / 의 경우, html에서 작게보이는 것을 방지하기 위해 이모지를 사용 했기 때문에 키보드상의 문자로 변환
function matchs(lastinputs: string) {  
  let matcha = lastinputs.match(/\d+(\.\d+)?|[^\d]/g);

  if (matcha) {
    for (let i of matcha) {
      if (isNumericString(i) === true) {
        numbers.push(Number(i));
      } else {
        if (i === "⨯") {
          ops.push("*");
        } else if (i === "−") {
          ops.push("-");
        } else if (i === "+") {
          ops.push("+");
        } else if (i === "÷") {
          ops.push("/");
        }
      }
    }
  } 
}

// 계산 함수 
// 분리된 numbers와 ops를 받아 ops에 *, / 가 있는 경우 먼저 계산 하고 이후에 +, - 계산으로 넘어감 
function calculator(numbers : Array<number>, ops : Array<string>) : number[] {
    while (ops.indexOf("*") !== -1 || ops.indexOf("/") !== -1) {      
      let countOps = ops.filter(op => op === '*' || op === '/').length;
      for (let i=0; i < countOps; i++) {
          let indexes = [ops.indexOf("*"), ops.indexOf("/")].filter(index => index !== -1);
          let index = indexes.length > 0 ? Math.min(...indexes) : -1; // 빈 배열 방지          
          
          let a = numbers.splice(index, 1);
          let b = numbers.splice(index, 1);
          
          if (ops[index] === "*") {            
            let newnumber : number = a[0] * b[0];
            numbers.splice(index, 0, newnumber);
            ops.splice(index, 1);}
          else {             
            let newnumber : number = a[0] / b[0];
            numbers.splice(index, 0, newnumber);
            ops.splice(index, 1);
        }
      }
    }
    while (ops.indexOf("+") !== -1 || ops.indexOf("-") !== -1) {      
      let countOps = ops.filter(op => op === '+' || op === '-').length;
      for (let i=0; i < countOps; i++) {
        let indexes = [ops.indexOf("+"), ops.indexOf("-")].filter(index => index !== -1);
        let index = indexes.length > 0 ? Math.min(...indexes) : -1; // 빈 배열 방지   
          let a = numbers.splice(index, 1);
          let b = numbers.splice(index, 1);          
          
          if (ops[index] === "+") {            
            let newnumber : number = a[0] + b[0];            
            numbers.splice(index, 0, newnumber);
            ops.splice(index, 1);}
          else {             
            let newnumber : number = a[0] - b[0];
            numbers.splice(index, 0, newnumber);
            ops.splice(index, 1);
        }
      }
    }
    return numbers; 
}

// '=' 버튼을 눌렀을 때 작동할 함수, 문자 분해함수(matchs)와 계산함수(calculator) 포함
// 결과가 나온 후에는 inputtext 창에 나올 결과숫자 빼고 나머지는 지움 
function result() {
  let inputtext: any = document.getElementById("inputnumber");
  let lastinput: any = document.getElementById("lastinput");
  lastinput.textContent += inputtext.textContent  
  console.log("matchs 넣기 전", lastinputs)
  matchs(lastinputs);
  let result = calculator(numbers, ops); // calculator 호출
  
  lastinput.textContent += "=";
  lastinputs += "=";
  console.log("결과 나온 후 = 추가", lastinputs)
  inputtext.textContent = result;
  numbers = [];
  ops = [];
  isconclusion = true;  
}

// 버튼 클릭시 동작 구현
buttons.forEach((element: any) => {
  element.addEventListener("click", () => input(element.textContent));
});
delbutton.addEventListener("click", () => del());
acbutton.addEventListener("click", () => clearstr());
operators.forEach((element: any) => {
  element.addEventListener("click", () => operator(element.textContent));
});

results.addEventListener("click", () => result());
