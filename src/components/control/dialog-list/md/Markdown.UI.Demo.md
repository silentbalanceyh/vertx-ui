### 1.说明

DialogList主要是子列表，一般情况下不会直接使用，通常是在Form中作为"子列表"使用，使用过程中该列表本身支持添加、删除、查询等功能。对于DialogList的入口文件`UI.Demo.js`，必须要注意以下几点：

1. **连接**：该组件必须连接`list.items`专用节点「DataObject」，该节点的结构为：`key = List`的结构。
2. **初始化**：`UI.Demo.js`需要初始化`list.items`节点，即实现`rxEditPost`函数，并且传入`CompletList`组件。
3. **来源**：在初始化`list.items`的过程中，一般数据来源于函数参数(record,id)中的record记录，后端数据一般是某个数据节点的结构为Array。

该入口的其他代码和ComplexList的入口源代码一致。

### 2.代码

```javascript
    import React from 'react'
    import Ux from "ux";
    import {Mock, Tps} from 'app';
    import {ComplexList, HelpCard} from 'web';
    import Filter from './UI.Demo.Filter';
    import FormAdd from './UI.Demo.Add';
    import FormEdit from './UI.Demo.Edit'
    import Op from './Op';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        // 该操作需要辅助子列表DialogList，并且需要传递给两个子表单
        .connect(state => Ux.dataIn(state)
            .rework({
                list: ["items"]
            })
            .rinit(["items"])
            .to()
        )
        .cab("UI.Demo")
        .search(Tps.fnDeptList)
        .to()
    )
    class Component extends React.PureComponent {

        render() {
            return (
                <HelpCard reference={this}>
                    {/** 「必须」初始化list.items实现方法rxEditPost **/ }
                    <ComplexList {...this.props}
                                 reference={this}
                                 rxEditPost={Op.opEditPost(this)}
                                 $mockData={Mock.fnDeptList}
                                 $formFilter={Filter}
                                 $formAdd={FormAdd}
                                 $formEdit={FormEdit}/>
                </HelpCard>
            )
        }
    }

    export default Component
 ```