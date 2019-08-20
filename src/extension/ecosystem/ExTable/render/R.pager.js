import Ex from 'ex';
import Ux from 'ux';
import renderTotal from './R.total.jsx';

const _initTotal = (reference) => (total) => {
    const {$table = {}} = Ex.state(reference);
    if ($table.total) {
        const {$selected = []} = reference.props;
        const {$query = {}} = Ex.state(reference);
        const {pager = {}} = $query;
        /*
         * 除尽的情况
         */
        let page = 0;
        if (0 === total % pager.size) {
            page = Ux.valueInt(total / pager.size);
        } else {
            page = Ux.valueInt(total / pager.size) + 1;
        }
        const {report, selected} = $table.total;
        const reportJsx = Ux.formatExpr(report, {total, page});
        const selectJsx = Ux.formatExpr(selected, {count: $selected.length});
        return renderTotal({selected, reportJsx, selectJsx});
    }
    return false;
};

export default (reference, data = {}) => {
    const {$query = {}} = Ex.state(reference);
    const {pager = {}} = $query;
    return {
        showSizeChanger: true,
        showQuickJumper: true,

        size: "small",
        pageSize: pager.size,

        total: data.count,
        showTotal: _initTotal(reference)
    };
}