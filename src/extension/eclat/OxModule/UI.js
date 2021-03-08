import React from 'react';
import Ex from 'ex';
import Ux from 'ux';
import {Dsl} from "entity";

/**
 * ## 「组件」`OxModule`
 *
 * ### 1. 生命周期
 *
 * |Hoc高阶周期|Mount初始化|Update更新|
 * |---|---|---|
 * |x|Ok|Ok|
 *
 * @memberOf module:web-component
 * @method OxModule
 */
// =====================================================
// componentInit/componentUp
// =====================================================

const getControl = (reference, $identifier) => {
    let $control;
    const {config = {}} = reference.props;
    const {vector = {}} = config;
    if ($identifier) {
        $control = vector[$identifier];
    } else {
        $control = vector.__DEFAULT__;
    }
    Ux.dgDebug({$identifier, $control}, "[ Ox ] 选择的：$identifier 和 $control.");
    return {$control, $identifier};
};
/*
 * 计算 control 的id
 * 1）如果未传入 $identifier，则检查 config 中是否包含了 __DEFAULT__
 * 2）如果传入了 $identifier，则根据 config 中去找
 */
const asyncControl = (reference) => {
    const {config = {}} = reference.props;
    /*
     * 是否走 fabric 配置流程
     */
    if (Ux.isArray(config['fabric'])) {
        const fabric = config['fabric'];
        /*
         * 读取新的配置信息
         */
        const fabricAsync = Ex.etPure(reference, fabric);
        const dataEvent = Dsl.getEvent(null);
        return fabricAsync(dataEvent).then(dataEvent => {
            const $identifier = dataEvent.getPrev();
            return Ux.promise(getControl(reference, $identifier));
        });
    } else {
        const {$identifier} = reference.props;
        return Ux.promise(getControl(reference, $identifier));
    }
};
const componentInit = (reference) => asyncControl(reference).then((combine = {}) => {
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
                reference.setState(state);
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
        reference.setState(state);
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