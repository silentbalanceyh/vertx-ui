import Ex from 'ex';
import Ux from "ux";

const rxChange = (reference) => (info = {}) => {
    // 改变专用处理
    reference.setState({$loading: false});
};
const rxBeforeUpload = (reference) => (file = {}) => {
    /*
     * 只能 Single 模式
     */
    const $fileList = [file];
    reference.setState({$fileList, $loading: true});
    return false;
};
const rxImport = (reference) => (event) => {
    Ux.prevent(event);
    /*
     * 提交专用处理
     */
    Ex.rx(reference).submitting();
    const {$fileList = [], $combine = {}} = reference.state;
    if (0 === $fileList.length) {
        /*
         * 错误信息
         */
        Ux.messageFailure($combine);
        /*
         * rxSubmitting提交
         */
        Ex.rx(reference).submitting(false);
    } else {
        /*
         * 按钮专用提交函数（参数构造）
         */
        const {rxImport, rxDirty} = reference.props;
        if (Ux.isFunction(rxImport)) {
            const file = $fileList[0];
            if (file) {
                rxImport(file).then(response => {
                    if (response) {
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
                             * 导入过后需要刷新界面
                             */
                            if (Ux.isFunction(rxDirty)) {
                                rxDirty();
                            }
                            /*
                             * 消息提示
                             */
                            Ux.messageSuccess($combine);
                        });
                    } else {
                        console.error("[ Ex ] 导入出错！！！")
                    }
                }).catch((error = {}) => Ux.messageCatch(error,
                    () => Ex.rx(reference).submitting(false))
                );
            }
        }
    }
};
const rxRemove = (reference) => (file) => {
    const {$fileList = []} = reference.state;
    const index = $fileList.indexOf(file);
    const newFileList = $fileList.slice();
    newFileList.splice(index, 1);
    reference.setState({$fileList: newFileList});
};
export default {
    rxImport,
    /*
     * 上传专用方法
     */
    rxRemove,
    rxChange,
    rxBeforeUpload
}