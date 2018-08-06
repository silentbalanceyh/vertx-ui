# AI0002 - aiExprButton属性解析器

本文介绍按钮的专用语法主要用于构造工具栏，一般属性内容如下：

```json
[
    "btnApproval,  通过,  $opApproval,  primary",
    {
        "key":"btnReject",
        "text":"拒绝",
        "connectId":"$opReject",
        "type":"danger"
    }
]
```

工具栏主要有两种元素格式：`String | Object`，不同格式使用的配置模式会有所区别。String格式需要注意的是对应属性的顺序，中间使用逗号进行分割，系统会解析成一个数组，而每个索引对应的是固定值，属性之间可以加空白，以逗号为分界线，其索引值对应表如：

## 1.属性表

| 索引值 | 对应属性 | 含义 |
| :--- | :--- | :--- |
| 0 | key | Ant Design专用的React key属性，数组迭代必须。 |
| 1 | text | 按钮中对应的文本信息 |
| 2 | connectId | 必须以$开始，会调用connectId来触发另外的按钮，调用过程完成连接 |
| 3 | type | Ant Design中的Button组件的type属性 |

## 2.关于connectId

Button中的connectId参考：[UI0019 - 按钮的connect机制](/document/2-kai-fa-wen-dang/ui0019-an-niu-de-connect-ji-zhi.md)

