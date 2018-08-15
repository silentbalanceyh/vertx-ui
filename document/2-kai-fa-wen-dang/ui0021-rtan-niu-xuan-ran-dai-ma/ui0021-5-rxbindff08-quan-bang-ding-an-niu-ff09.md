## UI0021-5 - rtBind（全绑定函数）

全绑定函数的基本思路和其他的一致，唯一的区别在于传入的`$op`变量中所有的函数都会被绑定，这里提供绑定函数对应的内置代码：

```js
Object.keys($op).filter(key => !!key).filter(key => U.isFunction($op[key]))
        .map(key => <Button id={key} key={key}
                            onClick={$op[key](reference)}
                            className={show ? "" : "ux-hidden"}/>);
```

## 备注

备注根据按钮的属性使用表格进行记录

| 属性维度 | 说明 |
| :--- | :--- |
| 显示/隐藏 | 默认隐藏 |
| 防止重复提交 | 不支持 |
| 是否Jsx渲染 | 是 |
| 防重复提交：React模式 | 不支持 |
| 防重复提交：Redux模式 | 不支持 |
| 函数注入 | state.$op中全绑定 |



