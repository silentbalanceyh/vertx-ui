import __Zn from '../zero.uca.dependency';

export default {
    /* 生命周期 constructor */
    yoValue: (reference, jsx = {}) => {
        const inputAttrs = __Zn.yoLimit(jsx);
        if (undefined === inputAttrs.value) {
            /*
             * 只有 undefined 的时候触发
             */
            const {$defaultValue} = reference.state;
            if ($defaultValue) {
                inputAttrs.value = $defaultValue;
            }
        }
        return inputAttrs;
    },
    yiDefault: (reference = {}) => {
        const {config = {}} = reference.props;

        /*
         * 各部分组件配置处理
         */
        const dialog = __Zn.xtDialogConfig(reference, config);
        const onClick = __Zn.xtDialogClick(reference, config);

        const search = __Zn.xtSearchConfig(reference, config);
        // 通用表格方法
        const table = __Zn.xtTableConfig(reference, config);
        const attrs = {
            onClick, dialog, $ready: true,
            table, search
        };
        return {
            ...attrs,
            $visible: false,
            $loading: false,
            $data: [],
            $keySet: undefined,
        };
    },
    yoPager: __Zn.xtTablePager,
    yoCombine: __Zn.xtDialogCombine,
    yoSelected: (reference, table = {}) => {
        const {$keySet} = reference.state;
        if (table.rowSelection) {
            if ($keySet) {
                table.rowSelection.selectedRowKeys = [$keySet.key];
            } else {
                table.rowSelection.selectedRowKeys = [];
            }
        }
        return table;
    }
};