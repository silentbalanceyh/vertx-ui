import React from 'react';
import {HocI18r} from 'entity';
import Ex from 'ex';
import {PageCard} from 'web';

/**
 * ## 「组件」`OxCard`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|x|
 *
 * @memberOf module:web-component
 * @method OxCard
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => {
    const state = {};
    /*
     * 构造 Hoc
     */
    const {config = {}} = reference.props;
    state.$hoc = new HocI18r({
        _page: config,
    });
    state.$ready = true;
    reference.setState(state);
};

class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {children} = this.props;
            return (
                <PageCard reference={this}>
                    {children}
                </PageCard>
            );
        }, Ex.parserOfColor("OxCard").container());
    }
}

export default Component;