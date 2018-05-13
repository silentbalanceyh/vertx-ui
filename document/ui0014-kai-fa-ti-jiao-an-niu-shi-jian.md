# UI0014 - 开发提交按钮

在Zero UI中，为了统一提交操作，将整体提交分为下边几个生命周期，每个生命周期分别对应提交过程中的阶段。

## 1.整体流程

![](/document/image/UI0014-1.png)

## 2.书写代码

按照Zero UI的规范，在目录中创建Op相关的TypeScript事件脚本

```shell
src/components/login/index/Op.ts
src/components/login/index/Op.Action.ts
# 登录提交的模拟数据响应
src/components/login/index/mock/rxLogin.json
```

### 2.1.UI.js

修改过后的界面代码：

```js
import "./Cab.less"
import React from 'react'
import Ux from 'ux';
import Op from './Op';
import {Form, Button,Input, Icon} from "antd";
import {RxOp} from "entity";
const {zero } = Ux;
const jsx = {
    username : (reference, jsx = {}) =>
        (<Input prefix={ <Icon type="user"/> } { ...jsx } />),
    password : (reference, jsx = {}) =>
        (<Input prefix={ <Icon type="lock"/> } type="password" { ...jsx } />)
};
@zero({
    form:true,
    "i18n.cab":require("./Cab.json"),
    "i18n.name":"UI"
})
class Component extends React.PureComponent{
    render(){
        const button = Ux.fromHoc(this, "button");
        const form = Ux.extractForm(this);
        return (
            <div>
                <h2>{Ux.fromPath(this, "config","title")}</h2>
                <Form layout={"horizontal"}>
                    { form.map(item => (
                        <div {...Ux.toStyle("login-row")} key={ item.field }>
                            { Ux.jsxFieldRow(this, item, jsx[item.field]) }
                        </div>
                    )) }
                    <Button type={"primary"} htmlType={"submit"} className="login-form-button"
                            loading={this.state.$_loading}
                            onClick={RxOp.from(this)
                                .rxLoading("$_loading")
                                .rx(Op.Login).bind()}>
                        {button.login}
                    </Button>
                    &nbsp;&nbsp;
                    <Button type={"default"} htmlType={"reset"}
                            loading={this.state.$_loading}
                            onClick={RxOp.from(this)
                                .rxSuccess(Op.Login.reset).reset()}>
                        {button.reset}
                    </Button>
                </Form>
            </div>
        )
    }
}

export default Component
```

### 2.2. Action部分

```typescript
// Op.ts
import Action from './Op.Action';
export default {
    ...Action
}
// Op.Action.ts
import Ux from 'ux';
import Mock from './mock';

const Login = {
    // 【可选】在Ant Design之后的手工认证，表单提交过程可认证
    validate: () => true;
    // 根据传入值构造promise，values为表单提交值，等价于Ant Design中form提交过后的值
    promise:(values) => {
        // 构造Promise之前对密码进行MD5加密操作
        values.password = Ux.encryptMD5(values.password);
        return Ux.ajaxPush("/login", values, Mock.rxLogin);
    },
    // values为响应数据中的data节点，如果是Mock则同样是Mock中的data节点
    success:(values, reference:any = {}) => {
        // 成功登录，将响应数据values存储到Session Storage
        Ux.storeUser(values);
        const { $router } = reference.props;
        // 读取地址栏callback，如果实现了登录控制，登录过后返回原始地址；
        const target = Ux.toQueryParameter("target");
        // 调用DataRouter中的重定向进入到管理主页（这里的管理主页可自定义）
        $router.to(target?target:Ux.Env.ENTRY_ADMIN);
    },
    // 【可选】Promise的异步返回结果
    failure:(error) => {
        // 错误分两部分
        // 提交之后，返回的error为远程服务端的Error，由于数据结构不同，所以执行不同操作；
        console.info(error);
    },
    // 【可选】仅为重置表单提供的专用重置函数
    reset:(reference:any) => {
        Ux.formReset(reference);
    }
};
export default {
    Login
}
```

### 2.3. Mock数据

```json
{
    "mock": true,
    "comment":"登录接口：/login",
    "data": {

    }
}
```

## 3.RxOp的API

最后介绍一下RxOp类的API用来绑定不同函数；

```typescript
/**
 * 初始化一个RxOp，这里的reference为React组件引用，必须包含Ant Design中的form引用
 **/
RxOp.get(reference:any);
/**
 * 【Fluent】挂载：挂载专用的validate函数
 **/ 
rxValidate(validate:Function);
/**
 * 【Fluent】挂载：挂载专用的success函数
 **/
rxSuccess(success:Function);
/**
 * 【Fluent】挂载：挂载专用的failure函数
 **/
rxFailure(failure:Function);
/**
 * 【Fluent】挂载：挂载专用的promise函数
 **/
rxPromise(promise:Function);
/**
 * 【Fluent】设置防重复提交的key，该key作为Form组件的React State进行管理
 **/
rxLoading(key:String);
/**
 * 【Fluent】挂载，用于挂载options中的四个固定key
 * {
 *     success:(values, reference) => {},
 *     failure:(error, reference) => {},
 *     promise:(values, reference) => {}, 
 *     validate:(values, reference) => true // 该函数必须返回true和false，不提供时候默认返回true
 * }
 **/
rxFull(options:any);
/**
 * 绑定提交submit专用方法，生成一个函数可直接赋值给onClick
 */
bind();
/**
 * 绑定form专用的reset方法，生成一个函数可直接赋值给onClick
 **/
reset();
```

## 4. 总结

如果不使用RxOp绑定，则可以自己实现onClick的逻辑，纯的React写法就不在这里重复。

