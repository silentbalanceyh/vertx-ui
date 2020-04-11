# UI0021-1 - rtLink（重定向专用按钮）

调用该方法的代码如：

```js
Ux.rtLink(this, {
    text: button.goBack, 
    uri: Ux.Env.ENTRY_LOGIN
})
```

## 1.参数签名

```js
const rtLink = (reference, metadata = {}) => {
}
```

* `reference`为当前组件引用React；
* `metadata`为配置数据；

## 2.配置说明

```json
{
    "text":"按钮上的文字信息",
    "uri":"重定向的地址信息，可包含Z_ROUTE环境变量的前缀，也可以不包含",
    "loading":"加载效果的状态键"
}
```

## 3.备注

备注根据按钮的属性使用表格进行记录

| 属性维度 | 说明 |
| :--- | :--- |
| 显示/隐藏 | 默认显示 |
| 防止重复提交 | 由传入的loading配置决定 |
| 是否Jsx渲染 | 是 |
| 防重复提交：React模式 | 动态key，由loading配置决定 |
| 防重复提交：Redux模式 | 不支持 |
| 函数注入 | 不支持 |



