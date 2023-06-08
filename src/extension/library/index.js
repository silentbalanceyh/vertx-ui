import Ux from 'ux';
import Types from './Types';
// 直接函数和类定义
import I from './interface.ajax';
import ox from './interface.ox';
import wf from './entry.workflow';
import Channel from './entry.channel';
import Evt from './entry.event';
import Fad from './entry.facade';
import Fas from './entry.fashion';
import Fun from './entry.func';

import Pro from './interface.zei';

const exported = {
    ...Pro,
    // channel 目录
    ...Channel,
    // event 目录
    ...Evt,
    // facade 目录
    /*
     * -- web.js
     */
    ...Fad,
    // fashion 目录
    /*
     * -- op.js
     * -- romantic.js
     */
    ...Fas,
    // functions 目录
    ...Fun,

    // 高阶组件专用, Redux-Epic
    ...Types,

    // 特殊类：远程ajax专用类
    I,
    // 特殊类：@ox注解专用类
    ox,
    // 特殊类：工作流专用
    wf,
};
/**
 * @typedef JObject 从Json文件中读取的JsonObject
 * @typedef EmptyActionCreator redux-act 的返回值
 * @typedef ReactComponent React组件引用，通常是 reference
 * @typedef WebColor 值为 #XXXXXX 的Web颜色值（字符串格式）
 * @typedef Ex 全局工具类，核心调用入口
 */
/**
 * @overview
 *
 * # Zero Extension 框架文档
 *
 * > 标准`node`环境可运行在` > 8.x `中，目前系统环境运行在`16.14.2`，由于`17.x+`中有很多问题，所以标准环境中不推荐升级到 `17.x+`。
 *
 * ## 0. 规范
 *
 * ### 0.1.错误代码
 *
 * |错误代码|说明|
 * |---:|:---|
 * |-200001|应用程序配置（`X_APP`）读取失败。|
 * |-200002|当前组件没有使用`Ant Design`中的form进行封装，没有form变量。|
 * |-200003|当前流程必须是异步Promise类型，而代码中未检测到Promise。|
 * |-200004|`yl`初始化专用流程要求Promise类型，没检测到Promise类型。|
 * |-200005|绑定函数过程中出错，最终无法绑定合法的Function类型。|
 * |-200006|参数长度有问题，必须是三者之一`（1，2，3）`。|
 * |-200007|`fnEvent`函数必须是一个合法函数，否则不可执行该包装。|
 * |-200008|`fnSearch`函数是Qr函数，执行时传入的`$query`参数格式非法。|
 * |-200009|构造Promise的前置条件不满足（Pre-Condition）。|
 *
 * ### 0.2.数据规范
 *
 * > Zero Extension模块是整个框架设计的基础数据规范，数据记录规范如：
 *
 * |属性|类型|含义|
 * |:---|---|:---|
 * |key|Any|数据记录主键类型。|
 * |name|String|「可重复」名称信息，如姓名、标题等。|
 * |code|String|「不可重复」编码信息，系统编码。|
 * |active|Boolean|当前数据是否合法，可表示启用，禁用该记录。|
 * |language|String|语言信息，默认使用`cn`，对应`Z_LANGUAGE`。|
 * |sigma|String|多租户使用的租户标识符，用于辨别不同租户专用字段。|
 * |createdAt|Date|创建时间。|
 * |createdBy|String|创建人ID。|
 * |updatedAt|Date|最后更新时间。|
 * |updatedBy|String|更新人ID。|
 * |appKey|String|「可选」多应用中的应用标识。|
 * |appId|String|「可选」多应用中的应用ID。|
 *
 * ## 6. 总结
 *
 * 如果您有什么疑问，请联系：[silentbalanceyh@126.com](mailto:silentbalanceyh@126.com)，整体框架相关链接参考左侧菜单。
 * @author 戒子猪
 */
Ux.dgJs(exported, "[Ex] API函数：", "#ED54A0");
export default exported;