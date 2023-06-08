import React from 'react';
import Ex from 'ex';
import {ExRelation} from "ei";
import OxAnchor from '../OxAnchor/UI';
import Ux from "ux";

/**
 * ## 「组件」`OxRelation`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method OxRelation
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const toConfig = (reference, rest = {}) => {
    const config = Ux.clone(rest);
    /*
     * 设置 config.editable（配合 pluginRow）
     */
    config.editable = Ux.pluginEdition(reference);
    return config;
}
const componentInit = (reference) => {
    const {config = {}} = reference.props;
    const {relation = {}} = config;
    const state = {};
    if (relation.definition) {
        Ex.I.relation().then(definitions => {
            state.$definition = definitions;
            Ux.of(reference).in(state).ready().done();
            // reference.?etState(state);
            // state.$ready = true;
        })
    } else {
        state.$definition = false;
        Ux.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    }
}

class Component extends React.PureComponent {
    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {config = {}, $inited = {}} = this.props;
            const {category = {}, ...rest} = config;
            /*
             * 底层需要
             */
            const {$definition = false} = this.state;
            const attrs = Ex.configRelation($inited, {category}, this);
            attrs.config = toConfig(this, rest);
            /*
             * 继承属性
             */
            const inherit = Ex.yoAmbient(this);
            if ($definition) {
                /*
                 * 读取关系定义数据
                 */
                inherit.$definition = $definition;
            }
            /*
             * $column render for code = OxCi
             */
            attrs.$renders = {
                sourceCode: OxAnchor,
                targetCode: OxAnchor
            };
            /*
             * 特殊处理 rxView 外置方法，处理成标准 rxRefresh 方法
             */
            attrs.rxRefresh = inherit.rxView;
            return (
                <ExRelation {...inherit} {...attrs}/>
            );
        }, Ex.parserOfColor("OxRelation").component())
    }
}

export default Component;