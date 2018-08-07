# Ux新写法（推荐）

使用Object对象写法会导致一个问题，即Object中的键有可能拼写错误，由于不报错，会导致最终正常运行形成”逻辑“错误，所以为了避免这种错，新版的写法全部使用API模式来操作。

```js
import Ux from 'ux';
import Types from './Act.Types';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .init(Types.fnAccountAssignInited)    // 新方法，后边说明
    .connect(state => Ux.dataIn(state)
        .rework({datum: ["inited"]})
        .radial(["permission.roles"], true)
        .rinit(['inited'])
        .to()
    )
    .connect({
        fnOut: Types.fnRegistry
    },true)
    .op("hide", Ux.onHide(null, "$_show"))
    .state({
            $_show: false,
            $_dialogKey: undefined
    })
    .logger(Logger.component)
    .loading("inited", "permission.roles")
    .cab('UI')
    .to()
)
class Component extends React.PureComponent {
    // 组件内代码
}
```

## 1.构造

构造该对象使用`Ux.rxEtat`的API完成，这里必须传入`require`过后的对象，用于解析名空间。

```typescript
    private constructor(requiredFile) {
        this._cab = requiredFile;
    }
```

### 1.1.构造绑定cab

由于构造时已经传入了名空间信息，所以新方法中cab直接传入文件名即可

```typescript
cab(cabFile) {
    this._cabFile = cabFile;
    return this;
}
```

## 2.Redux方法

### 2.1. connect方法

```typescript
connect(object, dispatch: boolean) {
}
```

> connect是双参
>
> * 如果是StateToProp，则第二个参数不用填写，第一个参数object则是生成state的函数：
> * 如果是DispatchToProp，则第二个参数必须是true，第一个参数则是函数映射表

### 2.2.init/search

由于表单方法`zxInit`和`rxSearch`两个方法为固定绑定`Epic`，所以该类中提供了两个特殊的初始化特殊API执行Redux连接操作。

* `init(Function)`用于直接将`Action`绑定到`zxInit`属性（Action必须是createAction创建）；
* `search(Function)`用于直接将`Action`绑定到`rxSearch`属性（Action必须是createAction创建）；

## 3.OP专用

OP专用方法有两种：`bind`和`op`，主要将一些特殊的函数和当前组件目录中的`Op.ts`中定义的函数相绑定，最终会生成`this.state.$op`变量。

### 3.1.op

```typescript
    op(op: any, opFun: Function) {
        if (!this._op) this._op = {};
        if (U.isFunction(opFun)) {
            this._op[op] = opFun;
        }
        return this;
    }
```

op方法是做函数绑定，等价于原始的高阶绑定操作，指定`this.state.$op`中某个键`op`的值为`opFun`函数。

### 3.2.bind

```typescript
    bind(OP: any = {}) {
        if (!this._op) this._op = {};
        Object.assign(this._op, OP);
        return this;
    }
```

直接绑定`OP`对象中的所有函数信息（包括属性信息，根据规范这里只绑定函数，属性信息一般在`this.state.$op`中不会使用。）

## 4.其他

### 4.1.loading

遮罩效果（略）

### 4.2.state

React状态注入（略）

### 4.3.form（可省略）

当前组件是否是一个Ant Design中的Form表单组件，如果是Form组件该方法必须调用。

### 4.4.logger（可省略）

日志器的设置

关于可省略的部分可参考：[UI0006 - 模板/组件规范示例](/document/ui0006-mo-677f-zu-jian-kai-fa-gui-fan.md)

