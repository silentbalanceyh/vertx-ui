# rapt

在看重名覆盖之前，先看看Zero中的StateIn的变量生成规则：

```js
rework({
    "datum.ext":["one","two"]
})
// 上述代码中，会从状态树（以Zero根节点为起点）中读取数据
// datum -> ext -> one：生成$one变量
// datum -> ext -> two：生成$two变量
// 后续代码中可直接使用
const { $one, $two } = this.props;
```

如果像前一个例子中的代码如：

```js
// 由于出现了2个one的子节点，所以需要执行变量转换，否则后续变量会覆盖前边需要的变量值
.rapt({
    "datum.ext": ["one"]  // 这里也会读取datum -> ext -> one中的值生成$one变量，所以存在转换
}, {
    "one": "two"
})
.rework({
    datum: ["inited"],    // 读取datum -> inited中的值生成$inited变量
    "datum.test": ["one"] // 读取datum -> test -> one中的值生成$one变量
})
```

上边代码中，从两个不同的状态树中读取数据，由于子节点的名称一致，所以会生成两个重名变量：`$one`，在这种情况下则需要调用本文中的`rapt`方法。

```typescript
rapt(mapping: any = {}, vector: any = {}): StateOut
```

### 1. 状态树说明

![](/document/backup/image/UI0009-4.png)从上边状态树可以看到，两个节点都会生成`$one`的变量，所以这个时候需要执行转换。

### 2. 转换代码

> 为了方便说明，这里贴出完整代码，并且在StateOut中转换两次

```js
@zero(Ux.rxEtat(require('./Cab.json'))
    .init(Types.fnAccountAssignInited)
    .connect(state => Ux.dataIn(state)
        .rapt({
            "datum.ext": ["one"]         // 将datum -> ext -> one的数据读取到$one变量，并且转换成$two
        }, {
            "one": "two"
        })
        .rework({
            datum: ["inited"],
            "datum.test": ["one"]        // 直接读取datum -> test -> one中的数据到$one变量
        })
        .rapt({
            "datum.test": ["one"]        // 将datum -> test -> one的数据读取到$one变量，并且转换成$three
        }, {
            "one": "three"
        })
        .radial(["permission.roles"], true)
        .rinit(['inited'])
        .to()
    )
    .loading("inited", "permission.roles")
    .cab('UI')
    .to()
)
```

### 3.代码中的使用

```js
const { $one, $two, $three } = this.props;
```

具体转换结果参考下图：

![](/document/backup/image/UI0009-4-2.png)

### 4.总结（略）



