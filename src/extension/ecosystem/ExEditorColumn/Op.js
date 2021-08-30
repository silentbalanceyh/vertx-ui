import Ux from 'ux';
import Ex from "ex";

const rxSave = (reference) => (event) => {
    Ux.prevent(event);
    Ex.rsSubmitting(reference)();
    /*
     * 列信息处理
     */
    const {$selectedKeys = [], $combine = {}} = reference.state;
    /*
     * 提取 rxColumnSave 函数
     */
    if (0 === $selectedKeys
        .filter(item => "key" !== item).length) {
        /*
         * 错误信息
         */
        Ux.messageFailure($combine);
        /*
         * 防重复提交
         */
        Ex.rsSubmitting(reference, false)();
    } else {
        /**
         * key为查询时必得的值
         */
        if (!$selectedKeys.includes("key")) {
            $selectedKeys.unshift("key");
        }
        const keys = Ux.immutable($selectedKeys);
        /*
         * 计算参数：projection = []
         * projection 是被过滤的不显示的列信息，这里属于反向运算
         */
        const {rxColumnSave} = reference.props;
        const {$columns = []} = $combine;
        const fullColumns = Ux.immutable($columns.map(column => column.dataIndex))
        /*
         * 正向语义
         * fullColumns 中被包含了的就是 item
         */
        const params = keys.filter(item => fullColumns.contains(item));

        if (Ux.isFunction(rxColumnSave)) {
            rxColumnSave(params)
                .then(response => {
                    /*
                     * $columnsMy 更新
                     */
                    const $response = Ux.immutable(response);
                    const $columnsMy = $response.filter(item => fullColumns.contains(item))
                    /*
                     * 防重复提交关闭
                     * （本层处理）
                     */
                    Ex.rsSubmitting(reference, false)();
                    /*
                     * 关闭窗口，并且设置 $columnsMy
                     * （窗口引用处理）
                     */
                    Ex.rx(reference).close();
                    /*
                     * 更新 $columnsMy，顶层引用
                     */
                    Ex.rx(reference).projection($columnsMy, {
                        $dirty: true,
                    });
                    /*
                     * 消息提示
                     */
                    Ux.messageSuccess($combine);
                })
                .catch(error => {
                    console.error(error);
                });
        } else {
            throw new Error("[ Ex ] 核心函数丢失：rxColumnSave ");
        }
    }
};
const rxReset = (reference) => (event) => {
    Ux.prevent(event);
    const {$combine = {}} = reference.state;
    const $selectedKeys = valueDefault($combine);
    reference.setState({$selectedKeys});
};
const valueDefault = ($combine = {}) => {
    const {$columnsMy} = $combine;
    if ($columnsMy) {
        return $columnsMy.filter(item => "key" !== item);
    } else {
        return [];
    }
}
const rxActive = (reference) => ($activeKey) => {
    reference.setState({$activeKey})
}
export default {
    valueDefault,
    rxActive,
    action: {
        rxReset,
        rxSave,
    }
}