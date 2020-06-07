import "./Cab.less";
import React from 'react';
import {Spin} from "antd";
import {component} from "../../_internal";

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
            <div className="vi-content" style={style}>
                <Spin size="large" tip={tip}/>
            </div>
        );
    }
}

export default Component;
