import Env from '../Ux.Env';
import E from '../Ux.Error';
import U from 'underscore';
import Ux from "ux";

const xtRxInit = (reference = {}, fnName, params) => {
    E.fxTerminal("string" !== typeof fnName, 10100, fnName);
    // 默认组件的模式都是取的Reactive
    const {$category = Env.$$.DataSource.Reactive} = reference.props;
    // 只有Reactive模式下才调用绑定好的fnName对应的Reactive方法，则组件具有二义性
    if (Ux.$$.DataSource.Reactive === $category) {
        const rxFun = reference.props[fnName];
        // 第三参为可选参数
        if (U.isFunction(rxFun)) {
            rxFun(params);
        }
    }
};
const xtIsUpdate = (reference = {}, prevProps = {}) => {
    const {$inited = {}} = reference.props;
    const previous = prevProps['$inited'] ? prevProps['$inited'] : {};
    return $inited.key && $inited.key !== previous.key;
};
export default {
    xtRxInit,
    xtIsUpdate
};