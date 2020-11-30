import elementDefault from './element-default';
import pluginDefault from './plugin-default';
import {Abs, Dev} from '../internal';

const combineConfig = (container, inputConfig = {}, CFG, type) => {
    if (container) {
        const defaultCfg = CFG[container];
        if (defaultCfg) {
            // 有默认，拷贝原始配置
            const original = Abs.clone(defaultCfg);

            /*
             * 2. 然后追加合并
             * 追加合并的模式 mode = 1，深度覆盖，不直接覆盖子对象
             *
             * 1）追加完成后，默认行为中的基本函数会保留
             * 2）静态配置中的特殊定制也会进入到系统中
             */
            const combine = Abs.assign(original, inputConfig, 1);
            Dev.dgGraphic(combine, `（合并配置）类型 -> ${type}, ${container}`);
            return combine;
        } else {
            // 无默认
            Dev.dgGraphic(inputConfig, `（不合并）类型 -> ${type}, ${container}`);
            return inputConfig;
        }
    } else {
        console.error("对不起，container 传入错误，清空所有配置！");
        return {};
    }
}
/**
 *
 * @param container 传入的 container 值（键值）
 * @param config    传入的其他配置（无函数配置）
 */
export default {
    /*
     * G6 默认图相关配置，对于所有图对应的默认配置中，只支持二级的 overwrite 功能
     * 此时需要调用 Ux.assign 这个函数来实现：
     *
     * 1. 从 config 中读取配置信息，如果配置信息中不存在，则使用默认的
     * 2. 如果配置中存在，则使用配置中的数据覆盖默认的
     * 3. 默认和原始配置使用 container 的值进行绑定
     *
     * UI库中提供默认图配置信息，并且写入到默认图库中，提供图配置的 overwrite 选项，一旦开启了
     * overwrite 功能，则默认的图配置失效，该操作的目的是为了简化配置信息
     */
    g6DefaultGraph: (container, config = {}) =>
        combineConfig(container, config, elementDefault, "Graph"),
    g6DefaultAddOn: (container, config = {}) =>
        combineConfig(container, config, pluginDefault, "AddOn"),
}