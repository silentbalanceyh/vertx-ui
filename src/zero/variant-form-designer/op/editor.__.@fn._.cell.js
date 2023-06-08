import Op from './web.entry';
import __Zn from '../zero.uca.dependency';

export default (reference) => (params = {}) => {
    // 添加一个处理过的单元格
    const cellData = Op.cellConfig(reference, params);
    // 返回一个新的 rowData
    const rowData = Op.rowSave(reference, cellData);
    // 打印相关信息
    __Zn.dgDebug({
        row: rowData,
        cell: params,
        cellData: cellData
    }, "组件最终配置", "#458B00");
    __Zn.fn(reference).rxRowConfig([rowData]);
}