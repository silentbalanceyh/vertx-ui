## rework

高频使用方法，一般用于读取二级节点一下的节点专用方法。

```typescript
rework(mapping: any = {}): StateOut
```

### 1. 状态树说明

![](/document/backup/image/UI0009-3.png)

### 2. 状态写入

```js
const inited = {
    ajax: (request = {}, response) => {
        const {role, tid} = request;
        const inited = {};
        if (role) {
            const roleObject = Ux.elementUnique(
                response[0] ? response[0].list : [], "code", role);
            if (roleObject) {
                inited['roleId'] = roleObject.key;
                inited['roleName'] = roleObject.name;
                inited['todoId'] = tid;
            }
        }
        return Promise.resolve(inited)
    },
    processor: data => ({
        "datum.inited": data,          // 将data数据写入datum.inited节点
        "datum.test.one": {one:"1"},   // 将data数据写入datum.test.one节点
        "datum.ext.one": {two:"2"}     // 将data数据写入datum.ext.one节点
    })
};
```

上述代码中的`datum.test.one、datum.ext.one`只是为了在这里说明专用

### 3. 状态读取

```js
@zero(Ux.rxEtat(require('./Cab.json'))
    .init(Types.fnAccountAssignInited)
    .connect(state => Ux.dataIn(state)
        // 由于出现了2个one的子节点，所以需要执行变量转换，否则后续变量会覆盖前边需要的变量值
        .rapt({
            "datum.ext": ["one"]
        }, {
            "one": "two"
        })
        .rework({
            datum: ["inited"],        // 读取datum -> inited中的值生成$inited变量
            "datum.test": ["one"]     // 读取datum -> test -> one中的值生成$one变量
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

### 4. 代码中使用

```js
const { $inited, $one } = this.props;
```

变量生成规则以子节点为主，子节点是什么名称则直接生成`$name`的变量，如上边代码中的`$inited`和`$one`，还有个特殊的是rework支持同时读取某个节点中的多个节点，如：

```js
.rework({
    "datum.test": ["one","two"]     // 读取datum -> test -> one中的值生成$one变量
                                    // 读取datum -> test -> two中的值生成$two变量
})

```

### 5. 总结（略）



