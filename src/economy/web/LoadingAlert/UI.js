import React from 'react';
import {Alert, Icon} from 'antd';
import './Cab.less';
import Ux from 'ux';

/**
 * ## 「组件」`LoadingAlert`
 *
 * ```js
 * import { LoadingAlert } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x| x | x |
 *
 * ### 2. 属性说明
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |className||props|String|外置传入className，计算最终的风格专用属性。|
 * |$type||props|String|警告的类型，类型值包括：`success, info, warning, error`。|
 * |$icon||props|String|图标专用属性，设置图标类型。|
 * |$size||props|Number|图标字体信息，对应style中的`fontSize`。|
 * |$alert||props|Object||
 * |$alert|hideIcon|props|Boolean|「Ant」是否隐藏图标，和showIcon的最终值相反。|
 * |$alert|type|props|String|「Ant」配置数据中设置type字段信息。|
 * |$alert|message|props|String|「Ant」警告信息的标题属性。|
 * |$alert|description|props|String/Array|「Ant」警告信息的描述信息，可支持多行描述信息。|
 *
 * #### 2.1. $alert结构示例
 *
 * ```json
 * {
 *     "message": "标题文字",
 *     "description": [],
 *     "type": "配置的type",
 *     "hideIcon": "是否隐藏图标"
 * }
 * ```
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. description处理
 *
 * 1. 如果类型是String，则直接将description作为渲染文本基础元素来处理。
 * 2. 如果类型是Array，长度为1，则直接将第一个元素作为渲染文本来处理。
 * 3. 如果类型是Array，长度大于1，则使用`<ul/>`的列表方式渲染多行文本。
 *
 * #### 3.2. type执行流程
 *
 * 1. 优先选择props中的`$type`属性。
 * 2. 然后使用props中`$alert`中的`type`属性。
 * 3. 如果都没传入则使用默认值`info`。
 *
 * #### 3.3. icon计算流程
 *
 * 1. 优先选择props中的`$icon`属性。
 * 2. 然后使用props中`$alert`中的`icon`属性。
 * 3. 如果1和2都读取不了任何数据，则为**无图标模式**，否则为**有图标模式**。
 *
 * #### 3.4. 其他
 *
 * 1. 组件外层有`<div/>`元素执行封装。
 * 2. 计算`<Alert/>`的属性后传入，其中description和icon都可直接使用Jsx语法直接渲染。
 * 3. 最外层的className有两种选择：
 *      1. `showIcon = true`有图标模式：`web-alert-iconlist`。
 *      2. `showIcon = true`无图标模式：`web-alert-list`。
 *      3. `showIcon = false`纯模式：`web-alert-text`。
 *
 * @memberOf module:web-component
 * @method LoadingAlert
 */
class Component extends React.PureComponent {
    render() {
        const {$alert = {}, $type, $icon, $size = 36} = this.props;
        let {className} = this.props;
        const {message, description, type = "info"} = $alert;

        let descJsx = false;
        if ("string" === typeof description) {
            descJsx = description;
        } else if (Ux.isArray(description)) {
            if (1 === description.length) {
                descJsx = description[0];
            } else {
                descJsx = (
                    <ul>
                        {description.map((item, index) => <li
                            key={item}>{index + 1}.{item}</li>)}
                    </ul>
                );
            }
        }
        const attrs = {};
        if (message) {
            // 如果有message，则以message为主
            attrs.message = message;
        }
        attrs.description = descJsx;
        /*
         * 类型处理
         */
        if ($type) {
            attrs.type = $type;
        } else {
            attrs.type = type;
        }
        attrs.showIcon = !$alert['hideIcon'];       // 由于系统中有个地方使用了这种属性，属于遗留代码
        if (!className) {
            className = "";
        } else {
            className += " ";
        }
        if (attrs.showIcon) {
            const icon = $icon ? $icon : $alert.icon;
            if (icon) {
                attrs.icon = (<Icon type={icon} style={{
                    fontSize: $size
                }}/>);
                className += "web-alert-iconlist";
            } else {
                className += "web-alert-list";
            }
        } else {
            className += "web-alert-text";
        }
        return (
            <div className={className}>
                <Alert {...attrs}/>
            </div>
        );
    }
}

export default Component;