import React, {Fragment} from 'react';
import {Icon} from 'antd';
import Op from './Op';
import Ux from "ux";

/**
 * ## 「组件」`ColumnUser`
 *
 * ```js
 * import { ColumnUser } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * ### 2. 属性说明
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |config|uri|props|String|Ajax加载专用uri配置。|
 * |config|field|props|String|Ajax响应读取字段`field`提取为最终渲染。|
 * |config|expr|props|String|Ajax更新的表达式，如果存在expr则使用响应数据执行格式化。|
 * |config|icon|props|Boolean|是否在当前列中显示图标信息。|
 * |$icon||props|String/Object|当前列所使用的`<Icon/>`相关信息。|
 * |$key||props|Any|加载记录的专用主键信息，只提供主键信息。|
 * |$empty||props|String|如果没有读取到数据则传入该值表示空数据渲染。|
 * |value||state|String|计算出来的最终呈现的文字信息。|
 * |$system||state|Boolean|是显示系统图标还是应用图标。|
 * |$ready||state|Boolean|标识当前组件已经加载完成。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 关于Ajax加载
 *
 * * 该组件位于`<Table/>`元素中渲染特定列`USER`专用，此处有个误区就是列的名称，这里应用了`ColumnUser`是因为最早的设计中它是为了加载**创建人、更新人**而量身定制的列，而后续更改过后，依旧维持了这个名字，没有更改。
 * * 该组件中的Ajax只支持`GET`方法，内部调用`Ux.ajaxGet(uri,{key});`方法执行相关操作，这也是该列的限制。
 *
 * #### 3.2. 关于Icon计算
 *
 * 1. 如果state中计算的`$system=true`，则直接设置图标为`type = setting`为图标类型，颜色`#7D7D7D`。
 * 2. 相反则直接读取`$icon`图标信息，如果没有提供则直接使用`type = user`为图标类型，颜色`#CD2990`。
 *
 * 图标类型的格式为：
 *
 * `<type>,<color>`
 *
 * 图标的尺寸不能设置，只能是16，但是颜色可以根据提供的`$icon`来进行设置。
 *
 * @memberOf module:web-component
 * @method ColumnUser
 */
// =====================================================
// componentInit/componentUp
// =====================================================

const yiValue = (reference, value = "", isPerson = false) => {
    const state = {};
    state.value = value;
    state.$ready = true;
    state.$system = !isPerson;
    reference.setState(state);
};
const componentInit = (reference) => {
    const {config, $empty = "", $key} = reference.props;
    if (config) {
        const {uri, field, expr} = config;
        if (uri && $key) {
            Ux.ajaxGet(uri, {key: $key})
                .then(result => {
                    if (Ux.isEmpty(result)) {
                        yiValue(reference, $empty);
                    } else {
                        /*
                         * expr 专用，可支持表达式
                         */
                        if (expr) {
                            const value = Ux.formatExpr(expr, result, true);
                            yiValue(reference, value, true);
                        } else {
                            const value = result[field];
                            yiValue(reference, value, true);
                        }
                    }
                })
                .catch(error => {
                    console.error(error);
                    yiValue(reference, $empty);
                })
        } else {
            yiValue(reference, $empty);
        }
    } else {
        yiValue(reference, $empty);
    }
};

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        componentInit(this);
    }

    render() {
        const {$ready = false, value = ""} = this.state;
        const {config = {}} = this.props;
        const {icon = true} = config;
        return $ready ? (
            <Fragment>
                {icon ? (<Icon {...Op.yoIcon(this)}/>) : false}
                &nbsp;&nbsp;
                {value}
            </Fragment>
        ) : (<Icon type={"loading"}/>);
    }
}

export default Component;