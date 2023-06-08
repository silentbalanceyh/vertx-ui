import Ux from "ux";

const yoUnSelected = (reference) => {
    const {$data = [], $selected = []} =
        reference.state ? reference.state : {};
    const $keys = $selected.map(each => each.key);
    const {rxViewQ} = reference.props;
    let result = $data.filter(each => !$keys.includes(each.key));
    if (Ux.isFunction(rxViewQ)) {
        result = result.filter(rxViewQ);
    }
    return result;
};
const yoQuery = (reference, configuration = {}) => Ux.qrCommon(reference, {
    /*
     * 查询参数 $query
     * 1）默认 100 条（第一页，每一页100条）
     * 2）参数来源：$condition
     * - config.ajax.magic - 配置中的参数
     * - 搜索框的配置（带清空）
     * - 选择左边树（带清空）
     */
    query: {pager: {page: 1, size: 100}},
    ...configuration,
});
const onClean = (reference, original = {}) => (event) => {
    Ux.prevent(event);
    const state = {};
    state.$clean = undefined;
    /*
     * 重设成默认的 $query
     */
    const {config = {}} = reference.state;
    state.$query = yoQuery(reference, config);
    Ux.of(reference).in(state).done();
    // reference.?etState(state);
}
const onSearch = (reference, config = {}) => (inputText) => {
    const {$query = {}} = reference.state;
    const {condition = []} = config;
    const $condition = Ux.qrInput(condition, inputText);
    const query = Ux.qrCombine($query, reference, $condition);
    Ux.of(reference).in({$query: query}).done();
    // reference.?etState({$query: query});
}
const onSelection = (reference) => {
    const {$selected = []} = reference.state ? reference.state : {};
    return {
        onChange: Ux.rxCheckedRow(reference),
        selectedRowKeys: $selected.map(selected => selected.key),
        fixed: true,
    }
}
const onSubmit = (reference, config = {}) => (event) => {
    Ux.prevent(event);
    const {$selected = []} = reference.state ? reference.state : {};
    if (0 === $selected.length) {
        const {validation = ""} = config;
        if (validation) {
            Ux.messageFailure(validation)
        }
    } else {
        const {rxSubmit} = reference.props;
        if (Ux.isFunction(rxSubmit)) {
            rxSubmit($selected, reference);
        } else {
            console.error("缺乏核心函数：rxSubmit", rxSubmit);
        }
    }
}
const onRemove = (reference, item = {}) => (event) => {
    Ux.prevent(event);
    let {$selected = []} = reference.state ? reference.state : {};
    $selected = Ux.clone($selected);
    $selected = $selected.filter(each => each.key !== item.key);
    Ux.of(reference).in({$selected}).done();
    // reference.?etState({$selected});
}
const onRefresh = (reference) => {
    /*
     * 进入 loading 环节
     */
    // reference.?etState({$loading: true});
    Ux.of(reference).loading(false).handle(() => {
        const {config = {}} = reference.state;
        const ajax = config.ajax;
        if (ajax) {
            /*
             * 参数准备，处理参数基本信息
             */
            const $query = Ux.qrCommon(reference);
            return Ux.ajaxPost(ajax.uri, {
                $body: $query
            }).then(data => {
                Ux.of(reference).in({
                    $data: Ux.valueArray(data),
                }).load(false).done()
            });
        }
    })
}
const onSelect = (reference, selected = {}) => (text) => {
    const {$category = {}} = reference.state;
    if (Ux.isArray($category.data)) {
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
        Ux.of(reference).in(state).done();
    }
}
export default {
    onSearch,
    onSelection,
    onSubmit,
    onRemove,
    onRefresh,
    onSelect,
    onClean,
    yoUnSelected,
    yoQuery,
}