import Ex from 'ex';
import {saveAs} from "file-saver";
import Ux from 'ux';
import Plugin from 'plugin';

const rxExport = (reference) => (event) => {
    Ux.prevent(event);
    Ex.rx(reference).submitting();
    const {$selected = []} = reference.state;
    const {config = {}} = reference.props;
    if (0 === $selected
        .filter(item => "key" !== item).length) {
        /*
         * 错误信息
         */
        Ux.messageFailure(config);
        /*
         * rxSubmitting提交
         */
        Ex.rx(reference).submitting(false);
    } else {
        const {rxExport} = reference.props;
        if (Ux.isFunction(rxExport)) {
            /*
             * 按钮专用提交函数
             */
            if (!$selected.includes("key")) {
                $selected.unshift("key");
            }
            const params = {
                columns: $selected,
                format: 'xlsx',     // 暂时的默认格式
            };
            rxExport(params).then(response => {
                /*
                 * 下载保存文件
                 */
                let baseFile = `${Ux.valueNow('YYYY-MM-DD-HHmmss')}.${params.format}`
                if (Plugin.Function && Ux.isFunction(Plugin.Function.yiPluginExport)) {
                    baseFile = Plugin.Function.yiPluginExport(reference, {
                        filename: baseFile
                    })
                }
                saveAs(response, baseFile);
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
                    Ux.messageSuccess(config);
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