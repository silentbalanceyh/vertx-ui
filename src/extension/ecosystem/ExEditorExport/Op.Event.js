import Ex from 'ex';
import {saveAs} from "file-saver";
import U from 'underscore';
import Ux from 'ux';

const rxExport = (reference) => (event) => {
    Ex.prevent(event);
    Ex.rx(reference).submitting();
    const {$selected = []} = Ex.state(reference);
    const {config = {}} = reference.props;
    if (0 === $selected
        .filter(item => "key" !== item).length) {
        /*
         * 错误信息
         */
        Ex.showFailure(config);
        /*
         * rxSubmitting提交
         */
        Ex.rx(reference).submitting(false);
    } else {
        const {rxExport} = reference.props;
        if (U.isFunction(rxExport)) {
            /*
             * 按钮专用提交函数
             */
            const params = {
                columns: $selected,
                format: 'xlsx',     // 暂时的默认格式
            };
            rxExport(params).then(response => {
                /*
                 * 下载保存文件
                 */
                saveAs(response, `${Ux.randomUUID()}.${params.format}`);
                Ux.toLoading(() => {
                    /*
                     * rxSubmitting提交修正
                     */
                    Ex.rx(reference).submitting(false);
                    /*
                     * 关闭窗口，并且设置 $columnsMy
                     * （窗口引用处理）
                     */
                    Ex.rx(reference).close();
                    /*
                     * 消息提示
                     */
                    const {config = {}} = reference.props;
                    Ex.showSuccess(config);
                })
            }).catch(error => {
                console.error(error);
            })
        } else {
            throw new Error("[ Ex ] 核心函数丢失：rxExport ");
        }
    }
};
export default {
    rxExport
}