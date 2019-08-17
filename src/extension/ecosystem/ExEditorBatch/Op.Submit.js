import Ex from 'ex';
import Ux from 'ux';

export default (reference) => (event) => {
    Ex.prevent(event);
    const {$data = []} = Ex.state(reference);
    const {$selected = [], config = {}} = reference.props;
    /*
     * 验证是否完整
     */
    const validated = $data
        .filter(item => !!item.name)
        .filter(item => !!item.value).length;
    if ($data.length === validated) {
        if (0 < $selected.length) {
            /*
             * 构造批量更新的数据
             */
            const records = [];
            $selected.forEach(key => {
                const record = {};
                record.key = key;
                $data.forEach(field => record[field.name] = field.value);
                records.push(record);
            });
            /*
             * 提交处理
             */
            Ex.rx(reference).submitting();
            /*
             * 调用外层的 rxBatchEdit 函数
             */
            Ux.toLoading(() => Ex.rx(reference).batchEdit(records)
                .then(() => {
                    /*
                     * 成功消息
                     */
                    Ex.showSuccess(config);
                    /*
                     * 关闭窗口
                     */
                    Ex.rx(reference).close();
                })
            )
        } else {
            console.error("[ Ex ] 运行时错误，$selected 为空！");
        }
    } else {
        Ex.showFailure(config);
    }
}