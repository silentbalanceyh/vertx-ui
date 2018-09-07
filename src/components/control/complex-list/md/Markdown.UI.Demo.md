### 1.说明

#### 1.1.直接属性

* **$formFilter**：启用Advanced高级搜索功能时的Form React组件；
* **$formAdd**：当启用了添加功能时的添加表单Form React组件；
* **$formEdit**：编辑专用的表单Form React组件；

#### 1.2.特殊事件（Function）

* **rxInject(data)**：属性编辑面板专用函数（一般开发不使用）；
    * **data**: 传入的数据data或等待修改的options；
* **rxSet(key)**：读取当前组件`reference`中的状态中的set中某个键的值：state.set；
    * **key**：需要读取`state.set`中的数据的键

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

#### 1.3.必须事件（Function）

* **rxSearch(params)**：Epic函数，参考属性表中的内容，必须绑定搜索专用的Epic函数；
    * **params**：（参数格式参考下边的Json）

该搜索函数可以像示例一样直接调用`search(Action)`的方式直接绑定，绑定好过后会直接生成rxSearch并传递给ComplexList，它的参数`params`格式如：

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

#### 1.4.回调事件（Function）

* **rxEditPost(record,id)**：【点击"编辑"打开Tab页之后】点击列表中的"编辑"，读取了记录过后的回调函数；
    * **record**：（Object）主记录，编辑某条记录时被编辑的单条记录数据；
    * **id**：主记录的主键`id`对应的数据；
* **rxDeletePost(record,id)**：【删除某条记录之后，包括列表删除】点击删除"列表/详细"按钮过后的回调函数；
    * **record**：从删除接口远程返回的数据信息，如果保存了原始记录则是删除之前的；
    * **id**：被删除的记录的`id`对应的数据；
* **rxViewSwitch(view,id)**：【ActiveTab页发生改变之后】切换Tab页时专用的切换回调函数；
    * **view**：当前视图状态，可支持的值有：`list, add, edit`；
    * **id**：当前视图的`activeKey`，被激活的Tab页的key信息；

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