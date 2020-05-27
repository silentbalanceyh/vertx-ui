# UI0020 - 按钮提交代码

本文讲解常用的按钮提交代码如何书写，一般按钮的事件按照Zero规范使用`Op.ts`来书写。

![](/document/previous/backupus/backup/image/UI0020-1.png)

## 1.连接点

如果在PageCard中使用该按钮，必然会使用到Connect机制：[UI0019 - 按钮的connect机制](/document/previous/backup/2-kai-fa-wen-dangen-dang/ui0019-an-niu-de-connect-ji-zhi.md)，这种机制下`Op.ts`的代码有一定的规则，一般在PageCard/HelpCard中会通过`left/right`来设置连接点，如当前组件中的资源文件的配置如：

```json
{
    "_page": {
        "title": "申请待发送",
        "left": [
            "btnSend,发送给中心,$opSend,primary"
        ],
        "back": {
            "state": {
                "todos": null,
                "request.view": null
            }
        }
    }
}
```

上边代码中将会触发connect机制：

```shell
PageCard -> Button[key=btnSend] -> 连接到当前组件的子组件UI.Form中 -> Button[key=$opSend]

文件列表
src/components/todo/request-submit/UI.js                    - PageCard位于该组件
src/components/todo/request-submit/Web.Form.jsx               - $opSend按钮位于UI.Form中
src/cab/cn/components/todo/request-submit/UI.json
src/cab/cn/components/todo/request-submit/UI.Form.json
```

## 2.Form中的链接

```js
import React from 'react'
import Ux from 'ux';
import Op from './Op'; // 直接导入Op.ts入口中的所有函数，包含$opSend = function，并且是二阶函数

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Form")    // 绑定UI.Form资源文件
    .bind(Op)          // 绑定Op
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        // 这里调用Ux.ai2FormButton(Op)会直接生成按钮，只生成$打头的按钮，key/id=$opSend
        return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op)}, 1)
    }
}

export default Component
```

## 3.Button写法

详情参考注释：

```typescript
import Ux from 'ux';
import {Cv} from 'app';
import Mock from './mock';
// 该函数为一个二阶函数，reference为当前UI.Form的组件引用，由于是form，所以必定包含reference.props.form（Ant Design）
const $opSend = (reference = {}) => (event: any) => {
    event.preventDefault();
    // 【提交前开启】Connect机制下的防重复提交
    Ux.rdxSubmitting(reference);
    // Ant Design的Form提交
    Ux.runSubmit(reference, (values: any = {}) => {
        // values为当前表单的数据信息
        if (!values.hasOwnProperty("content")) {
            // 【验证失败取消】取消重复提交，这里有验证
            Ux.rdxSubmitting(reference, false);
            // 显示消息，配置于UI.Form.json中的遮罩效果
            Ux.showMessage(reference, "empty");
            return;
        }
        // 从链接中读取id：/xxx/xxx?id=value，这里的id就是value
        const id = Ux.toQueryParameter("id");
        // 构造Promise发送PUT请求
        Ux.microPut(Cv.App.Modal, "/api/request/send", {
            // id和...values合并生成Promise的请求参数
            id, ...values
           // 当前请求的Mock数据
           // Ux.showDialog同样是调用遮罩效果，显示成功的Dialog窗口
        }, Mock.$opSend).then(data => Ux.showDialog(reference, "sent", () => {
            // 由于需要跳转，需要清空相关节点
            Ux.writeTree(reference, {
                todos: null,
                "request.view": null,
                "status.submitting": {loading: false}
            });
            // 跳转到另外的页面，React-Router
            Ux.toRoute(reference, Ux.Env.ENTRY_ADMIN);
        }))
    })
};
export default {
    $opSend
}
```

UI.Form.json中的遮罩配置如（\_form的配置先别看）：

```json
{
    "_form": {
        "window": 0.16,
        "ui": [
            [
                "title=上传/提交正式申请"
            ],
            [
                "content,上传,24,,aiFileUpload"
            ],
            [
                {
                    "field": "$button",
                    "hidden": true
                }
            ]
        ]
    },
    "_modal": {
        "error": {
            "empty": "请上传审批过的正式申请书！"
        },
        "success": {
            "sent": "您的正式申请书上传成功！"
        }
    }
}
```

## 4.常用API

| API名称 | 说明 |
| :--- | :--- |
| Ux.rdxSubmitting | 启用/禁用防重复提交，和上边按钮会关联 |
| Ux.runSubmit | 提交Ant Design |
| Ux.showMessage | 根据\_modal显示消息（自动判断成功、错误） |
| Ux.showDialog | 根据\_modal显示窗口（自动判断成功、错误、提示） |
| Ux.writeTree | 写状态树 |
| Ux.toQueryParameter | 读取链接上的请求参数 |
| Ux.toRoute | 调用React-Router重定向 |



