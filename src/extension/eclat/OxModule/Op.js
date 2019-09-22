import Ex from 'ex';
import Ux from 'ux';
/*
 * 计算 control 的id
 * 1）如果未传入 $identifier，则检查 config 中是否包含了 __DEFAULT__
 * 2）如果传入了 $identifier，则根据 config 中去找
 */
const yiControl = (reference) => {
    const {$identifier, config = {}} = reference.props;
    if ($identifier) {
        return config[$identifier];
    } else {
        return config.__DEFAULT__;
    }
};
const yiModule = (reference) => {
    const state = {};
    const control = yiControl(reference);
    if (control) {
        const {$metadata = {}} = reference.props;
        const type = $metadata.componentType;
        if (type) {
            const ajaxControl = Ex.I.control({type, control});
            const ajaxOp = Ex.I.ops({control: $metadata.key});
            const parser = Ex.parserOfButton(reference);
            return Ux.parallel([ajaxControl, ajaxOp], "config", "ops").then(response => {
                const {config = {}, ops = []} = response;
                return parser.parseOps(config, {type, ops}, true);
            }).then($config => {
                state.$ready = true;
                state.$config = $config;
                reference.setState(state);
            }).catch(error => console.error(error))
        } else {
            console.error("[ Ox ] 该组件要求的 componentType 无值。", type);
        }
    } else {
        state.$ready = true;
        reference.setState(state);
    }
};
export default {
    yiModule
}