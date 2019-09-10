# JavaScript 代码规范

## 命名规则

### 变量命名

- 变量必须使用字母、下划线 `_` 或者美元符`$`开始。
- 然后可以使用任意多个英文字母、数字、下划线 `_` 或者美元符 `$` 组成。
- 不能使用 JS 关键词与保留字。
- 使用小驼峰驼峰命名。
- 推荐使用 `let const` 命名。
- 前缀最好是形容词。
- 每次只声明一个变量。

```javascript
let firstName = 'John'; // 小驼峰命名 前缀为形容词
const lastName = 'Doe';
let fullPrice = price + price * tax;
let _that = this;
let $ = jQuery;

// bad
const count = 1;
if (true) {
  count += 1;
}

// good, use the let.
let count = 1;
if (true) {
  count += 1;
}

// bad 变量在一行声明不便于阅读
let a = 1,
  b = 2,
  c = 3;
// good
let a = 1;
let b = 2;
let c = 3;

// 循环和作用域小可以用简写 i, j, k, num, str
```

### 函数名命名

- 使用小驼峰命名。

- 前缀最好是动词，可使用动词约定 如： `can has get set load` 等。

  | **动词** | **含义**                     | **返回值**                                            |
  | -------- | ---------------------------- | ----------------------------------------------------- |
  | can      | 判断是否可执行某个动作(权限) | 函数返回一个布尔值。true：可执行；false：不可执行     |
  | has      | 判断是否含有某个值           | 函数返回一个布尔值。true：含有此值；false：不含有此值 |
  | is       | 判断是否为某个值             | 函数返回一个布尔值。true：为某个值；false：不为某个值 |
  | get      | 获取某个值                   | 函数返回一个非布尔值                                  |
  | set      | 设置某个值                   | 无返回值、返回是否设置成功或者返回链式对象            |
  | load     | 加载某些数据                 | 无返回值或者返回是否加载完成的结果                    |

```javascript
// 是否可阅读
function canRead() {
  return true;
}

// 获取名称
function getName() {
  return this.name;
}
```

### 常量命名

- 命名方法：名称全部大写。
- 使用大写字母和下划线 `_` 来组合命名，下划线 `_`用以分割单词。

示例：

```javascript
let MAX_COUNT = 10;
let URL = 'http://www.baidu.com';
```

### 构造函数命名

> 介绍：在 `JS` 中，构造函数也属于函数的一种，只不过采用 `new` 运算符创建对象。

- 命名方法：大驼峰式命名法，首字母大写。
- 命名规范：前缀为名称。

```javascript
function Student(name) {
  this.name = name;
}

let st = new Student('tom');
```

## 注释的使用规则。

### 单行注释

> 说明：单行注释以两个斜线开始，以行尾结束。
> 语法：`//` 这是单行注释。

- 单独一行：`//`(双斜线)与注释文字之间保留一个空格。
- 在代码后面添加注释：`//`(双斜线)与代码之间保留一个空格，并且 `//` (双斜线)与注释文字之间保留一个空格。
- 注释代码：`//`(双斜线)与代码之间保留一个空格。

> 示例：

```javascript
// 调用了一个函数；1)单独在一行
setTitle();

let maxCount = 10; // 设置最大量；2)在代码后面注释

// setName(); // 3)注释代码
```

### 多行注释

> 说明：以 `/*` 开头，`*/` 结尾。
> 语法：`/*` 注释说明 `*/`。

- 若开始 `\*` 和结束 `*/` 都在一行，推荐采用单行注释。
- 若至少三行注释时，第一行为 `/*` ，最后行为 `*/`，其他行以 `*` 开始，并且注释文字与 `*` 保留一个空格。

```javascript
/*
 * 代码执行到这里后会调用setTitle()函数
 * setTitle()：设置title的值
 */
setTitle();
```

### 函数方法注释注释

> 说明：函数(方法)注释也是多行注释的一种，但是包含了特殊的注释要求。
> 语法：

```javascript
/**
 * 函数说明
 * @关键字
 */
```

> 常用注释关键字：(只列出一部分，并不是全部)其他常用规范……。

| 注释名   | 语法                                      | 含义                 | 示例                                         |
| -------- | ----------------------------------------- | -------------------- | -------------------------------------------- |
| @param   | @param 参数名 {参数类型} 描述信息         | 描述参数的信息       | @param name {String} 传入名称                |
| @return  | @return {返回类型} 描述信息               | 描述返回值的信息     | @return {Boolean} true:可执行;false:不可执行 |
| @author  | @author 作者信息 [附属信息：如邮箱、日期] | 描述此函数作者的信息 | @author 张三 2015/07/21                      |
| @version | @version XX.XX.XX                         | 描述此函数的版本号   | @version 1.0.3                               |
| @example | @example 示例代码                         | 演示函数的使用       | @example setTitle('测试')                    |

> 示例：

