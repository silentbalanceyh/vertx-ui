import Ux from 'ux';
import {Dsl} from 'entity';

const rowSave = (reference, cellData = {}) => {
    const {data = []} = reference.props;
    const $data = Dsl.getArray(data);
    $data.saveElement(cellData);
    // 返回最终的 rowData
    const rowData = {};
    rowData.key = cellData.rowKey;
    rowData.data = $data.to();
    return rowData;
}
export default {
    /*
     * 这里的 reference 是 Row
     */
    rowRefresh: (reference, data = []) => {
        const {config = {}} = reference.props;
        const rowConfig = {};
        rowConfig.key = config.key;
        rowConfig.data = data;
        console.info(data);
        Ux.fn(reference).rxRowConfig([rowConfig]);
    },
    rowSave
}