import Ux from 'ux';
import Op from '../library';

export default (reference) => (params = {}) => {
    // 添加一个处理过的单元格
    const cellData = Op.cellConfig(reference, params);
    // 返回一个新的 rowData
    const rowData = Op.rowSave(reference, cellData);
    // 打印相关信息
    Ux.dgDebug({
        row: rowData,
        cell: params,
        cellData: cellData
    }, "组件最终配置", "#458B00");
    Ux.fn(reference).rxRowConfig([rowData]);
}