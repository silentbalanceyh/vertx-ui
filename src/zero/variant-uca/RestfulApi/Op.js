import __Zn from '../zero.uca.dependency';

const onSearch = (reference) => (searchText) => {
    const {rxSource} = reference.props;
    if (__Zn.isFunction(rxSource)) {

        // reference.?etState({$loading: true, $selected: undefined})
        __Zn.of(reference).in({
            $selected: undefined
        }).loading(false).handle(() => {

            rxSource(searchText).then(($data = []) => {
                /* 前端备注 key */
                $data.forEach(__Zn.applyKey);

                __Zn.of(reference).in({
                    $data
                }).load().done();
                // reference.?etState({$loading: false, $data})
            })
        })
        // rxSource(searchText).then(($data = []) => {
        //     /* 前端备注 key */
        //     $data.forEach(__Zn.applyKey);
        //     reference.?etState({$loading: false, $data})
        // })
    } else {
        console.error("核心函数 rxSource 丢失！");
    }
}
export default {
    yiPage: (reference) => {
        const input = __Zn.fromHoc(reference, "input");
        const state = {};
        state.$button = input;
        /* 窗口配置 */
        const window = __Zn.fromHoc(reference, "window");
        state.$dialog = __Zn.configDialog(reference, window);
        /* _op */
        const op = __Zn.fromHoc(reference, "op");
        if (op && op.search) {
            op.search.onSearch = onSearch(reference);
        }
        state.$op = op;
        /* _table */
        const table = __Zn.fromHoc(reference, "table");
        const $table = __Zn.clone(table);
        $table.columns = __Zn.configColumn(reference, $table.columns);
        state.$table = $table;
        state.$data = [];
        __Zn.of(reference).in(state).ready().done();
        // reference.?etState(state);
        // state.$ready = true;
    },
    onClick: (reference) => (event) => {
        __Zn.prevent(event);
        __Zn.of(reference).open().done();
        // reference.?etState({$visible: true})
    },
    onSubmit: (reference) => (event) => {
        __Zn.prevent(event);
        const {$selected, $data = []} = reference.state;
        if ($selected) {
            const unique = __Zn.elementUnique($data, 'key', $selected);
            const {rxSubmit, config = {}} = reference.props;
            /*
             * optionJsx.config.linker 操作
             */
            const formValues = {};
            __Zn.writeLinker(formValues, config, () => unique);
            const ref = __Zn.onReference(reference, 1);
            if (!__Zn.isEmpty(formValues)) {
                __Zn.formHits(ref, formValues);
            }

            // if (__Zn.isFunction(rxSubmit)) {
            //     rxSubmit(unique);
            // }
            // reference.?etState({
            //     $visible: false,        // 显示窗口
            //     $selected: undefined,    // 选中清除
            //     $loading: false,         // 加载专用
            //     $data: []                // 数据处理
            // });
            __Zn.of(reference).in({
                // $visible: false,        // 显示窗口
                $selected: undefined,    // 选中清除
                // $loading: false,         // 加载专用
                $data: []                // 数据处理
            }).hide().load(false).handle(() => {

                if (__Zn.isFunction(rxSubmit)) {
                    rxSubmit(unique);
                }
            })
        } else {
            const {$op = {}} = reference.state;
            if ($op.submit) {
                const {empty} = $op.submit;
                __Zn.messageFailure(empty);
            }
        }
    },
    onRowSelect: (reference) => {
        return {
            type: "radio",
            onChange: (changeKey) => {
                if (1 === changeKey.length) {
                    const $selected = changeKey[0];
                    __Zn.of(reference).in({
                        $selected
                    }).done();
                    // reference.?etState({$selected});
                }
            }
        }
    },
    onSearch
}