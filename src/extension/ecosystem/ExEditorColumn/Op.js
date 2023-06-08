import Ux from 'ux';

const rxSave = (reference) => (event) => {

    const {rxMyViewV} = reference.props;
    if (!Ux.isFunction(rxMyViewV)) {
        throw new Error("[ Ex ] 核心函数丢失：rxMyViewV ");
    }
    Ux.prevent(event);
    /*
     * 列信息处理
     */
    let {$selectedKeys = [], $combine = {}} = reference.state;
    $selectedKeys = Ux.clone($selectedKeys);
    /*
     * 提取 rxMyViewV 函数
     */
    if (0 === $selectedKeys.filter(item => "key" !== item).length) {
        /*
         * 错误信息
         */
        Ux.messageFailure($combine);
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
        const {$columns = []} = $combine;
        const fullColumns = $columns.map(column => column.dataIndex);
        /*
         * 正向语义
         * fullColumns 中被包含了的就是 item
         */
        const params = keys.filter(item => fullColumns.includes(item));
        Ux.of(reference).submitting().future(() => {
            return rxMyViewV(params).then(response => {
                /*
                 * $columnsMy 更新
                 */
                const $response = Ux.immutable(response);
                const $columnsMy = $response.filter(item => fullColumns.includes(item))

                /*
                 * 消息提示
                 */
                Ux.messageSuccess($combine);

                /*
                 * 关闭窗口
                 */
                const _of = Ux.of(reference)._;
                _of.closeOnly();
                _of.qrV($columnsMy, {
                    $loading: true,
                })
                // Ex.?sSubmitting(reference, false)();
                // Ex.?x(reference).close();
            }).catch(error => {
                console.error(error);
            });
        })
    }
};
const rxReset = (reference) => (event) => {
    Ux.prevent(event);
    const {$combine = {}} = reference.state;
    const $selectedKeys = valueDefault($combine);
    Ux.of(reference).in({$selectedKeys}).done();
    // reference.?etState({$selectedKeys});
};
const valueDefault = ($combine = {}) => {
    const {$columnsMy} = $combine;
    if ($columnsMy) {
        const selected = $columnsMy.filter(item => "key" !== item);
        return Ux.clone(selected);
    } else {
        return [];
    }
}
const rxActive = (reference) => ($activeKey) => {
    Ux.of(reference).in({$activeKey}).done();
    // reference.?etState({$activeKey})
}
export default {
    valueDefault,
    rxActive,
    action: {
        rxReset,
        rxSave,
    }
}