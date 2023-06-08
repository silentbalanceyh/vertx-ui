import React from 'react';
import {component} from "web";
import Ux from 'ux';
import Op from "./Op";

/**
 * ## 「组件」`IxMapping`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method *IxMapping
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "IxMapping";
const componentInit = (reference) => {
    const {$identifier} = reference.props;
    /* 根节点专用 */
    if ($identifier) {
        /* 根节点模型字段属性信息 */
        return Op.onStore(reference).init($identifier)
            .then(fetched => {
                const state = {};
                state.$stored = fetched;
                /* 存储节点信息 */
                return Ux.promise(state);
            })
            .then(state => {
                state.$alert = Ux.fromHoc(reference, "alert");
                return Ux.promise(state)
            })
            .then(state => {
                /* 配置 button */
                Ux.of(reference).in(state).ready().done();
                // state.$ready = true;
                // reference.?etState(state);
            });
    } else {
        const state = {};

        Ux.of(reference).in(state).ready().done();
        // state.$ready = true;
        // reference.?etState(state);
    }
}

@component({
    "i18n.cab": require("./Cab.json"),
    "i18n.name": UCA_NAME
})
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    constructor(props) {
        super(props);
        this.state = Ux.xtInitObject(props);
    }

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return (
            <div>
                Tpl
            </div>
        )
    }
}

export default Component