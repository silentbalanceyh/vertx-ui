import U from 'underscore';
import Ux from 'ux';

const yiPage = (reference) => {
    const state = {};
    const {data} = reference.props;
    console.info(data);
    if (data) {
        state.$multi = U.isArray(data);
        state.$ready = true;
        const table = Ux.fromHoc(reference, "table");
        const $table = Ux.clone(table);
        $table.columns = Ux.configColumn(reference, table.columns);
        $table.pagination = false;
        $table.className = "ex-history";
        state.$table = $table;
        reference.setState(state);
    }
};
const yoAdjust = (reference) => {
    const {data = {}} = reference.props;
    const changes = U.isArray(data.items) ? data.items : [];
    const adjust = Ux.fromHoc(reference, "adjust");
    const processed = [];
    changes.forEach(each => {
        /* 根据 fieldName 读取 type */
        const $record = Ux.clone(each);
        if (adjust.hasOwnProperty(each['fieldName'])) {
            const adjustMap = adjust[each['fieldName']];
            const converted = adjustMap[each.type];
            if (converted) {
                $record.type = converted;
            }
        }
        processed.push($record);
    });
    return processed;
};
export default {
    yiPage,
    yoAdjust
}