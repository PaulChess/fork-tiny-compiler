/**
 * 最终转换效果
 *                  LISP                      C
 *
 *  2 + 2          (add 2 2)                 add(2, 2)
 *  4 - 2          (subtract 4 2)            subtract(4, 2)
 *  2 + (4 - 2)    (add 2 (subtract 4 2))    add(2, subtract(4, 2))
 *
 */

 /**
  * 第一步. 解析
  */
 // 词法分析, 将源代码分解成词素数组
 // (add 2 (subtract 4 2))   =>   [{ type: 'paren', value: '(' }, ...]
 function tokenizer(input)  {
  return input;
 }

console.log(tokenizer('(add 2 (subtract 4 2))'));