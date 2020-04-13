import On from '../datum';
import T from '../../unity';
import Abs from "../../abyss";

/**
 * ## 特殊函数「Zero」
 *
 * Zero UI 中的 redux 树的辅助数据 `assist` 节点专用方法，用于写 redux 树
 *
 * @memberOf module:_redux
 * @param {ReactComponent} reference React组件。
 * @param {String} key redux树上的 Assist 辅助数据所需的键。
 * @param {Object} data 需要保存的记录集。
 * @param {boolean} isDeleted 该操作是删除还是保存。
 */
const writeAssist = (reference, key, data = {}, isDeleted = false) => {
    const saved = On.onSave(reference, key, data, isDeleted);
    if (saved && Abs.isArray(saved)) {
        const assist = {};
        assist[`assist.${key}`] = saved;
        T.writeTree(reference, assist);
    }
};
export default {
    writeAssist
}