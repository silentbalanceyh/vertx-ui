import Ft from '../functions';
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
        const {disabled = false, config = {}} = reference.props;
        /*
         * 处理专用
         */
        const rowCell = Abs.clone(cell);
        // rowCell.field = [cell.field, index];
        /*
        rowCell.optionJsx.onChange = (event) => {
            const value = Ele.ambEvent(event);
            const data = Xt.xtSet(reference, [rowCell.field, index], value);
            reference.setState({data});
            const {config = {}} = reference.props;
            Abs.fn(reference).onChange(Xt.xtFormat(data, config.format));
        }*/
        rowCell.optionJsx.value = record[rowCell.field];
        rowCell.optionJsx.disabled = disabled;      // 禁用处理
        rowCell.column = {
            index,                      // 列变更时的索引
            format: config.format,      // 格式信息
        }
        const render = Ft.onRender(reference, rowCell);
        return render(record);
    }
}