import Eng from '../engine';
import Abs from '../abyss';

/**
 * ## 特殊函数「Zero」
 *
 * 1. events 会根据 op 节点的 key 值执行绑定，绑定时会调用一次
 *
 *      `events[op.key](reference)，所以必须是一个二阶函数`
 * 2. op 的数据结构参考下表
 *
 * ```json
 *
 * "_op": [
 *     {
            "key": "$opSave",
            "text": "保存",
            "icon": "save",
            "type": "primary"
 *     }
 * ]
 * ```
 *
 * @memberOf module:_romantic
 * @method sexButtons
 * @param {ReactComponent} reference React组件引用。
 * @param {String} key 配置键值。
 * @param {Object} events 绑定的事件信息
 * @return {Array} 生成最终的 操作集合
 */
export default (reference, events = {}, key = "op") => {
    const $op = Eng.fromHoc(reference, key);
    if (Abs.isArray($op)) {
        $op.forEach(op => {
            let executor = events[op.key];
            if (Abs.isFunction(executor)) {
                executor = executor(reference);
                if (Abs.isFunction(executor)) {
                    op.onClick = executor;
                }
            }
        })
    }
    return $op;
}