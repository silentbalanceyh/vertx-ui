import React from 'react';
import {Spin} from "antd";
import {uca} from "../zero.uca.dependency";
import './Cab.norm.scss'
import Sk from 'skin';

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
 * @memberOf module:uca/zone
 * @method LoadingContent
 */
@uca({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "LoadingContent"
})
class Component extends React.PureComponent {

    render() {
        const {$height, $top, $tip} = this.props;
        const {$hoc} = this.state;
        const tip = $tip ? $tip : $hoc._("loading");
        return (
            /*
             * .uca_LoadingContent {
             *      width: 100%;
             *      text-align: center;
             * }
             */
            <div {...Sk.mixUca("LoadingContent",
                () => Sk.ofRegion({
                    paddingTop: $top,
                    height: $height,
                }))}>
                <Spin size="large" tip={tip}>
                    <span/>
                </Spin>
            </div>
        );
    }
}

export default Component;
