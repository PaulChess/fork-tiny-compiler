const Compiler = require('./tiny-compiler');

let sourceCode = '(add 100 (subtract 200 3000))';
// 1. 测试词素生成器
let tokens = Compiler.tokenizer(sourceCode);
// console.log(tokens);

// 2. 测试ast语法树的生成
let ast = Compiler.parser(tokens);
console.log(JSON.stringify(ast));