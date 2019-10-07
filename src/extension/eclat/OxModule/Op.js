import Ex from 'ex';
/*
 * 计算 control 的id
 * 1）如果未传入 $identifier，则检查 config 中是否包含了 __DEFAULT__
 * 2）如果传入了 $identifier，则根据 config 中去找
 */
const getControl = (reference) => {
    const {$identifier, config = {}} = reference.props;
    if ($identifier) {
        return config[$identifier];
    } else {
        return config.__DEFAULT__;
    }
};
const yiModule = (reference) => {
    const state = {};
    const control = getControl(reference);
    if (control) {
        const {$metadata = {}} = reference.props;
        const type = $metadata.componentType;
        if (type) {
            return Ex.yiControl(control, type)
                .then($config => {
                    state.$ready = true;
                    state.$config = $config;
                    reference.setState(state);
                });
        } else {
            console.error("[ Ox ] 该组件要求的 componentType 无值。", type);
        }
    } else {
        state.$ready = true;
        console.error("[ Ox ] 当前传入的 $identifier 没有值！", control);
        reference.setState(state);
    }
};
const yuModule = (reference, previous = {}) => {
    const current = reference.props.$identifier;
    const prev = previous.props.$identifier;
    if (current !== prev) {
        yiModule(reference);
    }
};
export default {
    yiModule,
    yuModule
}