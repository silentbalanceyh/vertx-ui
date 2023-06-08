const _generate = (code, info, error) => () => Promise.reject({code, error, info});
const error001 = _generate(-200001, "应用程序数据读取失败！",
    "Application ( X_APP ) Has not been initialized ！");
const error002 = _generate(-200002, "当前组件中未使用 Ant Design中的Form进行封装，请检查！",
    "Ant Design `form` variable was missing, please check your code !");
const error003 = _generate(-200003, "当前流程要求 Promise 类型，但检测到非 Promise！",
    "Promise type in workflow required in current position.");
const error004 = _generate(-200004, "初始化流程中要求 Promise 类型参数，检测到非 Promise！",
    "Promise type required in `ylXXX` function workflow.");
const error005 = _generate(-200005, "绑定函数过程出错，最终无法绑定合法函数！",
    "Bind function is not generated successfully");
const error006 = _generate(-200006, "参数长度有问题！",
    "The length of arguments is wrong, should be one of (1,2,3)");
const error007 = _generate(-200007, "传入的 fnEvent 必须是一个合法函数，才可以执行包装",
    "The input `fnEvent` must be a javascript Function.");
const error008 = _generate(-200008, "对不起，搜索方法参数不可为空，必须包含 `$query`",
    "The parameter `$query` is invalid when you do `fnSearch`.");
const error009 = _generate(-200009, "对不起，Promise构造的前置条件不满足。",
    "The pre-condition is invalid to build promise");

/**
 * @class Refuse
 * @name utter.Refuse
 */
class Refuse {
    /**
     * -200001, 应用程序初始化读取失败
     *
     * @async
     * @returns {Promise<T>} Promise
     */
    static error001() {
        return error001();
    }

    /**
     * -200002, Ant Design 中的 Form 没经过封装
     *
     * @async
     * @returns {Promise<T>} Promise
     */
    static error002() {
        return error002();
    }

    /**
     * -200003, 当前构造的必须是 Promise
     *
     * @async
     * @returns {Promise<T>} Promise
     */
    static error003() {
        return error003();
    }

    /**
     * -200004, 当前构造的必须是 Promise（初始化流程）
     *
     * @async
     * @returns {Promise<T>} Promise
     */
    static error004() {
        return error004();
    }

    /**
     * -200005, 无法绑定合法函数，绑定过程出错
     *
     * @async
     * @returns {Promise<T>} Promise
     */
    static error005() {
        return error005();
    }

    /**
     * -200006, 参数长度有问题
     *
     * @async
     * @returns {Promise<T>} Promise
     */
    static error006() {
        return error006();
    }

    /**
     * -200007, fnEvent 不合法
     *
     * @async
     * @returns {Promise<T>} Promise
     */
    static error007() {
        return error007();
    }

    /**
     * -200008, 搜索方法参数不可为空
     *
     * @async
     * @returns {Promise<T>} Promise
     */
    static error008() {
        return error008();
    }

    /**
     * -200009, Promise 构造的前置条件不满足
     *
     * @async
     * @returns {Promise<T>} Promise
     */
    static error009() {
        return error009();
    }
}

export default Refuse