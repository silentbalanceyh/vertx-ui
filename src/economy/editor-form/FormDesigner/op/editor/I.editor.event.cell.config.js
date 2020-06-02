import Ux from 'ux';
import {Dsl} from 'entity';

export default (reference) => (params = {}) => {
    const {
        type,
        config,
        raft = {}
    } = params;
    const normalized = Ux.clone(config);
    normalized.raft = raft;
    normalized.render = type;
    // 更新单元格渲染配置（核心配置）
    const {data = []} = reference.props;
    const $data = Dsl.getArray(data);
    $data.saveElement(normalized);

    // 更新 row 处理
    const rowData = {};
    rowData.key = config.rowKey;
    rowData.data = $data.to();

    Ux.dgDebug({
        row: rowData,
        cell: params
    }, "放置组件配置", "#458B00");

    Ux.fn(reference).rxRowConfig([rowData]);
}