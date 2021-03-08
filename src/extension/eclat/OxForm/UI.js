import React from 'react';
import Ex from 'ex';
import {ExForm} from 'ei';
import Ux from 'ux';

/**
 * ## 「组件」`OxForm`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:web-component
 * @method OxForm
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    const {config = {}} = reference.props;
    const {event = {}} = config;
    const $op = {};
    Object.keys(event)
        .forEach(opKey => $op[opKey] = Ex.onOp(reference, event[opKey]));
    state.$op = $op;
    state.$ready = true;
    /*
     * initial 初始值解析专用（OxForm才有，ExForm无）
     */
    reference.setState(state);
}

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$op = {}} = this.state;
            /*
             * $inited 计算流程
             * 1）添加
             * -- 是否存在 $addKey
             * -- 如果存在 $addKey（就是添加模式）则执行 initial 定义处理
             * 2）编辑
             * -- 不存在 $addKey 则不需要考虑模式，直接处理
             */
            const $edition = Ux.pluginForm(this);
            const {$inited = {}} = this.props;
            /*
             * 只有编辑模式开 acl
             */
            const attrs = Ux.aclData($inited, this, $edition);
            return (
                <ExForm {...this.props} $height={"300px"}
                        $op={$op} {...attrs}/>
            );
        }, Ex.parserOfColor("OxForm").form())
    }
}

export default Component;