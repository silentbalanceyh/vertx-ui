import Ex from 'ex';
import Ux from 'ux';
import U from 'underscore';
import {Dsl} from "entity";

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
    if (U.isArray(config['fabric'])) {
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
const yiModule = (reference) => asyncControl(reference).then((combine = {}) => {
    const state = {};
    const {$control, $identifier} = combine;
    if ($control) {
        const {$metadata = {}} = reference.props;
        const type = $metadata.componentType;
        if (type) {
            return Ex.yiControl($control, type)
                .then($config => {
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
const yuModule = (reference, previous = {}) => {
    const current = reference.props.$identifier;
    const prev = previous.props.$identifier;
    if (current !== prev) {
        yiModule(reference)
            .then(state => Ux.dgDebug("[ Ox ] 最终状态", state));
    }
};
export default {
    yiModule,
    yuModule
}