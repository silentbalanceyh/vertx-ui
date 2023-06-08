import __Zn from './zero.uca.dependency';
import __RFT from '../form.equip.__.fn.raft.04.render';
import RENDERS from '../variant-uca/index.column.UNLOCK.EDITOR';

export default {
    EDITOR: (reference, column = {}) => {
        const cell = {};                                                    // Cell 处理
        cell.field = column.dataIndex;
        const $cell = column.config ? column.config : {};                   // 旧版优先级高
        const $config = column.$config ? column.$config : {};               // 新版优先级低
        Object.assign(cell, $config, $cell);
        if (!cell.optionJsx) {
            cell.optionJsx = {};
        }
        if (!cell.optionConfig) {
            cell.optionConfig = {};
        }
        // 构造 $renders 信息，用于处理表格编辑器中的专用渲染
        /*
         * FIX: https://e.gitee.com/wei-code/issues/table?issue=I6VM5S
         * 没有找到对应的 render 函数：EDITOR
         */
        const renders = {};
        renders[cell.field] = RENDERS[cell.render];
        return (text, record, index) => {
            const {disabled = false, config = {}} = reference.props;
            /* 处理专用 */
            const rowCell = __Zn.clone(cell);
            rowCell.optionJsx.value = record[rowCell.field];
            rowCell.optionJsx.disabled = disabled;                          // 禁用处理
            rowCell.column = {
                index,                                                      // 列变更时的索引
                format: config.format,                                      // 格式信息
            }
            const render = __RFT.raftRender(rowCell, {
                addOn: {
                    reference,
                    renders
                },
            });
            return render(
                // (values, cellRenders = {}, reference)
                record,
                {},
                reference
            );
        }
    },
}