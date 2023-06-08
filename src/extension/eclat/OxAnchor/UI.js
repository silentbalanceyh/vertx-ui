import React from 'react';
import Ux from "ux";
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
 * @memberOf module:uca/extension
 * @method OxAnchor
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const onClick = (reference) => (event) => {
    Ux.prevent(event);
    Ux.of(reference).open().done();
    // reference.?etState({$visible: true});
}
const componentInit = (reference) => {
    const config = Ux.sexCab(reference, "config");
    /*
     * dialog 专用
     */
    const dialog = Ux.configDialog(reference, config.window);
    const state = {};
    state.$dialog = dialog;
    Ux.of(reference).hide().ready().done();
    // reference.?etState(state);
    // state.$ready = true;
    // state.$visible = false;
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
                        {data.code}&nbsp;&nbsp;{Ux.v4Icon("search")}
                    </a>
                    {renderJsx(this)}
                </span>
            );
        }, Ex.parserOfColor("OxAnchor").component());
    }
}

export default Component;