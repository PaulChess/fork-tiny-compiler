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
 * ============================================================================
 *                                   (/^▽^)/
 *                                THE TOKENIZER!
 * ============================================================================
 */

/**
 * tokenizer词素生成器
 * 将源代码分解成词素数组
 *  
 * (add 2 (subtract(4 2)) => [{ type: 'paren', value: '(' }, ...]
 */
 function tokenizer(input)  {
  let tokens = [];
  let current = 0; // 光标
  while (current < input.length) {
    let char = input[current];
    // 检测词素
    // 1. 开括号
    if (char === '(') {
      tokens.push({
        type: 'paren',
        value: char
      });
      current++;
      continue;
    }
    
    // 2. 闭括号
    if (char === ')') {
      tokens.push({
        type: 'paren',
        value: char
      });
      current++;
      continue;
    }
    
    // 3. 空格
    const WHITESPACE = /\s/;
    if (WHITESPACE.test(char)) {
      current++;
      continue;
    }

    // 4. 数字
    let NUMBERS = /[0-9]/;
    if (NUMBERS.test(char)) {
      let value = '';
      while(NUMBERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({
        type: 'number',
        value
      })
      // 这里不需要再将current+1了
      continue;
    }

    // 5. 字符串, 字符串是由双引号包裹的文字内容
    // (concat "foo" "bar")
    // 从引号开始检测， 生成词素的时候要剔除引号
    if (char === '"') {
      let value = '';
      char = input[++current];
      // 直到下一个引号之前
      while (char !== '"') {
        value += char;
        char = input[++current];
      }
      char = input[++current];
      tokens.push({ type: 'string', value });
      continue;
    }

    // 6. 'name词素', 这是一个字母序列， 在lisp语法中是函数的名称
    let LETTERS = /[a-z]/i;
    if (LETTERS.test(char)) {
      let value = '';
      while (LETTERS.test(char)) {
        value += char;
        char = input[++current];
      }
      tokens.push({ type: 'name', value });
      continue;
    }

    // 如果不能匹配到任何情况， 则抛出错误并退出
    throw new TypeError('I dont know what this character is: ' + char);
  }
  return tokens;
 }
