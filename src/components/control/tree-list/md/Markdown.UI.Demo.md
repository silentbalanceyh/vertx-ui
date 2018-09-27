### 1.说明

树形的List的右半部分不用讲，实际上就是一个不带添加按钮的`TabList`，关于`TabList`的详细信息参考

<a href="/zui/control/tab-list" target="_blank">TabList教程</a>

#### 1.1.关于模式

左边的树的相关信息相对比较简单，只是需要清楚一些关于左边树的「编辑」模式的内容，它包含两部分

* 快速模式
* 窗口模式

「快速模式」只需要设置下边内容：

* **rxItemDelete**：删除函数
* **rxItemAdd**：添加函数
* **rxItemEdit**：编辑函数

「窗口模式」则需要额外提供两个Form组件：

* **rxItemDelete**：删除函数
* **$formTreeAdd**：添加表单组件
* **$formTreeEdit**: 编辑表单组件

#### 1.2.关于选择的树

如果要取得选择的树的节点，可直接从Redux中的`tree.selected`中取得，该节点的数据基本结构为：

```js
    {
        "key":["数组格式"],
        "data":{}
    }
```

* **key**：该值为一个数组，它表示目前选中的所有值，和`tree.filter.mode`中的设置相关「tree.filter.full=true时」
    * CHILD：该值为当前节点中所有子节点的`key`（不包含本节点）；
    * PARENT：该值为当前节点中所有父节点的`key`；
    * FULL：该值为当前节点以及所有子节点的`key`（包含本节点）；
* **data**：和当前树中绑定的`item`记录的全部信息；

#### 1.3.取值的三种方法

直接通过调用Ux中的API读取`key`，代码片段如下：

```typescript
    const keys = Ux.pipeSelected(reference);
    if (U.isArray(keys)) {
        // 主逻辑
    } else {
        Ux.showMessage(reference, "selected")
    }
```

直接使用Uson和Uarr通过Stream的模式读取：

```typescript
    Ux.microPost(Cv.App.Modal, "/api/standard-items/:key", Ux.Uson.create(record)
            .mount(reference)
            .selected("key")    // 还有一个方法为selectedData用于读取data节点中的数据
            .to()
    ).then(data => {
        // Promise之后的回调
    });
```

### 2.代码

```js
    import React from 'react'
    import Ux from "ux";
    import {Mock, Tps} from "app";
    import {PageCard, TreeList} from 'web';
    import Op from './Op';
    import Filter from "./UI.Demo.Filter";
    import FormAdd from "./UI.Demo.Form.Add";
    import FormEdit from "./UI.Demo.Form.Edit";
    import FormTreeAdd from './UI.Demo.Form.Tree.Add';
    import FormTreeEdit from './UI.Demo.Form.Tree.Edit';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .connect(state => Ux.dataIn(state)
            .rework({
                "grid": ["tree"]
            })
            .to()
        )
        .search(Tps.fnCategoryList)
        .tree(Tps.fnCategory)
        .cab("UI.Demo")
        .to()
    )
    class Component extends React.PureComponent {
        render() {
            return (
                <PageCard reference={this}>
                    <TreeList {...this.props}
                              $mockData={Mock.fnCategoryList}
                              rxAddRow={Op.opAddRow(this)}
                              rxItemDelete={Op.opItemDelete(this)}
                        // 二选一，
                        // 不使用Dialog模式则直接调函数
                        // Dialog模式就直接填写Form
                              $formTreeAdd={FormTreeAdd}
                              $formTreeEdit={FormTreeEdit}
                        // rxItemAdd={Op.opItemAdd(this)}
                        // rxItemEdit={Op.opItemEdit(this)}
                              reference={this}
                              $formFilter={Filter}
                              $formAdd={FormAdd}
                              $formEdit={FormEdit}/>
                </PageCard>
            )
        }
    }

    export default Component
```