import __LIB from './variant-g6-library';
import __Zn from './zero.module.dependency';

const __combineSetting = (container, inputConfig = {}, CFG, type) => {
    if (container) {
        const defaultCfg = CFG[container];
        if (defaultCfg) {
            // 有默认，拷贝原始配置
            const original = __Zn.clone(defaultCfg);

            /*
             * 2. 然后追加合并
             * 追加合并的模式 mode = 1，深度覆盖，不直接覆盖子对象
             *
             * 1）追加完成后，默认行为中的基本函数会保留
             * 2）静态配置中的特殊定制也会进入到系统中
             */
            const combine = __Zn.assign(original, inputConfig, 1);
            __Zn.dgGraphic(combine, `（合并配置）类型 -> ${type}, ${container}`);
            return combine;
        } else {
            // 无默认
            __Zn.dgGraphic(inputConfig, `（不合并）类型 -> ${type}, ${container}`);
            return inputConfig;
        }
    } else {
        if ("Graph" === type) {
            /**
             * AddOn 是可选的，Graph 是必须的
             */
            console.error(`对不起，container 传入错误，清空所有配置！类型 = ${type}`);
        }
        return {};
    }
}
const __registryRun = (name, type) => {
    /*
     * 1. 提取执行器
     */
    const executor = __LIB.REGISTRY[type];
    if (__Zn.isFunction(executor)) {
        /*
         * 2. 传入 name 执行调用
         */
        return executor(name);
    }
}

function __registryFn() {
    const name = arguments[0];
    if (1 === arguments.length) {
        return __registryRun(name, name);
    } else if (2 === arguments.length) {
        const type = arguments[1];
        return __registryRun(name, type);
    } else {
        throw new Error("对不起，参数长度不对！")
    }
}

/**
 * 「标准」`Ux.g6Registry`
 *
 * 直接调用，执行注册函数，注册节点信息
 *
 * - 第一维度：输入的值可能是
 * -- String
 * -- Array
 * -- Set
 * - 第二维度：将值传到底
 * -- 1. 执行 _registry
 */
/**
 * * 直接调用，执行注册函数，注册节点信息
 *  *
 *  * - 第一维度：输入的值可能是
 *  * -- String
 *  * -- Array
 *  * -- Set
 *  * - 第二维度：将值传到底
 *  * -- 1. 执行 _registry
 *
 * @memberOf module:g6/zero
 * @param name
 * @returns {*}
 */
const g6Registry = (name) => {
    // 单记录
    if ("string" === typeof name) {
        return __registryFn(name);
    } else {

        let registryItems = [];
        if (__Zn.isSet(name)) {
            Array.from(name).forEach(each => registryItems.push(each))
        } else if (__Zn.isArray(name)) {
            name.forEach(each => registryItems.push(each));
        } else {
            console.error("对不起，传入数据类型不对！！", name);
        }
        // 执行
        return registryItems.map(cell => __registryFn(cell));
    }
}
export default {
    g6Registry,
    /**
     * 「标准」`Ux.g6DefaultGraph`
     * G6 默认图相关配置，对于所有图对应的默认配置中，只支持二级的 overwrite 功能
     * 此时需要调用 Ux.assign 这个函数来实现：
     *
     * 1. 从 config 中读取配置信息，如果配置信息中不存在，则使用默认的
     * 2. 如果配置中存在，则使用配置中的数据覆盖默认的
     * 3. 默认和原始配置使用 container 的值进行绑定
     *
     * UI库中提供默认图配置信息，并且写入到默认图库中，提供图配置的 overwrite 选项，一旦开启了
     * overwrite 功能，则默认的图配置失效，该操作的目的是为了简化配置信息
     *
     * 新版本的统一改动：
     * 1. 导入部分的内容直接使用函数模式，可传入 reference 绑定的外层引用
     * 2. 该引用中的部分事件需要注入到系统中实现事件的拦截功能
     * @memberOf module:g6/zero
     * @param container
     * @param config
     * @returns {*}
     */
    g6DefaultGraph: (container, config = {}) =>
        __combineSetting(container, config, __LIB.GRAPH, "Graph"),
    /**
     * 「标准」`Ux.g6DefaultAddOn`
     * @memberOf module:g6/zero
     * @param container
     * @param config
     * @returns {*}
     */
    g6DefaultAddOn: (container, config = {}) =>
        __combineSetting(container, config, __LIB.ADDON, "AddOn"),
}