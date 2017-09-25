/*
TypeScript是JavaScript的超集,下面就是它的基本语法,使用tsc命令编译js文件.
 */
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
function sayHello(text) {
    return 'hello' + text;
}
var user = 'Sxh';
console.log(sayHello(user));
/*原始数据类型*/
/*布尔值*/
var isDone = false; //所有声明都需要使用:定义该变量类型
/*数字类型*/
var getNumber = 131212313;
/*字符串*/
var getString = 'Shaoxiaohua';
var Ged = "ZhangwentingAi" + getString;
console.log(Ged);
/*空值 javascript没有空值（Void）的概念，可以用Void表示没有任何返回值的函数
声明一个 void 类型的变量没有什么用，因为你只能将它赋值为 undefined 和 null
*/
function alertName() {
    alert('My name is xcatliu');
}
/*null and undefined*/
var n = null;
var u = undefined;
/*任意值*/
/*任意值（Any）用来表示允许赋值为任意类型*/
var anyNumber = 'aaaaaa';
anyNumber = 7;
console.log(anyNumber.myName);
/*
未声明类型的变量

变量如果在声明的时候，未指定其类型，那么它会被识别为任意值类型：
 */
var something;
something = 'seven';
something = 7;
/*
联合类型

联合类型（Union Types）表示取值可以为多种类型中的一种。
 */
var secNum;
secNum = 'seven';
secNum = 7;
;
var Sxh = {
    name: 'Sxh',
    age: 27
};
Sxh.name = 'Zwt';
console.log(Sxh.name);
/*数组的类型*/
/*「类型 + 方括号」表示法*/
var getArr = [1, 2, 3]; // 里面只能用数字
var getArrTwo = [1, '2', 3]; //这里面可以有任意类型
/*类数组 arguments*/
function sum() {
    var arg = arguments; /*事实上常见的类数组都有自己的接口定义，如 IArguments, NodeList, HTMLCollection 等：*/
}
/*函数类型*/
/*函数声明*/
function summ(x, y) {
    return x + y;
}
console.log(summ(1, 2));
/*函数表达式*/
var mySum = function (x, y) {
    return x + y;
};
/*函数可选参数*/
function buildName(nameOne, nameTwo) {
    if (nameTwo) {
        return nameOne + '' + nameTwo;
    }
    else {
        return nameOne;
    }
}
;
console.log(buildName('sxh', 'zwt'));
console.log(buildName('sxh'));
function push(array) {
    var items = [];
    for (var _i = 1; _i < arguments.length; _i++) {
        items[_i - 1] = arguments[_i];
    }
    items.forEach(function (item) {
        array.push(item);
    });
}
var a = [];
push(a, 1, 2, 3);
console.log(a);
/*类型断言*/
function getLength(something) {
    if (something.length) {
        return something.length;
    }
    else {
        return something.toString().length;
    }
}
var lxdy = getLength('HELLO');
var lxdyn = getLength(12345);
console.log(lxdy);
console.log(lxdyn);
function getName(n) {
    if (typeof n === 'string') {
        return n;
    }
    else {
        return n();
    }
}
/*枚举 该类型用于取值被限定在一定范围内的场景，
比如一周只能有七天，颜色限定为红绿蓝等。*/
var Days;
(function (Days) {
    Days[Days["Sun"] = 0] = "Sun";
    Days[Days["Mon"] = 1] = "Mon";
    Days[Days["Tue"] = 2] = "Tue";
    Days[Days["Wed"] = 3] = "Wed";
    Days[Days["Thu"] = 4] = "Thu";
    Days[Days["Fri"] = 5] = "Fri";
    Days[Days["Sat"] = 6] = "Sat";
})(Days || (Days = {}));
;
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
var Animal = /** @class */ (function () {
    function Animal(name) {
        this.name = name;
        this.nameThree = name;
    }
    return Animal;
}());
var Cat = /** @class */ (function (_super) {
    __extends(Cat, _super);
    function Cat(nameThree) {
        var _this = _super.call(this, nameThree) || this;
        console.log(_this.nameThree);
        return _this;
    }
    return Cat;
}(Animal));
var aa = new Animal('Jack');
/*抽象类 不允许被实例化 必须由子类来实现*/
var AnimalT = /** @class */ (function () {
    function AnimalT(name) {
        this.name = name;
    }
    AnimalT.prototype.sayNum = function () {
        return 777;
    };
    return AnimalT;
}());
var CatT = /** @class */ (function (_super) {
    __extends(CatT, _super);
    function CatT() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    CatT.prototype.sayHi = function () {
        console.log("Meow, My name is " + this.name);
    };
    return CatT;
}(AnimalT));
var cat = new CatT('Tom');
console.log(cat.sayHi());
console.log(cat.sayNum());
var Door = /** @class */ (function () {
    function Door() {
    }
    return Door;
}());
var SecurityDoor = /** @class */ (function (_super) {
    __extends(SecurityDoor, _super);
    function SecurityDoor() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SecurityDoor.prototype.alert = function () {
        console.log('SecurityDoor alert');
    };
    return SecurityDoor;
}(Door));
var Car = /** @class */ (function () {
    function Car() {
    }
    Car.prototype.alert = function () {
        console.log('Car alert');
    };
    Car.prototype.lightOn = function () {
        console.log('Car light on');
    };
    Car.prototype.lightOff = function () {
        console.log('Car light off');
    };
    return Car;
}());
var Ccar = new Car();
Ccar.alert();
/*泛型*/
/*泛型（Generics）是指在定义函数、接口或类的时候，
不预先指定具体的类型，而在使用的时候再指定类型的一种特性。*/
function createArray(length, value) {
    var result = [];
    for (var i = 0; i < length; i++) {
        result[i] = value;
    }
    return result;
}
console.log(createArray(3, 'x'));
function reverse(x) {
    if (typeof x === 'number') {
        return Number(x.toString().split('').reverse().join(''));
    }
    else if (typeof x === 'string') {
        return x.split('').reverse().join('');
    }
}
