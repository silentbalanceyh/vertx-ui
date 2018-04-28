import "./Cab.less"
import React from 'react'
import {Spin} from "antd";
import {_zero} from "../../_internal";

@_zero({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": "LoadingContent"
})
class Component extends React.PureComponent {

    render() {
        // i18n组件处理
        const height = document.body.clientHeight;
        const header = height / 3;
        const {$hoc} = this.state;
        // 【约定】$hoc必定为HocI18n类型
        const style = {};
        style.marginTop = header + "px";
        style.height = height + "px";
        return (
            <div className="vi-content" style={style}>
                <Spin size="large" tip={$hoc._("loading")}/>
            </div>
        )
    }
}

export default Component;
