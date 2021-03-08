import Ux from 'ux';
import Ex from "ex";

const rxSave = (reference) => (event) => {
    Ux.prevent(event);
    Ex.rsSubmitting(reference)();
    /*
     * 列信息处理
     */
    const {$selected = []} = reference.state;
    const {config = {}} = reference.props;
    /*
     * 提取 rxColumnSave 函数
     */
    if (0 === $selected
        .filter(item => "key" !== item).length) {
        /*
         * 错误信息
         */
        Ux.messageFailure(config);
        /*
         * 防重复提交
         */
        Ex.rsSubmitting(reference, false)();
    } else {
        /**
         * key为查询时必得的值
         */
        if (!$selected.includes("key")) {
            $selected.unshift("key");
        }
        const keys = Ux.immutable($selected);
        /*
         * 计算参数：projection = []
         * projection 是被过滤的不显示的列信息，这里属于反向运算
         */
        const {rxColumnSave} = reference.props;
        const {$columns = []} = config;
        const fullColumns = Ux.clone($columns)
            .map(column => column.dataIndex);
        /*
         * 正向语义
         * fullColumns 中被包含了的就是 item
         */
        const params = fullColumns.filter(item => keys.contains(item));

        if (Ux.isFunction(rxColumnSave)) {
            rxColumnSave(params)
                .then(response => {
                    /*
                     * $columnsMy 更新
                     */
                    const $response = Ux.immutable(response);
                    const $columnsMy = fullColumns
                        .filter(item => $response.contains(item));
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
                    const {config = {}} = reference.props;
                    Ux.messageSuccess(config);
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
    const {config = {}} = reference.props;
    const $selected = Ux.clone(config.$columnsMy);
    reference.setState({$selected});
};
export default {
    rxReset,
    rxSave,
}