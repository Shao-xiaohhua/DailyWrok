window.onload = function () {
  /*传统构造函数*/
  function Point(x, y) {
    this.x = x;
    this.y = y;
  }

  Point.prototype.toString = function () {
    return '(' + this.x + ', ' + this.y + ')';
  };

  var p = new Point(1, 2);

  Point.toString();

  console.log(p.toString())

  /*es6Class*/

  class newPoint {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }

    toString () {
      return '(' + this.x + ',' + this.y + ')'
    }
  }

  var np = new newPoint(1,2);

  console.log(np.toString());

  /*使用Object.assign可以很方便的在类上一次性添加多个方法*/

  Object.assign(newPoint.prototype, {
    getOne () {
      console.log('添加的方法！')
    },
    getTwo () {

    }
  })

  np.getOne();

  /*Class表达式立即执行函数*/

  const myClass = class me {
    getClassName() {
      return me.name;
    }
  }

  let inst = new myClass();

  console.log((inst.getClassName()));

  let aa = new class {
    constructor(props) {
      this.a = props;
    }
    getA () {
      console.log(this.a)
    }
  } ('hello word');

  aa.getA();

  /*getter,setter属性*/

  class oneClass {
    constructor () {
      this.aa = 'one'
    }

    get prop () {
      return 'getter'
    }

    set prop(value) {
      console.log('setter: '+value);
    }
  }

  let oneClas = new oneClass();
  
  console.log(oneClas.prop);

  oneClas.prop = 'aaaaaa'

  /*Class静态方法 static声明的方法直接用class类名调用不能用new构造函数调用*/

  class foo {
    static classMood () {
      return 'hello word';
    }
  }

  console.log(foo.classMood());

  /******************class的继承***********************/

  /*ES5构造函数的继承*/

  function Animal () {
    this.species = '动物';
  }

  /*一,构造函数绑定 - call or apply*/

  function Cat (name, color) {
    Animal.apply(this, arguments);
    this.name = name;
    this.color = color;
  }

  var cat = new Cat('bobo', 'yellow');

  console.log(cat.name + ',' + cat.color);

  /*二,prototype模式*/

  function extend(p, c) {
    function F () {}; //空数组
    F.prototype = p.prototype; 
    c.prototype = F.prototype;
    c.prototype.constructor = c; //防止this指向更改修改原构造函数数据
    c.uber = p.prototype; // 后门
  }

  /*ES6*/

  /*extends super关键字*/
 
  class one {
    constructor (x, y) {
      this.x = x;
      this.y = y;
    }

    toString () {
      return this.x
    }
  };

  class two extends one {
    constructor(x, y, color) {
      super(x, y); //调用父类的constructor(x, y)
      this.color = color
      this.x = x;
    }

    tocs () {
      return this.color + ',' + super.toString(); //调用父类的toString()
    }
  };
  
  let ot = new two('毛毛', 'baba', '黄色');

  console.log(ot.tocs());
}