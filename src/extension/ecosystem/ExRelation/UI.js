import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import Op from './Op';

import Jsx from './Web';
import Sk from 'skin';
import "./Cab.norm.scss";

/**
 * ## 「组件」`ExRelation`
 *
 * ```js
 * import { ExRelation } from 'ei';
 * ```
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |Ok|Ok|x|
 *
 * @memberOf module:uca/extension
 * @method ExRelation
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const UCA_NAME = "ExRelation";
const componentInit = (reference) => {
    const {config = {}, data = {}} = reference.props;
    const state = {};
    const $config = Ux.clone(config);
    const header = Ux.fromHoc(reference, "header");
    if (header) {
        $config.header = Ux.clone(header);
    }
    /*
     * 设置函数用于处理数据
     */
    state.$config = $config;
    state.$data = Ux.clone(data);
    /*
     * 是否带有定义，如果带有定义则需要计算 identifiers （按定义计算，只计算一次）
     */
    if (config.hasOwnProperty("relation")) {
        const {definition = false, source = ""} = config.relation;
        if (definition && source) {
            let categoryArray = Ux.onDatum(reference, source);
            const {current = {}, $definition = []} = reference.props;
            if (0 < categoryArray.length && 0 < $definition.length) {
                const $defineArray = [];
                const $defineMap = Ex.onRelationIdentifiers(current.identifier, categoryArray, $definition);
                if ($defineMap.up) {
                    $defineMap.up.forEach(identifier => $defineArray.push(identifier));
                }
                if ($defineMap.down) {
                    $defineMap.down.forEach(identifier => $defineArray.push(identifier));
                }
                state.$defineArray = $defineArray;
                state.$defineMap = $defineMap;
            }
        }
    }
    Ux.of(reference).in(state).ready().done();
    // reference.?etState(state);
    // state.$ready = true;
};

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$config = {}} = this.state;
            const {header = {}} = $config;
            /*
             * 头部数据基础
             */
            const {current = {}, $header = true} = this.props;
            const tabs = Op.yoTabs(this);
            const attrEx = Sk.mixEx(UCA_NAME);
            return (
                <div {...attrEx}>
                    {$header ? Jsx.renderHeader(current, header) : false}
                    {Jsx.renderPage(this, tabs)}
                </div>
            )
        }, Ex.parserOfColor(UCA_NAME).component())
    }
}

export default Component;