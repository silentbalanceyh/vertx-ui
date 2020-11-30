import Library from './O.registry';
import g6Default from './O.graph';
import Abs from '../../abyss';

const _registryRun = (name, type) => {
    /*
     * 1. 提取执行器
     */
    const executor = Library[type];
    if (Abs.isFunction(executor)) {
        /*
         * 2. 传入 name 执行调用
         */
        return executor(name);
    }
}

function _registry() {
    const name = arguments[0];
    if (1 === arguments.length) {
        return _registryRun(name, name);
    } else if (2 === arguments.length) {
        const type = arguments[1];
        return _registryRun(name, type);
    } else {
        throw new Error("对不起，参数长度不对！")
    }
}

export default {
    /*
     * 直接调用，执行注册函数，注册节点信息
     *
     * - 第一维度：输入的值可能是
     * -- String
     * -- Array
     * -- Set
     * - 第二维度：将值传到底
     * -- 1. 执行 _registry
     */
    g6Registry: (name) => {
        // 单记录
        if ("string" === typeof name) {
            return _registry(name);
        } else {

            let registryItems = [];
            if (Set.prototype.isPrototypeOf(name)) {
                Array.from(name).forEach(each => registryItems.push(each))
            } else if (Abs.isArray(name)) {
                name.forEach(each => registryItems.push(each));
            } else {
                console.error("对不起，传入数据类型不对！！", name);
            }
            // 执行
            return registryItems.map(cell => _registry(cell));
        }
    },
    ...g6Default,       // 默认
}