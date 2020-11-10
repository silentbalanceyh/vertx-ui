import Ix from '../../_internal/ix';
import Ux from "ux";

export default {
    /* 生命周期 constructor */
    yoValue: (reference, jsx = {}) => {
        const inputAttrs = Ux.valueLimit(jsx);
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
        const dialog = Ix.dialogConfig(reference, config);
        const onClick = Ix.dialogClick(reference, config);

        const search = Ix.searchConfig(reference, config);
        // 通用表格方法
        const table = Ix.tableConfig(reference, config);
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
    yoPager: Ix.tablePager,
    yoCombine: Ix.dialogCombine,
    yoSelected: (reference, table = {}) => {
        const {$keySet} = reference.state;
        if ($keySet) {
            const selectedRowKeys = [$keySet.key];
            if (table.rowSelection) {
                table.rowSelection.selectedRowKeys = selectedRowKeys;
            }
        }
        return table;
    }
};