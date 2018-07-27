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

## 2.connect

```typescript
connect(object, dispatch: boolean) {
}
```

> connect是双参
>
> * 如果是StateToProp，则第二个参数不用填写，第一个参数object则是生成state的函数：
> * 如果是DispatchToProp，则第二个参数必须是true，第一个参数则是函数映射表

## 3.op

```typescript
    op(op: any, opFun: Function) {
        if (!this._op) this._op = {};
        if (U.isFunction(opFun)) {
            this._op[op] = opFun;
        }
        return this;
    }
```

op方法是做函数绑定，等价于原始的高阶绑定操作

## 4.cab

由于构造时已经传入了名空间信息，所以新方法中cab直接传入文件名即可

```typescript
cab(cabFile) {
    this._cabFile = cabFile;
    return this;
}
```

## 5.loading

遮罩效果（略）

## 6.state

React状态注入（略）

## 7.form（可省略）

当前组件是否是一个Ant Design中的Form表单组件

## 8.logger（可省略）

日志器的设置

关于可省略的部分可参考：[UI0006 - 模板/组件规范示例](/document/ui0006-mo-677f-zu-jian-kai-fa-gui-fan.md)

