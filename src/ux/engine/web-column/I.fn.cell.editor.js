import Ft from '../functions';
import Ele from '../../element';
import Xt from '../../xweb';
import Abs from '../../abyss';

export default (reference, column = {}) => {
    /* Cell 处理 */
    const cell = {};
    cell.field = column.dataIndex;
    const $cell = column.config ? column.config : {};
    Object.assign(cell, $cell);
    if (!cell.optionJsx) {
        cell.optionJsx = {};
    }
    if (!cell.optionConfig) {
        cell.optionConfig = {};
    }
    return (text, record, index) => {
        const {disabled = false} = reference.props;
        /*
         * 处理专用
         */
        const rowCell = Abs.clone(cell);
        rowCell.optionJsx.onChange = (event) => {
            /* 得到值 */
            const value = Ele.ambEvent(event);
            const data = Xt.xtSet(reference, [rowCell.field, index], value);
            /* 当前值更新 */
            reference.setState({data});
            /* 调用上层 onChange */
            const {config = {}} = reference.props;
            Abs.fn(reference).onChange(Xt.xtFormat(data, config.format));
        }
        rowCell.optionJsx.value = record[rowCell.field];
        rowCell.optionJsx.disabled = disabled;      // 禁用处理
        const render = Ft.onRender(reference, rowCell);
        return render(record);
    }
}