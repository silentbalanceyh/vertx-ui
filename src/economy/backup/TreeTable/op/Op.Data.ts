import Ux from "ux";
import Init from './Op.Init';

const initRow = (reference) => {
    const options = Init.readOptions(reference);
    const {table} = reference.state;
    const data: any = {};
    data.key = Ux.randomUUID();
    if (table && 0 < table.columns.length) {
        if (options["table.edit.standalone"]) {
            // TODO:
            // 独立模式，每一个level中的处理独立核算，且不计算maxLevel

        } else {
            // TODO:
            // 依赖模式，后一个level要求前一个level必须有数据
        }
    }
    return data;
};
const initData = (reference: any, data: any = []) => {
    // 计算Level
    data.forEach(item => Ux.treeCounter(item, 1));
    // 追加counter
    const flatted = Ux.treeFlat(data);
    // 每一行追加一个key防止rowKey问题
    flatted.forEach(each => each.key = Ux.randomUUID());
    // 编辑模式才会在空数据中增加
    const options = Init.readOptions(reference);
    if (options["table.edit.enabled"]) {
        if (0 === flatted.length) {
            // 最少有一行的前提就是table.empty.init = true
            if (options['table.empty.init']) {
                flatted.push(initRow(reference));
            }
        }
    }
    // 针对flatted的内容执行拉平处理
    return flatted;
};
export default {
    initData
}