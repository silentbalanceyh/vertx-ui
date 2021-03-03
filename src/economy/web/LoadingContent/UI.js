import "./Cab.less";
import React from 'react';
import {Spin} from "antd";
import {component} from "../../_internal";

/**
 * ## 「组件」`LoadingContent`
 *
 * ```js
 * import { LoadingContent } from 'web';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok| x | x |
 *
 * ### 2. 属性说明
 *
 * |属性名|二级属性|源|类型|说明|
 * |:---|---|:---|:---|:---|
 * |$height||props|Number/String|当前加载遮罩的高度，默认高度为100%（自动填充满）|
 * |$tip||props|String|当前组件呈现的文字信息，默认根据资源文件计算。|
 * |$top||props|String|高度单位，可设置成paddingTop的值，默认：`窗口高度 x 1/4`。|
 *
 * ### 3. 组件核心点
 *
 * #### 3.1. 资源文件
 *
 * 文件位置：`cab/<LANGUAGE>/economy/web/LoadingContent.json`
 *
 * 文件内容：
 *
 * ```json
 * {
 *      "loading": "数据加载中……"
 * }
 * ```
 *
 * #### 3.2. 属性计算
 *
 * 传入的三个属性主要是为计算最外层`<div/>`的`style`属性，
 *
 * @memberOf module:web-component
 * @method LoadingContent
 */
@component({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "LoadingContent"
})
class Component extends React.PureComponent {

    render() {
        const {$height, $top, $tip} = this.props;
        // i18n组件处理
        const height = document.body.clientHeight;
        const header = height / 4;
        const {$hoc} = this.state;
        // 【约定】$hoc必定为HocI18n类型
        const style = {};
        style.paddingTop = $top ? $top : header + "px";
        style.height = $height ? $height : "100%";
        style.marginBottom = style.paddingTop;
        const tip = $tip ? $tip : $hoc._("loading");
        return (
            <div className="web-loading" style={style}>
                <Spin size="large" tip={tip}/>
            </div>
        );
    }
}

export default Component;
