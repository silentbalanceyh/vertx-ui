import Ux from 'ux';
import U from 'underscore';

export default (reference, selected = {}) => (text) => {
    const {$category = {}} = reference.state;
    if (U.isArray($category.data)) {
        const selectedKey = Ux.treeParentAllIn(text, $category.data, "parentId");
        const $filters = {};
        /*
         * 合并查询条件，要考虑删除的情况
         */
        const {condition = {}, clean} = selected;
        Object.keys(condition).map(Number)
            .filter(item => !isNaN(item)).forEach(index => {
            const value = selectedKey[index];
            if (value) {
                $filters[condition[index]] = value;
            } else {
                $filters[condition[index]] = "__DELETE__";
            }
        });
        $filters[""] = true;
        /*
         * $query
         */
        const {$query, $path = {}} = reference.state;
        const original = Ux.clone($query);
        const query = Ux.qrCombine($query, reference, $filters);
        /*
         * 构造 $clean 变量用于清空类型
         */
        const state = {};
        state.$query = query;
        if (clean) {
            let value = text.map(key => $path[key])
                .filter(item => undefined !== item);
            if (0 < value.length) {
                if (1 < value.length) {
                    value = value.join(', ');
                } else {
                    value = value[0];
                }
            }
            state.$clean = {
                label: Ux.formatExpr(clean, {value}),
                query: original,
            }
        }
        reference.setState(state);
    }
}