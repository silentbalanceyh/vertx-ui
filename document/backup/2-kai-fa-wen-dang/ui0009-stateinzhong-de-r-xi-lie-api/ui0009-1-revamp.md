## revamp

该API为根节点专用，在调用过程中可直接读取状态树上的数据。

```typescript
revamp(keys: Array<String> = []): StateOut
```

### 1. 状态树说明

### ![](/document/backup/image/UI0009-1.png)

### 2.状态写入

写入过程的代码：

```js
    "app": {
        ajax: () => {
            const app = Ux.isInit();
            if (0 < Object.keys(app).length) {
                return Promise.resolve(app);
            } else {
                return Ux.microFetch(Cv['MBCloud'].Environment, "/apps/:name", 
                    {name: Ux['Env']['APP']}, Mock.fnApp);
            }
        },
        processor: data => ({app: Ux.storeApp(data)}), // 这里是最终设置写入到状态树的节点数据
    },
```

从上述代码中的`processor`中的内容可以知道，最终写入的是一个Object对象：

```json
{
    "app": Ux.storeApp(data)
}
```

### 3.状态读取

在@zero注解中，读取该变量的代码如下：

```js
@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI")
    .connect(state => Ux.dataIn(state)
        .revamp(["user", "app", "menus"])    // 读取user, app, menus节点的数据
        .rinit(["app"])
        .to()
    )
    .connect({
        fnApp: Types.fnAppInited,
        fnOut: Ux.fnOut
    }, true)
    .loading("app", "menus")
    .state({
        $_collapsed: true
    })
    .op("collapse", Op.fnCollapse)
    .to()
)
```

### 4.代码中使用

```js
const { $user, $app, $menus } = this.props;
```

### 5.总结

实际上revamp主要是读取一级节点的数据，由于Zero中支持多级路径读取写入，所以revamp主要就是用于一级路径读取。

