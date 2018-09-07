### 1.说明

#### 1.1.直接属性

* **$formFilter**：启用Advanced高级搜索功能时的Form React组件；
* **$formAdd**：当启用了添加功能时的添加表单Form React组件；
* **$formEdit**：编辑专用的表单Form React组件；

#### 1.2.固定事件（Function）

* **rxInject**：属性编辑面板专用函数（一般开发不使用）；
* **rxSet**：读取当前组件`reference`中的状态中的set：state.set；

rxInject和rxSet为特殊函数，主要用于修改传入的一些特殊属性，并且实现对ComplexList的属性修改。属性修改包含两种：

1. 修改直接传入的属性，props中的类似 $leftVisible 这种；
2. 修改特殊的Hoc中的`options`配置选项信息

这两个函数目前的版本是提供给属性调整器使用，在vertx-ui中可直接针对已经配置好的ComplexList实现属性调整，两个函数的函数签名分别为：

```javascript
/**
 * 1. data为传入的属性props数据；
 * 2. data为Hoc中的options数据；
 **/
const rxInject = (data = {}) => {
}
/**
 * key为需要从传入的属性中读取的状态中的键，该函数用于在
 * ComplexList内部读取已经变化过的属性props或Hoc中的选项options专用
 **/
const rxSet = (key = "") => {
}
```

* **rxSearch**：Epic函数，参考属性表中的内容，必须绑定搜索专用的Epic函数；

该搜索函数可以像示例一样直接调用`search(Action)`的方式直接绑定，绑定好过后会直接生成rxSearch并传递给ComplexList，它的参数格式如：

```javascript
{
    "pager":{
        "page":1,
        "size":10
    },
    "sorter":[
        "updateTime,ASC",
        "createTime,DESC"
    ],
    "projection":[],
    "criteria":{
    }
}
```

* `pager`：分页参数，包含当前页（page）和每一页的条数（size），page从1开始；
* `sorter`：排序参数，包含第一排序字段、第二排序字段、依次类推；
* `projection`：列过滤参数，哪些列不需要呈现的，直接设置在该参数中；
* `criteria`：查询参数，支持查询语法树；

> Mock环境使用的是客户端分页，正常环境或生产环境这里需要使用的是服务端分页（Zero和Spring Up本身是支持这里的查询树的）。

#### 1.3.参数事件（Function）

* `rxEditPost`：点击列表中的"编辑"，读取了记录过后的回调函数；
* `rxDeletePost`：点击删除"列表/详细"按钮过后的回调函数；
* `rxViewSwitch`：切换Tab页时专用的切换回调函数；

### 2.代码

```javascript
    import React from 'react'
    import Ux from "ux";
    import {Mock, Tps} from 'app';
    import {ComplexList, HelpCard} from 'web';
    import Filter from './UI.Demo.Filter';
    import FormAdd from './UI.Demo.Form.Add';
    import FormEdit from './UI.Demo.Form.Update'

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo")
        // 快速绑定专用方法，直接调用search并且绑定到一个Epic函数中生成rxSearch
        .search(Tps.fnDeptList)
        .to()
    )
    class Component extends React.PureComponent {

        render() {
            /**
             * 有一点需要说明，如果上层传入了this.props.reference，在往ComplexList
             * 中传入reference时，Jsx里会直接被reference={this}覆盖掉导致当前组件
             * 的父组件引用无法被传入，而ComplexList中的this.props.reference会指向
             * 当前组件。
             **/
            return (
                <HelpCard reference={this}>
                    <ComplexList {...this.props}
                                 reference={this}
                                 /**
                                  * Mock环境专用，传入模拟数据（数据本身为一个List），
                                  * 所有客户端行为根据该数据生成
                                  **/
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