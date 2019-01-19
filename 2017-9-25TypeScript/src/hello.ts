/*
TypeScript是JavaScript的超集,下面就是它的基本语法,使用tsc命令编译js文件.
 */

function sayHello (text: string) {
    return 'hello' + text;
}

let user = 'Sxh'

console.log(sayHello(user));

/*原始数据类型*/

/*布尔值*/

let isDone: boolean = false;  //所有声明都需要使用:定义该变量类型

/*数字类型*/

let getNumber: number = 131212313;

/*字符串*/

let getString: string = 'Shaoxiaohua';

let Ged: string = `ZhangwentingAi${getString}`;

console.log(Ged);

/*空值 javascript没有空值（Void）的概念，可以用Void表示没有任何返回值的函数
声明一个 void 类型的变量没有什么用，因为你只能将它赋值为 undefined 和 null
*/

function alertName(): void {
  alert('My name is xcatliu');
}


/*null and undefined*/

let n: null = null;

let u: undefined = undefined;

/*任意值*/

/*任意值（Any）用来表示允许赋值为任意类型*/

let anyNumber: any = 'aaaaaa';

anyNumber = 7;

console.log(anyNumber.myName);

/*
未声明类型的变量

变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型：
 */

let something;

something = 'seven';

something = 7;

/*
联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。
 */

let secNum: string | number;

secNum = 'seven';

secNum = 7;

/*对象的类型 -- 接口*/

interface Person {
  name: string,
  age: number,
  par?: string //可选属性
  // [propName: string]: any // 任意属性 添加此属性后定义属性和可选属性必须是它的子属性
  // readonly id: number 只能读取 不能赋值
};

let Sxh: Person = {
  name: 'Sxh',       // 上面定义几个下面就只能写几个键不能多也不能少 除了可选属性和任意属性
  age: 27
};

Sxh.name = 'Zwt';

console.log(Sxh.name);
/*数组的类型*/

/*「类型 + 方括号」表示法*/

let getArr: number[] = [1, 2, 3]; // 里面只能用数字

let getArrTwo: any[] = [1, '2', 3]; //这里面可以有任意类型

/*类数组 arguments*/

function sum () {
  let arg: IArguments = arguments;  /*事实上常见的类数组都有自己的接口定义，如 IArguments, NodeList, HTMLCollection 等：*/
}

/*函数类型*/


/*函数声明*/
function summ (x: number, y: number) {
  return x + y;
}

console.log(summ(1, 2));

/*函数表达式*/

let mySum: (x: number, y: number) => number = function (x: number, y: number): number {
  return x + y;
};

/*函数可选参数*/

function buildName (nameOne: string, nameTwo?: string) {
  if (nameTwo) {
    return nameOne + '' + nameTwo;
  } else {
    return nameOne;
  }
};

console.log(buildName('sxh', 'zwt'));

console.log(buildName('sxh'));

function push(array: any[], ...items: any[]) {
  items.forEach(function(item) {
    array.push(item);
  });
}

let a = [];
push(a, 1, 2, 3);

console.log(a);

/*类型断言*/

function getLength(something: string | number): number {
  if ((<string>something).length) {
    return (<string>something).length;
  } else {
    return something.toString().length;
  }
}

let lxdy = getLength('HELLO');
let lxdyn = getLength(12345);
console.log(lxdy);
console.log(lxdyn);

/*引入第三方库的声明文件*/

declare var jQuery: (string) => any;

/*进阶*/

/*类型别名*/

type Name = string;
type NameResolver = () => string;
type NameOrResolver = Name | NameResolver;
function getName(n: NameOrResolver): Name {
  if (typeof n === 'string') {
    return n;
  }
  else {
    return n();
  }
}

/*枚举 该类型用于取值被限定在一定范围内的场景，
比如一周只能有七天，颜色限定为红绿蓝等。*/

enum Days {Sun, Mon, Tue, Wed, Thu, Fri, Sat};

console.log(Days[0]);
console.log(Days['Sun']);

/*类*/

/*
public 修饰的属性或方法是公有的，
可以在任何地方被访问到，默认所有的属性和方法都是 public 的

private 修饰的属性或方法是私有的，
不能在声明它的类的外部访问

protected 修饰的属性或方法是受保护的，
它和 private 类似，区别是它在子类中也是允许被访问的
 */

class Animal {
  public name;
  private nameTwo; //不允许外部访问
  protected nameThree; //允许继承子类访问
  public constructor(name) {
    this.name = name;
    this.nameThree = name;
  }
}

class Cat extends Animal {   //子类继承
  constructor(nameThree) {
    super(nameThree);
    console.log(this.nameThree);
  }
}

let aa = new Animal('Jack');


/*抽象类 不允许被实例化 必须由子类来实现*/

abstract class AnimalT {
  public name;
  age: number; // 类的类型
  sayNum(): number {
    return 777;
  }
  public constructor(name) {
    this.name = name;
  }
  public abstract sayHi();
}

class CatT extends AnimalT {
  public sayHi() {
    console.log(`Meow, My name is ${this.name}`);
  }
}

let cat = new CatT('Tom');

console.log(cat.sayHi());

console.log(cat.sayNum());

/*类的接口*/

interface Alarm {
  alert();
}

interface Light {
  lightOn();
  lightOff();
}

class Door {
}

class SecurityDoor extends Door implements Alarm {
  alert() {
    console.log('SecurityDoor alert');
  }
}

class Car implements Alarm, Light {
  alert() {
    console.log('Car alert');
  }
  lightOn() {
    console.log('Car light on');
  }
  lightOff() {
    console.log('Car light off');
  }
}

let Ccar = new Car();
Ccar.alert();


/*泛型*/

/*泛型（Generics）是指在定义函数、接口或类的时候，
不预先指定具体的类型，而在使用的时候再指定类型的一种特性。*/

function createArray<T>(length: number, value: T): Array<T> {
  let result = [];
  for (let i = 0; i < length; i++) {
    result[i] = value;
  }
  return result;
}

console.log(createArray(3, 'x'));

/*声明合并*/

/*函数合并*/
function reverse(x: number): number;
function reverse(x: string): string;
function reverse(x: number | string): number | string {
  if (typeof x === 'number') {
    return Number(x.toString().split('').reverse().join(''));
  } else if (typeof x === 'string') {
    return x.split('').reverse().join('');
  }
}

/*接口合并*/

interface Alarmc {
  price: number;
  alert(s: string): string;
}
interface Alarmcc {
  weight: number;
  alert(s: string, n: number): string;
}





