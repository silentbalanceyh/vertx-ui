# UI0021-7 - rtDialog（遮罩窗口提交按钮）

调用代码

```js
rtDialog(reference, { bind:[
    // 必须是一个按钮的数组
    // 而且数据的每一个元素应该是一个对象
]})
```

## 1.函数签名

```js
const rtDialog = (reference, jsx = {}) => {
}
```

* `reference`为React组件引用
* `jsx`为传入的配置属性

## 2.配置说明

> bind数组会被aiExprOp解析结果，最终解析的基本结果如下

```json
{
    "key":"当前按钮的React唯一标识",
    "text":"按钮中的文字",
    "id":"绑定的key信息",
    "type":"类型"
    "submit":"位于$KV$部分的特殊属性，标识是否执行Ant Design的提交"
}
```

可在Field中支持的配置

```json
{
    "field":"$button",
    "hidden":true
    "optionJsx":{
        "bind":[
            "$opSaveItem,,,,_submit=DIRECT"
        ]
    }
}
```

## 3.连接点

```typescript
// submit === DIRECT
const $opLogin = (reference:any) => (values:any) => {
    // reference为当前Form组件引用
    /**
     * values则是Ant Design在Form提交过后的数据信息
     * 1.先验证props中的form对象是否存在：Ant Design
     * 2.调用了form.validateFieldsAndScroll方法
     * 3.已同时开启了React/Redux的防重复提交
     **/
}
// 其他
const $opDirect = (reference:any) => (event:any) => {
    // reference为当前Form组件引用
    // event为Button的onClick中的event参数
}
```

## 4.备注

备注根据按钮的属性使用表格进行记录

| 属性维度 | 说明 |
| :--- | :--- |
| 显示/隐藏 | 默认隐藏 |
| 防止重复提交 | 不支持 |
| 是否Jsx渲染 | 是 |
| 防重复提交：React模式 | 不支持 |
| 防重复提交：Redux模式 | 不支持 |
| 函数注入 | 支持，使用bind\[x\].key和绑定的Op实现注入 |



