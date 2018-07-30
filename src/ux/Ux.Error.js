import U from 'underscore'

const fnError = {
    10000: (type, current) => `[ ERR-10000 ] 传入参数类型不匹配，期望类型${type}，当前参数类型${current}`,
    10001: (name, key) => `[ ERR-10001 ] Hoc高阶组件绑定资源文件：${name}.json 中缺失了该组件所需配置节点：${key}`,
    10002: (reference) => `[ ERR-10002 ] Ux.State.writeTree方法遇到错误，首参数必须是ReactComponent，当前参数：${reference}`,
    10003: (reference) => `[ ERR-10003 ] Ux.State.writeTree方法传入的ReactComponent需要"fnOut"写状态树方法，该方法不存在：fnOut=${reference.props.fnOut}`,
    10004: (reference) => `[ ERR-10004 ] 你将使用React-Router中的DataRouter功能，$router变量不存在${reference.props['$router']}`
};
const _fxError = (_condition, code, message) => {
    if (_condition) {
        console.error(message);
    }
};
const _fxContinue = (cond, callback) => {
    if (U.isFunction(cond)) {
        cond = cond();
    }
    if (cond && U.isFunction(callback)) {
        callback();
    }
};
const _fxTerminal = (cond, callback, code, ...args) => {
    _fxError(!cond, code, fnError[code].apply(this, args));
    _fxContinue(cond, callback);
};
export default {
    fxContinue: _fxContinue,
    fxOut: (reference = {}, callback) => _fxTerminal(!!reference && reference.props, () => {
        const {fnOut} = reference.props;
        _fxTerminal(fnOut && U.isFunction(fnOut), () => {
            callback(fnOut);
        }, 10003, reference);
    }, 10002, reference),
    fxRouter: (reference = {}, callback) => _fxTerminal(!!reference && reference.props, () => {
        const {$router} = reference.props;
        _fxTerminal($router, () => {
            callback($router);
        }, 10004, reference);
    }, 10002, reference),
    fxTerminal:
        (fnCond, code, ...args) => {
            const checked = U.isFunction(fnCond) ? fnCond() : fnCond;
            if (checked) {
                const fn = fnError[code];
                if (U.isFunction(fn)) {
                    const message = fn.apply(this, args);
                    console.error(message + "!!!");
                    return message;
                }
            }
        }
}