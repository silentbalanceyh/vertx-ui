# UI0015 - Form中的Field

本文主要补充[UI0016 - Grid表单布局](/document/2-kai-fa-wen-dang/ui0016-formde-fu-za-bu-ju-ff08-grid.md)中没有讲完的`_form.ui`的相关配置信息（针对每一个单元格）

## 1. 配置说明

表单中的字段主要包含三大类型（类似FieldSet标题、字段、按钮），大原则：

* 如果field为`$`开头如`$button`则需要自己提供`jsx`的render完成完整配置。

### 1.1.标题配置

```json
ui: [
    [
        {
            "field":"areaKey",
            "title":"这是标题"
        }
    ]
]
```

标题配置仅支持一个数组中包含一个元素的情况，该元素包含`field`属性、`title`属性用于判断当前内容是否标题行，包含了`title`视为标题行，则不再配置其他字段。

### 1.2.按钮

按钮配置主要配置该按钮是隐藏还是显示，隐藏主要用于Connect模式：[UI0019 - 按钮的connect机制](/document/2-kai-fa-wen-dang/ui0019-an-niu-de-connect-ji-zhi.md)，默认显示。

```json
ui: [
    [
        {
            "field":"$button",
            "hidden":true
        }
    ]
]
```

### 1.3.标准字段

标准字段在一个数组中最多配4个，并且要在`column=4`的场景才生效，您设置的列会控制字段的显示隐藏

```json
ui:[
    [
        {
            "field": "contactMobile",
            "optionConfig": {
                "normalize": "number,15",
                "rules": [
                    {
                        "required": true,
                        "message": "请输入手机！"
                    }
                    ]
                },
            "optionItem": {
                "label": "手机"
            }
        },
        {
            // ....（第二个）   
        }
    ]
]
```

标准字段根节点属性表如下：

| 属性 | 含义 | 默认 |
| :--- | :--- | :--- |
| field | 字段名称，提交时候的Json字段名 | 无（必须配置） |
| span | 当前字段占的列宽度，对应Ant Design中的Grid布局 | 根据设置的column来定义，最终值为：24 / column，分别是：24，12，8，6。 |
| optionItem | 对应到Ant Design中的&lt;Form.Item&gt;配置，用于配置标签相关信息 | 所有Ant Design中的Form.Item中的属性都生效。 |
| optionJsx | 对应到组件内部配置，如&lt;Input&gt;中的配置则 | 所有Ant Design中的控件属性都生效 |
| optionJsx.config | 特殊配置 | 用于vertx-ui中的AI分析专用特殊配置，扩展自定义组件时必须，包括书写自己的自定义组件时用于扩展的专用配置 |
| optionConfig | 应用于Ant Design中的Form函数：getFieldDecorator的第二参数，控制验证、输入限制等。 | 无 |
| render | 默认渲染模式 | aiInput |

> 上述配置中的`optionJsx`和`optionConfig`会作为表单的`jsx`的render方法中的第二参和第三参数。

```js
const jsx = {
    username: (reference, jsx = {}, config = {}) => (<Input {...jsx/>)
}
```

## 2. 高级用法

* field支持纯表达式的字符串模式，这种模式会启用属性解析器。
* field支持`metadata`多路径树模式。
* 1中的配置模式为基础模式，唯一的缺点就是配置的Json代码量比较大。
* 关于高级用法中的内容参考：[AI0003 - aiExprField属性解析器](/document/ai0003-aiexprfieldshu-xing-jie-xi-qi.md)



