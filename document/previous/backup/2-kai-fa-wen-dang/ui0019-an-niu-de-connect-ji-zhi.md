# UI0019 - 按钮的connect机制

按钮的connect机制主要用于代理按钮触发真实按钮，解决下边问题：

* Form之外的按钮点击过后要提交该Form

## 1. 图例

## ![](/document/previous/backupus/backup/image/UI0019-1.png)

## 2. Form外按钮配置

```json
{
    "_page": {
        "title": "企业信息审批",
        "left": [
            "btnApproval, 通过,   $opApproval,   primary",
            "btnReset, 重置,   $opReset,  default"
        ],
        "back": {
            "state": {
                "todos": null
            }
        }
    }
}
```

上边代码段会生成两个用户可点击的按钮，而真实的Formv是会生成：

```jsx
<Button key="$opApproval" id="$opApproval"/>
<Button key="$opReset" id="$opReset"/>
```

实际上点击保存和重置时触发的是下边隐藏区域的两个按钮的行为。

## 3. 总结

如果是在Form中本身存在于对应位置的按钮，则不需要使用connect链接机制，这种机制主要是完成截图中这种表单的动作，它的组件结构如：

![](/document/previous/backupus/backup/image/UI0019-2.png)

如上图，由于PageCard组件中包含两部分：`head`和`body`，而这两部分中，真正用户交互可见的按钮是位于`head`中，而`UI.Form`的子组件是位于`body`中的，实际上是React中两个兄弟组件进行交互，所以这样的情况下，真实按钮不能直接拿到属性中的form引用（Ant Design专用），于是使用了connect机制。用户点击的时候触发的是一个空按钮，但这个按钮会去触发真实按钮的点击事件，这个按钮在表单内部，导致表单提交触发。

