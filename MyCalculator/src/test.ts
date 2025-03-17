let a : string;

a = '3.3*2+5.5';
let resultsss : any[];

console.log(a.match(/\d+(\.\d+)?|[^\d]/g));

let b : string = '32+65='
b = b.slice(0, -1) + '+'
console.log(b)