# UI0021-4 - aiAction（自动渲染）

自动渲染为默认的表单处理过程中的渲染流程，框架支持几种不同的自动渲染模式，主要服务于Connect按钮机制。

## 1.默认

### 1.1.直接绑定

```json
[
    {
        "field":"$button",
        "hidden":true
    }
]
```

### 1.2.Norm双绑定

```json
[
    {
        "metadata": "$button",
        "hidden": true,
        "optionJsx.buttons": {
            "submit": "$opSave",
            "reset": "$opReset"
        }
    }
]
```

### 1.3.纯绑定

```jsx
[
    {
        "metadata": "$button",
        "hidden": true,
        "optionJsx.bind": [
            "$opSaveItem,,,,_submit=DIRECT"
        ]
    }
]
```

## 2.备注

* 双绑定中的`submit`自带Ant Design的提交效果，并且要返回一个Promise
* 双绑定和纯绑定中的`reset`默认带了表单重置效果
* 纯绑定中的submit=DIRECT时，会带Ant Design的提交效果（但不负责房重复提交）



