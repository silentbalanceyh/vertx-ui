# UI0005 - 开发第一个页面

前文中开发了一个模板，那么这个章节将会让开发人员开发内置的页面组件，最后演示页面和模板组合在一起的效果。

## 1.创建页面

### 1.1.资源文件

在`src/cab/cn/`下创建登录页面需要使用的资源文件：

```shell
src/cab/cn/components/login/index/UI.json
```

该资源文件内容如：

```json
{
    "_form": {
        "ui": [
            {
                "field": "username",
                "optionConfig": {
                    "rules": [
                        {
                            "required": true,
                            "message": "请输入用户名！"
                        },
                        {
                            "min": 6,
                            "max": 16,
                            "message": "用户名长度必须在6 ~ 16字符之间"
                        }
                    ]
                },
                "optionJsx": {
                    "placeholder": "用户名"
                },
                "optionItem": {
                    "hasFeedback": true
                }
            },
            {
                "field": "password",
                "optionConfig": {
                    "rules": [
                        {
                            "required": true,
                            "message": "请输入登陆密码！"
                        },
                        {
                            "min": 8,
                            "message": "密码长度必须大于8个字符！"
                        }
                    ]
                },
                "optionJsx": {
                    "placeholder": "密码"
                },
                "optionItem": {
                    "hasFeedback": true
                }
            }
        ]
    },
    "_config":{
        "title":"一体化运维后台登录"
    }
}
```

* 资源文件的根节点使用`_`作为配置前缀；
* 这里包含了`Form`专用格式的前缀，这个将在后边的教程中讲解交互式控件时详细介绍；

### 1.2.代码文件

创建好资源文件后，就在`src/components`下创建代码文件：

```shell
src/components/login/index/Cab.json
src/components/login/index/Cab.less
src/components/login/index/UI.js
```

## 2.风格文件

`Cab.less`文件内容如下：

```css
@import "../../../global";
/** 引用全局的@app变量，不同应用的app变量不同 **/
.@{app} {
    @prefix: login;
    &-@{prefix}{
        &-row{
            display: inline-block;
            height: 60px;
            margin-top: 20px;
            width: 100%;
            input {
                height: 38px;
                padding-left: 35px;
            }
            i {
                font-size: 18px;
            }
        }
    }
}
```

这里最终生成的类名为：`ima-login-row`。

## 3.资源链接

资源链接文件`Cab.json`的内容为：

```json
{
    "ns":"components/login/index"
}
```

## 4.代码文件

```js
import "./Cab.less"
import React from 'react'
// 导入Ux包中的Ux工具，可通过run-doc.sh的脚本生成API文档
import Ux from 'ux';
import {Form, Button,Input, Icon} from "antd";
// 读取zero注解
const {zero } = Ux;
// 针对单字段的Render函数，所有函数统一参数reference, jsx
const jsx = {
    username : (reference, jsx = {}) => 
        (<Input prefix={ <Icon type="user"/> } { ...jsx } />),
    password : (reference, jsx = {}) => 
        (<Input prefix={ <Icon type="lock"/> } type="password" { ...jsx } />)
};
// zero注解的使用
@zero({
    // 标识当前组件会有一个Form，调用了antd中的Form.create封装
    form:true,
    // 资源文件名空间
    "i18n.cab":require("./Cab.json"),
    // 资源文件名，因为前边创建了UI.json的资源文件
    UIHomework.json
    // - cn是在环境变量Z_LANGUAGE中设置；
    // - components/login/index是在当前目录中的Cab.json中设置
    // - UI则是读取的文件名，文件后缀固定.json
    "i18n.name":"UI"
})
class Component extends React.PureComponent{
    render(){
        // 抽取根节点_config对象，后边会引用config.title
        const config = Ux.fromHoc(this, "config");
        // 资源目录src/cn/shared.json文件，抽取规则一致，可查看一下共享常用的配置
        const button = Ux.fromHoc(this, "button");
        // 单行界面的界面抽取，如果不适用这种方式则需要自己写Form的渲染方法
        const form = Ux.extractForm(this);
        return (
            <div>
                <h2>{config.title}</h2>
                <Form layout={"horizontal"}>
                    { form.map(item => (
                        <div {...Ux.toStyle("login-row")} key={ item.field }>
                            { Ux.jsxFieldRow(this, item, jsx[item.field]) }
                        </div>
                    )) }
                    <Button type={"primary"} htmlType={"submit"} className="login-form-button">
                        {button.login}
                    </Button>
                </Form>
            </div>
        )
    }
}

export default Component
```

上述代码文件参考注释完成代码的解析和读取。

## 5.运行

写完该程序后，直接重启服务器运行，并打开[http://localhost:4100/ima/login/index](http://localhost:4100/ima/login/index)路径可看到下边界面（验证是配置结果）：

![](/document/image/UI0005-1.png)

