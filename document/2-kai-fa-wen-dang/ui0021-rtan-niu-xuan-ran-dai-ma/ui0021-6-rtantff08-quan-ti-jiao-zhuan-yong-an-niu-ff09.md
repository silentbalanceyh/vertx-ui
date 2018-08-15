# UI0021-6 - rtAnt（全提交专用按钮）

该按钮的调用代码为：

```js
rtAnt(reference, {
    op: "$opLogin", 
    text: button.login,
    type: "primary", 
    htmlType: "submit", 
    className: "login-form-button"
})
```

## 1.函数签名

```js
const rtAnt = (reference, metadata = {}) => {
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
    "op":"【函数注入点】"
}
```

## 3.注入点函数（二阶）

```typescript
const $opLogin = (reference:any) => (values:any) => {
    // reference为当前Form组件引用
    /**
     * values则是Ant Design在Form提交过后的数据信息
     * 1.先验证props中的form对象是否存在：Ant Design
     * 2.调用了form.validateFieldsAndScroll方法
     * 3.已同时开启了React/Redux的防重复提交
     **/
}
```

> 注入点函数限制：必须返回一个合法的Promise，如果不返回则会在日志中看到10078的错误信息！"Non Promise"

### 关于伴随连接点

在全提交函数中是支持伴随函数的，即当Promise失败的时候的后置回调函数，函数签名如下：

```typescript
const $opLoginFailure = (reference:any) => (errors:any) => {
    // 伴随连接点函数的函数名必须是绑定函数 + Failure的格式
    // errors表示远程、本地对应的错误信息
}
```

## 4.备注

备注根据按钮的属性使用表格进行记录

| 属性维度 | 说明 |
| :--- | :--- |
| 显示/隐藏 | 默认显示 |
| 防止重复提交 | $loading配置状态键，最终加载效果：reference.state\[$loading\]，从状态中读取 |
| 是否Jsx渲染 | 是 |
| 防重复提交：React模式 | 支持 |
| 防重复提交：Redux模式 | 支持 |
| 函数注入 | 支持，使用metadata.op和绑定的Op实现注入 |



