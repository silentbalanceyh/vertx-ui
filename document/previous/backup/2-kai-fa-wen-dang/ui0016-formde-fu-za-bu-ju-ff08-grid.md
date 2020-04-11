# UI0016 - Grid表单布局

Form的复杂布局用于设置各种不同的表单操作，主要支持四种：1列、2列、3列、4列的表单，网格式表单可用于各种不同的需求，复杂布局需要表单配合资源文件同时进行，由于Ant Design没提供自动对齐的功能，为了保证表单在Grid的环境下能够实现自动对齐，vertx-ui会针对用户表单进行基本计算。

### 1.Form基本源码说明

一般的Form为一个独立组件，位于独立文件中，内容如下：

```js
import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Form")
    .bind(Op)
    .form().to()
)
class Component extends React.PureComponent {
    render = () => Ux.uiFieldForm(this, {
        customerProxy: Ux.ai2ListSelector({})
    }, 2);
}

export default Component
```

* 上边代码中的`uiFieldForm`包含四个核心参数：
  * `reference`：当前组件的引用（很多依赖数据会从该组件中抽取）；
  * `jsx`：字段渲染自定义配置（这里的配置会优于资源文件中的默认配置）；
  * `column`：列信息，对应`1, 2, 3, 4`值，这四个值会自动计算每一列的`span`属性（Ant Design中的Row/Col）；
  * `values`：当前表单的初始化数据信息
    * 初始化数据可以来自Redux属性：`datum.record`；
    * 同样如果是父组件传入了初始值，可直接从`this.props.$inited`中拿，也对应到`Ux.rxEtat`中的`init`绑定；
    * 自定义函数执行运算（这种为常用），用户可自定义脚本计算初始值来渲染表单。
* 上边的`customerProxy`为自定义字段`customerProxy`的渲染方式，该值原始格式如下，您可以使用`Ux`中的系列`ai`方法直接渲染，如`aiInput`，`aiRadio`等。

```js
import { Input } from 'antd';
const jsx = {
    customerProxy: (reference, jsx = {}, config = {}) => {
        // 自定义渲染代码
        return <Input {...jsx}/>
    }
}
```

* 所有的`jsx`中的字段都包含了三参数函数：
  * `reference`为当前组件引用；
  * `jsx`为资源文件配置中的`optionJsx`属性相关；
  * `config`为资源文件配置中的`optionConfig`属性相关；

## 2. \_form根节点

根据vertx-ui的规则，上边的表单绑定了`UI.Form.json`的资源文件信息：[UI0013 - 页面代码结构说明](/document/previous/backup/2-kai-fa-wen-dangen-dang/ui0013-ye-mian-dai-ma-jie-gou-shuo-ming.md)，该文件的基本结构如下：

```json
    "_form": {
        "className":"page-form",
        "window":1,
        "ui": [
            [
                "title=项目信息"
            ],
            [
                {},{}
            ],
            [
                "title=基本信息"
            ],
            [
                {
                    "field":"$button",
                    "hidden":true
                }
            ]
        ],
        "rowConfig":{
        },
        "hidden": {
            "inputs": ["key","active","tenantId"]
        }
    }
```

根节点说明：

* `className`：默认的表单使用`page-form`的风格，目前主要支持三种：
  * `page-form`：Ant Design官方风格，不修饰输入框；
  * `page-ufform`：输入框全部去掉左右和上边边框，只包含下划线；
  * `page-tform`：每一个Grid的单元格包含边框，类似Word中的表格模式；
* `window`：window为当前表单的全局布局配置模式，默认为1，主控了每个单元格的宽度、高度等信息，主要用于计算布局实现对齐的功能。

* `rowConfig`：单独处理某一行的高度、宽度、特殊效果，作用于`<Row/>`标签中；

* `hidden.inputs`：当前表单中需要使用的隐藏字段（隐藏字段不占位）；

* `ui`：参考：[UI0015 - Form中的Field](/document/previous/backup/2-kai-fa-wen-dangen-dang/ui0015-formzhong-de-zi-duan-yan-zheng.md)（字段详细配置）该值可以包含三种：

  * 一维数组：单列表单，布局模式为从上往下垂直布局（登录框）
  * 二维数组：Grid标准表单，布局模式为Grid网格模式【常用】
  * 三位数组：Group分组表单，可直接在表单中实现多个页签模式（用于复杂表单布局）

## 3. 布局

`vertx-ui`中的常用表单布局可参考链接地址：[http://localhost:4000/zui/analyzer/layout](http://localhost:4000/zui/analyzer/layout)

### window = 0.5

这是两列专用布局（columns必须是2），效果如下：

![](/document/previous/backupus/backup/image/UI0016-1.png)

### window = 1

标准布局：

![](/document/previous/backupus/backup/image/UI0016-2.png)

### window = 0.15

这是左边有间距标准`9:15`的布局，标签左边修正间距占用4格（16%）：

![](/document/previous/backupus/backup/image/UI0016-3.png)

### window = 0.16

这是`0.15`的变种，主要是中间的标签可支持宽文字：

![](/document/previous/backupus/backup/image/UI0016-4.png)

> 具体配置可点开Config的面板查看。

## 4. 总结

表单本身的配置到这里告一段落，对于字段本身的具体配置参考[UI0015 - Form中的Field](/document/previous/backup/2-kai-fa-wen-dangen-dang/ui0015-formzhong-de-zi-duan-yan-zheng.md)。

