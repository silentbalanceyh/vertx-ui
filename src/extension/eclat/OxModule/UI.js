import React from 'react';
import Ex from 'ex';
import Ux from 'ux';

/**
 * ## 「组件」`OxModule`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|Ok|
 *
 * @memberOf module:uca/extension
 * @method OxModule
 */
// =====================================================
// componentInit/componentUp
// =====================================================
const componentInit = (reference) => Ex.puControl(reference).then((combine = {}) => {
    const state = {};
    const {$control, $identifier} = combine;
    if ($control) {
        const {$metadata = {}} = reference.props;
        const type = $metadata.componentType;
        if (type) {
            return Ex.yiControl($control, type).then($config => {
                state.$ready = true;
                state.$config = $config;
                state.$identifier = $identifier;
                Ux.of(reference).in(state).done();
                // reference.?etState(state);
            });
        } else {
            console.error("[ Ox ] 该组件要求的 componentType 无值。", type);
        }
    } else {
        state.$ready = true;
        if ($identifier) {
            state.$identifier = $identifier;
        } else {
            console.error("[ Ox ] 当前传入的 $identifier 没有值！", $identifier);
        }
        Ux.of(reference).in(state).done();
        // reference.?etState(state);
    }
});
const componentUp = (reference, previous = {}) => {
    const current = reference.props.$identifier;
    const prev = previous.props.$identifier;
    if (current !== prev) {
        componentInit(reference)
            .then(state => Ux.dgDebug(state, "[ Ox ] 最终状态"));
    }
};

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        componentUp(this, {state: prevState, props: prevProps});
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * 读取 $control 配置
             */
            const {$config = {}, $identifier} = this.state;
            /*
             * 提取 children 的 props.config
             */
            const {children} = this.props;
            let config = {};
            if (children.props) {
                config = children.props.config;
            }
            Object.assign(config, $config);
            return Ux.aiChildren(this, {
                /*
                 * 配置基本信息
                 */
                config,
                /*
                 * 当前组件处理的 $identifier（模型ID）
                 */
                $identifier,
            })

        }, Ex.parserOfColor("OxModule").container())
    }
}

export default Component;