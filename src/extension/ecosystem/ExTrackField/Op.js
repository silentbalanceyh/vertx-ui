import Ux from 'ux';
import {Dsl} from 'entity';

const rxSelect = (reference) => (event) => {
    const value = Ux.ambEvent(event);
    if (value) {
        /*
         * 选择了合适的字段信息
         */
        const {$identifier, $inited = {}} = reference.props;
        const params = {};
        params.identifier = $identifier;
        params.key = $inited.key;
        params.field = value;
        reference.setState({$loading: true});
        Ux.ajaxGet("/api/history/:identifier/:key/:field", params).then(original => {
            // 按时间排序
            const items = Ux.clone(original);
            items.sort(Ux.sorterDescDFn('createdAt'));
            // 数据信息
            const {$table = {}} = reference.state;
            const lazyColumns = $table.columns.filter(item => "USER" === item['$render']);
            if (0 < lazyColumns.length) {
                Ux.ajaxEager(reference, lazyColumns, items).then($lazy => {
                    reference.setState({$data: {items}, $loading: false, $lazy});
                })
            } else {
                reference.setState({$data: {items}, $loading: false});
            }
        })
    } else {
        /*
         * 直接清空
         */
        reference.setState({$data: {items: []}});
    }
}
const yoFieldAdjust = (reference) => {
    const {data = {}} = reference.props;
    const changes = Ux.isArray(data.items) ? data.items : [];
    return Dsl.codex(reference).bind().done(changes);
}
export default {
    rxSelect,
    // Field
    yoFieldAdjust
}