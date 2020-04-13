import Fn from '../generator';
import U from 'underscore';
import Ux from 'ux';

const configGenerator = (onClickStr, reference) => {
    /*
     * 配置必须走 $func 中的绑定流程
     * 1）规范1：该配置必须是一个字符串
     * 2）规范2：如果有多阶，那么应该是：fnName,X，这里的X代表多阶，且不包含空白
     * 3）规范3：最多支持3阶：子、父、爷
     */
    const funcObj = {};
    if (0 < onClickStr.indexOf(',')) {
        const split = onClickStr.split(',');
        funcObj.name = split[0];
        funcObj.level = Ux.valueInt(split[1]);
    } else {
        funcObj.name = onClickStr.onClick;
        funcObj.level = 1;
    }
    /*
     * 从 props 中读绑定寻找函数
     */
    const {$func = {}} = reference.props;
    const generator = $func[funcObj.name];
    let onClick = undefined;
    if (U.isFunction(generator)) {
        /*
         * $func 中存在才会有输入源
         */
        if (1 === funcObj.level) {
            /* 1阶函数直接处理 */
            onClick = generator;
        } else if (2 === funcObj.level) {
            /* 2阶函数 */
            const generated = generator(reference);
            if (U.isFunction(generated)) {
                onClick = generated;
            }
        } else if (3 === funcObj.level) {
            /* 3阶函数，先读取父引用 */
            const ref = Ux.onReference(reference, 1);
            let generated = generator(ref);
            if (U.isFunction(generated)) {
                generated = generated(reference);
                if (U.isFunction(generated)) {
                    onClick = generated;
                }
            }
        } else {
            console.error("[ Ex ] 只支持 1,2,3 阶函数，不支持高于 3 阶的函数")
        }
    }
    return onClick;
};

const configConnect = (onClick, plugin = {}, reference) => {
    const {
        connect = false,
        submit = false
    } = plugin;
    if (!onClick) {
        if (submit) {
            if (connect) {
                /*
                 * 如果 fn 中包含了 fnConnect
                 * 同时又是 submit = true
                 */
                onClick = (event) => {
                    Ux.prevent(event);
                    Fn.rx(reference).submitting();
                    Ux.connectId(connect);
                };
            }
        } else {
            if (connect) {
                /*
                 * 如果 fn 中包含了 fnConnect
                 * 同时又是 submit = false
                 */
                onClick = (event) => {
                    Ux.prevent(event);
                    Ux.connectId(connect);
                };
            }
        }
    } else {
        if (submit) {
            /*
             * onClick 本身已经是函数
             */
            const fnOriginal = onClick;
            onClick = (event) => {
                Ux.prevent(event);
                Fn.rx(reference).submitting(true);
                fnOriginal(event);
            }
        }
    }
    return onClick
};
/**
 * ## 扩展函数
 *
 * 按钮扩展配置。
 *
 * @memberOf module:_config
 * @param {Object} config 按钮完整配置
 * @param {ReactComponent} reference React对应组件引用
 * @returns {Function} 返回需要绑定的执行函数
 */
const configClick = (config = {}, reference) => {
    const {
        plugin = {}
    } = config;
    /*
     * 事件第一来源：当前组件的直接配置
     * 1）reference.props -> onClick 优先（最方便模式）
     * 2）config -> onClick 其次（直接配置模式）
     * 3）config -> onClick 为一个 Json 对象，直接使用配置模式
     */
    let onClick;
    if (U.isFunction(reference.props.onClick)) {
        onClick = reference.props.onClick;
    } else {
        if (U.isFunction(config.onClick)) {
            onClick = config.onClick;
        }
    }
    if (config.onClick && "string" === typeof config.onClick) {
        onClick = configGenerator(config.onClick, reference);
    }
    /*
     * 如果 onClick 已经传入，则不考虑
     * 1）connect 连接点不考虑
     * 2）submit 提交不考虑
     */
    onClick = configConnect(onClick, plugin, reference);
    /*
     * 是否包含 confirm 执行 onClick 的 外围 confirm
     */
    const content = plugin.confirm;
    if (content) {
        onClick = Ux.onConfirm(onClick, content);
    }
    return onClick;
};
export default {
    configClick,
}