### 1.说明

标准Form处理，关于此处的Form有需要说明的地方。

#### 1.1.关于Mock

ListSelector依赖Mock数据，所以这里调用了`mock(Mock)`的方法，这里的`Mock`的数据格式
如：

```js
    {
        "partner":{
            "mock":true,
            "data":{
                "list":[],
                "count":10
            }
        }
    }
```

#### 1.2.关于Linker

ListSelector中会配置Linker数据用于设置选择过后的信息，所以Form的配置中包含了下边
节点：

Linker配置如下：

```js
    "linker": {
        "name": "partner",  // 这个字段为Form本身字段名，显示内容为该字段
        "signName": "operator",
        "key": "partnerId"
    }
```

Form对应的配置如：

```js
    "hidden": {
        "inputs": [
            "operator",
            "partnerId"
        ]
    }
```


### 2.代码

```js
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op';
    import {PageCard} from 'web';
    import Mock from './mock';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Left")
        .bind(Op).mock(Mock)
        .raft(2)
        .form().to()
    )
    class Component extends React.PureComponent {
        render() {
            return (
                <PageCard reference={this}>
                    {Ux.uiFieldForm(this, {}, 2)}
                </PageCard>
            )
        }
    }

    export default Component
```