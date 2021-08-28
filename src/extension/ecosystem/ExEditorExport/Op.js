import Ex from 'ex';
import {saveAs} from "file-saver";
import Ux from 'ux';
import Plugin from 'plugin';

const rxExport = (reference) => (event) => {
    Ux.prevent(event);
    Ex.rx(reference).submitting();
    const {$selected = [], $combine, $filename} = reference.state;
    if (0 === $selected
        .filter(item => "key" !== item).length) {
        /*
         * 错误信息
         */
        Ux.messageFailure($combine);
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
            const params = {
                columns: $selected,
                format: 'xlsx',     // 暂时的默认格式
            };
            rxExport(params).then(response => {
                /*
                 * 下载保存文件
                 */
                let baseFile = `${Ux.valueNow('YYYY-MM-DD-HHmmss')}.${params.format}`;
                if (Plugin.Function && Ux.isFunction(Plugin.Function['yiPluginExport'])) {
                    baseFile = Plugin.Function['yiPluginExport'](reference, {
                        filename: baseFile
                    })
                } else {
                    if ($filename) {
                        baseFile = `${$filename}.${params.format}`;
                    }
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
                    Ux.messageSuccess($combine);
                })
            }).catch(error => {
                console.error(error);
            })
        } else {
            throw new Error("[ Ex ] 核心函数丢失：rxExport ");
        }
    }
};
const rxChange = (reference) => (targetKeys, direction, moveKeys = []) => {
    const {$selected = []} = reference.state;
    let selected = [];
    if ("right" === direction) {
        // 往右，直接追加，注意顺序
        selected = Ux.clone($selected);
        moveKeys.forEach(moveKey => selected.push(moveKey));
    } else {
        // 往左
        const $moved = Ux.immutable(moveKeys);
        $selected.forEach(each => {
            if (!$moved.contains(each)) {
                selected.push(each);
            }
        })
    }
    reference.setState({$selected: selected})
}
const rxInput = (reference) => (event) => {
    const value = Ux.ambEvent(event);
    reference.setState({$filename: value});
}
export default {
    rxExport,

    rxChange,
    rxInput
}