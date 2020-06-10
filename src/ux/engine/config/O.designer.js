import Abs from '../../abyss';
import Expr from '../expression';
import Raft from '../raft';

const configDesiger = (reference, config = {}) => {

}
/**
 * ## 引擎函数
 *
 * 「标准配置」表单中的字段标准处理方法
 *
 * @memberOf module:_config
 * @param {Object} raft 传入的表单本身配置
 * @param {Object} cell 表单字段核心配置，默认 {}
 * @param {Object} config 特殊配置信息
 * @return {Object} 配置规范化完成后的Form数据。
 */
const configField = (raft, cell = {}, config = {}) => {
    /* 先解析 String */
    let $cell;
    {
        /* 基础解析，解析 title 和 field */
        $cell = Expr.aiExprTitle(cell);
        $cell = Expr.aiExprField($cell);
        $cell = Expr.aiExprFieldEx($cell);
    }
    {
        /* 验证一条线 */
        $cell = Raft.raftRule(null, $cell);
    }
    {
        /* 单个单元格专用处理 */
        Raft.raftItem($cell, {}, {});
        const addOn = {
            columns: raft.columns,
        }

        const calculated = Raft.raftLayout(raft, {form: raft, addOn})
        /* 修正计算宽度 */
        if (config.span) {
            calculated.span = config.span;
        }
        /* 构造专用参数 */
        const params = {
            cell: $cell, index: config.cellIndex,
            calculated,
            row: {length: config.length, index: config.rowIndex},
            addOn,
        }
        $cell = Raft.raftColumn(raft, Abs.clone(params));
    }
    {
        /* 特殊操作 */
        Raft.raftSpecial($cell);
    }
    return $cell;
}
export default {
    configDesiger,
    configField,
}