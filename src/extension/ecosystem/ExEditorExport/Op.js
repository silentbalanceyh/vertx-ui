import {saveAs} from "file-saver";
import Ux from 'ux';
import Plugin from 'plugin';

const rxExport = (reference) => (event) => {
    const {rxExport} = reference.props;
    if (!Ux.isFunction(rxExport)) {
        throw new Error("[ Ex ] 核心函数丢失：rxExport ");
    }

    Ux.prevent(event);
    const {$selectedKeys = [], $combine, $filename} = reference.state;
    if (0 === $selectedKeys
        .filter(item => "key" !== item).length) {
        /*
         * 错误信息
         */
        Ux.messageFailure($combine);
    } else {
        Ux.of(reference)._.submitting().then(() => {
            /*
             * 按钮专用提交函数
             */
            const params = {
                columns: $selectedKeys,
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
                Ux.messageSuccess($combine);
                Ux.of(reference)._.closeAnd({}, {$spinning: false});
            }).catch((error = {}) => Ux.messageCatch(
                error,
                Ux.of(reference)._.closeAnd()
            ))
        })
    }
};
const rxInput = (reference) => (event) => {
    const value = Ux.ambEvent(event);
    Ux.of(reference).in({$filename: value}).done();
    // reference.?etState({$filename: value});
}
export default {
    rxExport,
    rxInput
}