import Ex from "ex";
import Ux from 'ux';

export default (reference) => {
    const {$batch = false} = reference.props;
    if ($batch) {
        /*
         * 批量才开启选择，如果没有批量则不需要选择操作
         */
        const {$selected = []} = reference.props;
        return {
            onChange: ($selected = []) => {
                const {$data = {}} = reference.state;
                /*
                 * 追加第二参
                 */
                const dataArray = Ux.isArray($data.list) ? $data.list : [];
                const $selectedKeys = Ux.immutable($selected);
                Ex.rx(reference).selected($selected,
                    dataArray.filter(item => $selectedKeys.contains(item.key)));
            },
            /* 受控处理（用于设置受控的情况）*/
            selectedRowKeys: $selected,
            /* 行特殊控制（是否可选择） */
            getCheckboxProps: (record = {}) => Ux.pluginSelection(reference, record)
        }
    }
}