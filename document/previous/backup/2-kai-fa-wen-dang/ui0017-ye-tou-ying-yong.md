# UC0001 - page/TitleCard

本章节介绍内容页的工具栏，Ant Design中的Card类型，呈现效果如下：

![](/document/previous/backupus/backup/image/UC0001-1.png)

## 1.基础代码

```jsx
import {PageCard} from 'web';

.....
@zero(
    ...
)
class Component extends React.PureComponent{
    render(){
        const {$inited, ...rest} = this.props;
        return (
            <PageCard reference={this}>
                <Form $inited={$inited.to()} {...rest}/>
            </PageCard>
        )
    }
}
```

在使用过程中，所有AI类型的托管组件基本上直接和资源文件进行绑定，然后通过`reference`传入调用组件的专用引用。

| 可支持属性 | 备注 | 默认值 |
| :--- | :--- | :--- |
| $key | 标识从资源文件的哪个根节点读取配置数据 | page |
| $card | 修改Ant Design中Card的className，可自定义呈现风格 | page-card |

## 2.资源文件

```json
{
    "_page": {
        "title": "企业信息审批",
        "left": [
            "btnApproval,通过,$opApproval",
            "btnReject,拒绝,$opReject,danger"
        ],
        "back": {
            "state": {
                "todos": null
            }
        }
    }
}
```

上述基本规则如下

* 根节点必须是`_page`，该组件直接从该节点中去解析配置文件，如果要切换根节点，则可传入`$key`属性，该属性不带下划线前缀；
* 除此之外，可传入`Card`组件专用的className，在Zero UI中默认值为`page-card`，该属性为`$card`属性。

## 3.配置说明

该组件主要是一个Card对象，参考截图，主要包含四个主要区域：**标题区、左工具栏、右工具栏、返回**，该组件主要用于设置React Router的详细页信专用信息，它的配置表如下：

| 属性 | 子属性 | 含义 | 类型 |
| :--- | :--- | :--- | :--- |
| title |  | 标题文字，可支持jsx | String \| ReactNode |
| left |  | 左边工具栏按钮 | Array |
| right |  | 右边工具栏按钮 | Array |
| back |  | 最右上角返回按钮设置 | Object |
| back | state | 返回中写入的Redux状态 | Object |

## 4.完整属性树

![](/document/previous/backupus/backup/image/UC0001-2.png)关于Button中的每一个元素的写法（Button专用语法）参考：[AI0002 - aiExprButton属性解析器](/document/previous/backup/ai0002-aiexprbuttonshu-xing-jie-xi-qi.mdi-qi.md)

