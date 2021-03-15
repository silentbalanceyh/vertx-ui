import React from 'react';
import Ux from "ux";
import Ex from 'ex';

/**
 * ## 「组件」`ExEntry`
 *
 * ```js
 * import { ExEntry } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|x|x|
 *
 * ### 2. 运行时
 *
 * > componentDidMount执行完成后。
 *
 * #### 2.1. 容器属性
 *
 * |属性名|类型|含义|
 * |:---|---|:---|
 * |$app|DataObject|应用程序基本数据。|
 * |$router|DataRouter|路由基本信息。|
 * |$collapsed|Boolean|是否展开左侧的主菜单。|
 * |fnApp|Function|关联`Ex.epicApp`函数，读取应用程序配置数据专用函数。|
 * |fnOut|Function|Redux专用函数，写状态树。|
 * |react|ReactComponent|顶层组件引用。|
 * |reference|ReactComponent|父类组件引用。|
 *
 * #### 2.1. 属性props
 *
 * |属性名|类型|含义|
 * |:---|---|:---|
 * |$options|Object|基础选项配置数据。|
 * |form|Object|Ant Form构造的专用表单变量。|
 * |rxLogin|Function|登录专用回调函数。|
 *
 * #### 2.2. 状态state
 *
 * |状态名|类型|含义|
 * |:---|---|:---|
 * |$op|Object|登录专用操作，主要会触发`$opLogin`函数。|
 * |$hoc|HocI18n|绑定好的资源文件，对应`cab/<LANG>/extension/ecosystem/ExEntry.json`资源文件。|
 * |$ready|Boolean|是否加载完成，此时已为`true`。|
 * |raft|Object|构造完成的表单配置数据`raftForm`结果。|
 *
 *
 * ### 3.核心点
 *
 * #### 3.1.关于rxLogin回调
 *
 * 标准的`$opLogin`方法执行流程如下：
 *
 * 1. `POST /oauth/login`登录系统拿到`clientSecret`密钥。
 * 2. `POST /oauth/authorize`请求申请临时授权码。
 * 3. `POST /oauth/token`使用临时授权码交换令牌`token`。
 * 4. `GET /api/user`执行用户信息读取，不同用户读取到的信息结构会有所区别。
 * 5. 将所有信息合并，然后调用`rxLogin`回调函数，该函数必须返回`Promise`，异步调用。
 * 6. 执行最终三步。
 *
 * #### 3.2.关于密码
 *
 * 在调用`/oauth/login`方法时，密码会执行`MD5`加密，发送密文到后端。
 *
 * #### 3.3.最终三步执行流程
 *
 * 1. `Ux.storeUser`将数据存储到SessionStorage中。
 * 2. `Ux.writeSubmit`方法将Redux树中的重复提交修正到false位置（提交完成）。
 * 3. `Ux.toOriginal`方法执行原始路径重定向。
 *      1. 如果有`target=xxx`则重定向到`target`中。
 *      2. 如果没有`target`参数，则直接重定向到管理主界面`Z_ENTRY_ADMIN`页中。
 *
 * > `Ux.storeUser`在整个流程中调用了两次，第一次是直接提取用户信息，第二次会将`rxLogin`以及用户数据合并到一起重写SessionStorage中存储的数据。
 *
 * @memberOf module:web-component
 * @method ExEntry
 **/
@Ux.zero(Ux.rxEtat(require('./Cab.json'))
    .cab("ExEntry")
    .form().raft(1).raft(Ex.Jsx.Login)
    .bind(Ex.Op)
    .to()
)
class Component extends React.PureComponent {
    render() {
        return Ex.yoRender(this, () =>
                Ux.aiForm(this),
            Ex.parserOfColor("ExEntry").form())
    }
}

export default Component;