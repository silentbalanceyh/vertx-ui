import Eng from "../engine";
import Abs from "../abyss";

/**
 * ## 内部私有函数「Zero」
 *
 * 该方法会读取配置数据，在资源文件中如`UI.json`会包含如下数据：
 *
 * ```json
 * {
 *     "_model": {},
 *     "_dialog": {
 *         "...": "该配置在 shared.json 中已经包含"
 *     }
 * }
 * ```
 *
 * 该配置主要读取模态窗口专用配置而存在，并且执行不同层级的读取，最终生成：
 *
 * ```json
 * {
 *     "type": "窗口类型",
 *     "title": "窗口标题",
 *     "content": "窗口内容"
 * }
 * ```
 *
 * 返回的结果可直接被 antd 中的 `Modal` 组件消费。
 *
 * @memberOf module:__private
 * @param {ReactComponent} reference React组件引用
 * @param {String} key 将要读取的键值
 * @return {any} 返回最终读取到的数据
 */
const cabModal = (reference, key) => {
    const modal = Eng.fromHoc(reference, "modal");
    const seek = {};
    if (Abs.isObject(modal)) {
        const title = Eng.fromHoc(reference, "dialog");
        Object.keys(modal).forEach(type => {
            /*
             * 检查
             */
            const config = modal[type];
            if (Abs.isObject(config)) {
                if (config.hasOwnProperty(key)) {
                    seek.type = type;
                    seek.content = config[key];
                    if (title) {
                        /*
                         * 标题信息
                         */
                        seek.title = title[type];
                    }
                }
            }
        });
    }
    return seek;
};
export default {
    cabModal
}