```javascript
/**
 * 合并Grid的行
 * @param {Grid} grid 需要合并的Grid
 * @param {Array} cols 需要合并列的Index(序号)数组；从0开始计数，序号也包含。
 * @param {Boolean} isAllSome 是否2个tr的cols必须完成一样才能进行合并。true：完成一样；false(默认)：不完全一样
 * @return void
 * @author polk6 2015/07/21
 * @example
 * _________________                             _________________
 * |  年龄 |  姓名 |                             |  年龄 |  姓名 |
 * -----------------      mergeCells(grid,[0])   -----------------
 * |  18   |  张三 |              =>             |       |  张三 |
 * -----------------                             -  18   ---------
 * |  18   |  王五 |                             |       |  王五 |
 * -----------------                             -----------------
 */
mergeCells(grid, cols, isAllSome) {
  // Do Something
}

```

## 语句的规则

### 缩进

- 的语句缩进 `2` 个字符

```javascript
let person = {
  firstName: 'John',
  lastName: 'Doe',
  age: 50,
  eyeColor: 'blue'
};
```

### 空格

- 上面提到的注释和对象的空格。
- 不能随意多空格和少空格。

> 这里列出部分需要空格的场景，有些上下文中都有提到。

```javascript
// Bad
const x = y + z;
// 运算符前后加空格
// Good
const x = y + z;
// 数组的`,`后面加空格
const values = ['Volvo', 'Saab', 'Fiat'];
// 对象函数的括号前加空格
let parson = { fisrtName: 'John' };
```
### 分号

- 在语句结束末尾加 `;` 。
> 语句末尾不加分号`;`，javascript解析的时候会自己判断该语句的结束语句自己加分号`;`，不加分号`;`是很危险的行为。
```javascript
// Bod
const age = 3

// Good
const antzone = "蚂蚁部落";
```
- `if、for、直接用function声明函数` 末尾不加 `;`。
> 大括号`{}`是函数声明的必须的语法元素，同时也是一个复合语句，可以用来组织语句，右侧的花括弧`}`本身就意味着复合语句的结束，所以不用添加分号`;`，如果添加分号`;`的话，就相当于重新建立了一个空语句。
```javascript
function func(){
  //code
}

for (let i = 0; i < 5; i++) {
  x += i;
}

if (foo) {
  return bar();
} else {
  something();
}
```
- 用 `var、let、const` 声明的函数后面要加 `;`。
> 此方式和声明变量原理相同，只不过变量的值是一个函数对象，这个时候就建议使用分号`;`结尾。
```javascript
var func=function(){
  //code
};
```
### 简单语句

> 这里简单语句指的是一般变量声明和简单的赋值运算。

- 一条语句通常以分号 `;` 作为结束符。

```javascript
const values = ['Volvo', 'Saab', 'Fiat'];

const person = {
  firstName: 'John',
  lastName: 'Doe',
  age: 50,
  eyeColor: 'blue'
};
```

### 复杂语句

> 复杂语句指的是函数循环判断等。

- 将左花括号 `{` 放在第一行的结尾。
- 左花括号 `{` 前添加一空格。
- 将右花括号 `}` 独立放在一行。

```javascript
// 函数
toCelsius(fahrenheit) {
  return (5 / 9) * (fahrenheit - 32);
}

// 循环
for (let i = 0; i < 5; i++) {
  x += i;
}


// 条件语句不要简写一行
// 正确的写法
if (foo) {
  return bar();
} else {
  something();
}

// 错误的写法 简写阅读性不强
if (foo) return bar();
else something();
```

### 字符串

- 字符串统一用单引号

```javascript
// bad
let name = 'Bob Parr';
// good
let name = 'Bob Parr';
// bad
let fullName = 'Bob ' + this.lastName;
// good
let fullName = 'Bob' + this.lastName;
```

- 字符串不能过长，过长推荐使用字符串连接起来。

```javascript
// bad
const errorMessage =
  'This is a super long error that was thrown because of Batman. When you stop to think about how Batman had anything to do with this, you would get nowhere fast.';

// bad
const errorMessage =
  'This is a super long error that \
was thrown because of Batman. When you stop to think about \
how Batman had anything to do with this, you would get nowhere \
fast.';

// good
const errorMessage =
  'This is a super long error that ' +
  'was thrown because of Batman.' +
  'When you stop to think about ' +
  'how Batman had anything to do ' +
  'with this, you would get nowhere ' +
  'fast.';
```

### 对象

> 对象定义的规则:

- 将左花括 `{` 号与类名放在同一行。
- 最后一个属性值对后面 `不要` 添加逗号 `,`。
- 将右花括号`}`独立放在一行，并以 `;` 分号作为结束符号

> 实例:

```javascript
let person = {
  firstName: 'John',
  lastName: 'Doe',
  age: 50,
  eyeColor: 'blue'
};
```

> 短的对象代码可以直接写成一行。
> 长的要换行（两个以上，包括两个）。

```javascript
// 长的对象
let person = {
  firstName: 'John',
  lastName: 'Doe',
  age: 50,
  eyeColor: 'blue'
};
// 短的对象
let parson = { fisrtName: 'John' };
```

## 其他规则

### 条件表达式和等号

- 合理使用 `===` 和 `!==` 以及 `==` 和 `!=`。

