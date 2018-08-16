# UI0021-3 - rtPure（纯按钮处理）

```js
{Ux.rtPure(this, {
    onClick: () => {
        console.info("录入信息")
    }, 
    text: "文字",
    type: "default"
})}
```

## 1.函数签名

```js
const rtPure = (reference, jsx = {}) => {
}
```

* `reference`为React组件引用
* `jsx`为传入的配置属性

## 2.配置说明

```json
{
    "onClick":"注入点的函数信息",
    "text":"按钮上显示的文字",
    "type":"按钮种类，默认primary"
}
```

## 3.注入点函数

```typescript
const onClick = (event:any) => {
}
```

## 4.备注

备注根据按钮的属性使用表格进行记录

| 属性维度 | 说明 |
| :--- | :--- |
| 显示/隐藏 | 默认显示 |
| 防止重复提交 | 不支持 |
| 是否Jsx渲染 | 是 |
| 防重复提交：React模式 | 不支持 |
| 防重复提交：Redux模式 | 不支持 |
| 函数注入 | 支持，使用metadata.id和绑定的Op实现注入 |



