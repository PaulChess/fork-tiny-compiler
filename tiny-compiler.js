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
 * 解析阶段1: 词法分析
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

/**
 * ============================================================================
 *                                 ヽ/❀o ل͜ o\ﾉ
 *                                THE PARSER!!!
 * ============================================================================
 */

/**
 * 解析阶段2: 语法分析
 * 接收词素数组 => AST抽象语法树
 *   {
 *     type: 'Program',
 *     body: [{
 *       type: 'CallExpression',
 *       name: 'add',
 *       params: [{
 *         type: 'NumberLiteral',
 *         value: '2',
 *       }, {
 *         type: 'CallExpression',
 *         name: 'subtract',
 *         params: [{
 *           type: 'NumberLiteral',
 *           value: '4',
 *         }, {
 *           type: 'NumberLiteral',
 *           value: '2',
 *         }]
 *       }]
 *     }]
 *   }
 * 
 *  遇到调用的话: type: 'CallExpression', name: 'xx', params: [xx]
 *  遇到计算的话: type: 'NumberLiteral', value: 'xx'
 *  [{ type: 'paren', value: '(' }, ...]   =>   { type: 'Program', body: [...] }
 */
function parser(tokens) {
  let current = 0;

  function walk() {
    // 获取当前词素
    let token = tokens[current];
    // 针对不同的词素进行不同的处理
    // 1. 数字词素
    if (token.type === 'number') {
      current++; // 指针移到下一个词素
      // 返回的就相当于是一个node节点
      return {
        type: 'NumberLiteral',
        value: token.value,
      }
    }

    // 2. 字符串词素
    if (token.type === 'string') {
      current++;
      return {
        type: 'StringLiteral',
        value: token.value,
      }
    }

    // 3. 判断是否为函数调用
    // 遇到开括号
    if (token.type === 'paren' && token.value === '(') {
      // 跳过开括号来到下一个词素
      token = tokens[++current];
      // 遇到开括号就要生成节点
      let node = {
        type: 'CallExpression',
        name: token.value,
        params: [],
      };

      // 再一次跳过函数名的词素
      token = tokens[++current];
      
      // 非闭括号
      while (token.type !== 'paren' || (token.type === 'paren' && token.value !== ')')) {
        node.params.push(walk());
        token = tokens[current];
      }

      // 跳过闭括号
      current++;

      // 返回节点
      return node;
    }
    throw new TypeError(token.type);
  }

  let ast = {
    type: 'Program',
    body: [],
  };


  // walk是对每一个词素进行处理， 当指针移到下一个词素的时候就回到这里来执行一下walk
  while (current < tokens.length) {
    ast.body.push(walk());
  }
  
  return ast;
}

module.exports = {
  tokenizer,
  parser,
}