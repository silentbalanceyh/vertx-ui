### 1.说明

由于第一部分属性同`ComplexList`，可直接进入`ComplexList`中查看详细信息：

<a href="/zui/control/complex-list" target="_blank">ComplexList教程</a>

#### 1.1.区别

`TabList`和`ComplexList`的区别如下：

1. `TabList`只能打开一个Tab页，不论是添加还是编辑，都只能单向操作；
2. `TabList`支持行内的快速添加操作，直接通过点击添加可以实现行编辑功能（注意代码中实现的排序方式）；

#### 1.2.多出来的属性

* **rxAddRow(record,id,fnClose)**：快速添加模式的行添加专用方法；
    * **record**: 当前行产生的记录信息，行提交过后的记录数据；
    * **id**：当前行在添加时产生的行主键，对应到当前视图的`activeKey`，同样是被激活的Tab页的key值；
    * **fnClose**：当前行状态从「编辑」状态恢复到「视图」状态的函数；

### 2.代码

```js
    import React from 'react'
    import Ux from "ux";
    import {Mock, Tps} from 'app';
    import {HelpCard, TabList} from 'web';
    import Filter from './UI.Demo.Filter';
    import FormAdd from './UI.Demo.Form.Add';
    import FormEdit from './UI.Demo.Form.Edit'
    import Op from './Op';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo")
        .search(Tps.fnDeptList)
        .to()
    )
    class Component extends React.PureComponent {

        render() {
            return (
                <HelpCard reference={this}>
                    <TabList {...this.props}
                             reference={this}
                             $mockData={Mock.fnDeptList}
                             rxAddRow={Op.opAddRow(this)}
                             $formFilter={Filter}
                             $formAdd={FormAdd}
                             $formEdit={FormEdit}/>
                </HelpCard>
            )
        }
    }

    export default Component
```