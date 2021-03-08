import React from 'react';
import Ux from "ux";
import {Icon} from "antd";
import Ex from "ex";
import renderJsx from './Web';

/**
 * ## 「组件」`OxAnchor`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:web-component
 * @method OxAnchor
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const onClick = (reference) => (event) => {
    Ux.prevent(event);
    reference.setState({$visible: true});
}
const componentInit = (reference) => {
    const config = Ux.sexCab(reference, "config");
    /*
     * dialog 专用
     */
    const dialog = Ux.configDialog(reference, config.window);
    const state = {};
    state.$dialog = dialog;
    state.$visible = false;
    state.$ready = true;
    reference.setState(state);
}

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("ExAnchor")
    .to()
)
class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {data = {}} = this.props;
            return (
                <span>
                    {/* eslint-disable-next-line */}
                    <a href={"#"} onClick={onClick(this)}>
                        {data.code}&nbsp;&nbsp;<Icon type={"search"}/>
                    </a>
                    {renderJsx(this)}
                </span>
            );
        }, Ex.parserOfColor("OxAnchor").component())
    }
}

export default Component;