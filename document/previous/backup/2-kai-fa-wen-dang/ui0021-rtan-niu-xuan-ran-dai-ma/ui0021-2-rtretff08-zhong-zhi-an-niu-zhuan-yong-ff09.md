# UI0002-2 - rtRet（重置按钮专用）

调用该方法的代码如下：

```js
rtRet(reference, {
    type:"default",
    key:"btnReset",
    text:"重置",
    id:"$opReset",
})
```

## 1.函数签名

```js
const rtRet = (reference, metadata = {}) => {
}
```

* `reference`为当前组件引用React；
* `metadata`为配置数据；

## 2.配置说明

```json
{
    "type":"按钮类型，对应Ant Design的Button",
    "key":"当前按钮的唯一表示，React专用",
    "text":"按钮上显示的文字",
    "id":"【函数注入点】"
}
```

## 3.注入点函数（二阶）

```typescript
const $opReset = (reference:any) => (event:any) => {
    // reference为当前Form组件引用
    // event为Button的onClick中的event参数
}
```

## 4.备注

备注根据按钮的属性使用表格进行记录

| 属性维度 | 说明 |
| :--- | :--- |
| 显示/隐藏 | 默认显示 |
| 防止重复提交 | $loading配置状态键，最终加载效果：reference.state\[$loading\]，从状态中读取 |
| 是否Jsx渲染 | 是 |
| 防重复提交：React模式 | 动态key，由loading配置决定 |
| 防重复提交：Redux模式 | 不支持 |
| 函数注入 | 支持，使用metadata.id和绑定的Op实现注入 |