```javascript
// Bad 如果字符串3他们的值也相等
if (count == 3) {

}
// good
if (count === 3) {
}
```

- 合理使用表达式逻辑操作运算。

### 编列对象

> `for in` 循环将遍历对象本身的所有可枚举属性以及对象从其构造函数的原型继承的属性（更靠近原型链中对象的属性覆盖原型的属性）。
> 我们有可能遍历出并不是我们想要的属性 , 这里就要使用 `if` 加一个限制 , 只遍历对象自己的属性。
> 解决方式：

```javascript
 for( let name in Object.keys(nameList)){ ... }

```

### 箭头函数的使用

- 箭头函数适合于无复杂逻辑或者无副作用的纯函数场景下，例如：用在 `map、reduce、filter` 的回调函数定义中。

```javascript
const myArr = [
  {
    firstName: 'John',
    age: 50,
    score: 10
  },
  {
    firstName: 'mly',
    age: 50,
    score: 16
  },
  {
    firstName: 'gao',
    age: 50,
    score: 18
  }
];

const scoreArr = myArr.map(e => {
  return e.score + 10;
});

const gtArrSliu = myArr.filter(e => {
  return e.score >= 16;
});
console.log(scoreArr);
```

- 箭头函数的亮点是简洁，但在有多层函数嵌套的情况下，箭头函数反而影响了函数的作用范围的识别度，这种情况不建议使用箭头函数。
- 箭头函数要实现类似纯函数的效果，必须剔除外部状态。所以箭头函数不具备普通函数里常见的 `this、arguments` 等，当然也就不能用 `call()、apply()、bind()` 去改变 `this` 的指向。
- 箭头函数不适合定义对象的方法（对象字面量方法、对象原型方法、构造器方法），因为箭头函数没有自己的 `this`，其内部的 `this` 指向的是外层作用域的 `this`。

```javascript
const Message = text => {
  this.text = text;
};
const helloMessage = new Message('Hello World!');
```

- 箭头函数不适合定义结合动态上下文的回调函数（事件绑定函数），因为箭头函数在声明的时候会绑定静态上下文。
  ```javascript
  const button = document.querySelector('button');
  button.addEventListener('click', () => {
    this.textContent = 'Loading...';
  });
  // this 并不是指向预期的 button 元素，而是 window
  ```

### 函数使用默认值

> 最好用 es6 语法

```javascript
// Bad 这种写法name参数传入本身就是undefined 等非值的时候就会执行默认值
function createMicrobrewery(name) {
  const breweryName = name || 'Hipster Brew Co.';
  // ...
}

// Good
function createMicrobrewery(name = 'Hipster Brew Co.') {
  // ...
}
```

### 函数传参

- 如果参数超过两个，使用 `ES2015/ES6` 的解构语法，不用考虑参数的顺序。

```javascript

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});

```

### 删除弃用代码

> 很多时候有些代码已经没有用了，但担心以后会用，舍不得删。
> 如果你忘了这件事，这些代码就永远存在那里了。
> 放心删吧，你可以在代码库历史版本中找他它。(没有上传 git 的代码除外)。



# `TypeScript`代码规范

> JavaScript向TypeScript转变中，我们已经有了一套基本的javascript代码风格，而TypeScript 关注的重心是类型的匹配，而不是代码风格。在代码风格方面我们尽量是遵循JavaScript的代码风格，

## 命名规则
### type类型命名
> 类型别名用来给一个类型起个新名字。
- 类型命名采用大驼峰命名。

```typescript
type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
    if (typeof n === 'string') {
        return n;
    } else {
        return n();
    }
}
```
> 变量名、函数、常量、构造函数和js的命名规则一样, 下面是typescript的一些语法命名。
### 枚举命名
- 定义枚举, 采用大驼峰命名, 单词的首字母大写。
```javascript

const enum StateEnum {
  TO_BE_DONE = 0,
  DOING = 1,
  DONE = 2
};

```
- 枚举成员中不是常量一般也是用大驼峰命名、最后一个成员结尾不用。
```javascript

const enum Direction {
  Up,
  Down,
  Left,
  Right
};

```
### 接口的命名

- 接口命名，采用大驼峰命名，单词首字母大写。成员采用小驼峰命名。
```javascript
interface SquareConfig {
  color?: string;
  width?: number;
};
```
### class类的命名

- 类的命名, 采用大驼峰命名，单词首字母大写。成员采用小驼峰命名。
```typescript
class Animal {
  constructor(name) {
    this.name = name;
  }
  sayHi() {
    return `My name is ${this.name}`;
  }
};

```
## 注释使用规则

> 注释规则都遵循上文 `javascript` 的注释规则。

## 语句规则

### 分号

- 同JavaScript规则一样，语句结束末尾加`;`;

### 缩进

- 语句缩进两个字符。

### 空格

- 同JavaScript一样的空格规则。

## 其他规则

> 其他规则基本都遵循`JavaScript`的规则。

> 提示：以上规则JavaScript是按照eslint的写法规则，typescript是按照tslint的写法规则，在项目中一般都会配置eslint和tslint检查代码。
