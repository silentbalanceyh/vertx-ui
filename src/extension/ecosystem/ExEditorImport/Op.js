import Ux from "ux";

const rxChange = (reference) => (info = {}) => {
    // 改变专用处理
    Ux.of(reference).load().done()
    // reference.?etState({$loading: false});
};
const rxBeforeUpload = (reference) => (file = {}) => {
    /*
     * 只能 Single 模式
     */
    const $fileList = [file];
    Ux.of(reference).in({
        $fileList
    }).loading(false).done();
    // reference.?etState({$fileList, $loading: true});
    return false;
};
const rxImport = (reference) => (event) => {

    const {rxImport} = reference.props;
    if (!Ux.isFunction(rxImport)) {
        throw new Error("[ Ex ] 核心函数丢失：rxImport ");
    }

    Ux.prevent(event);
    /*
     * 提交专用处理
     */
    const {$fileList = [], $combine = {}} = reference.state;
    if (0 === $fileList.length) {
        /*
         * 错误信息
         */
        Ux.messageFailure($combine);
    } else {
        Ux.of(reference)._.submitting({$stop: true}).then(() => {
            const file = $fileList[0];
            if (file) {
                rxImport(file).then(response => {
                    if (response) {
                        Ux.messageSuccess($combine);

                        return Ux.promise(response);
                    } else {
                        return Ux.promise();
                    }
                }).then((nil) => {

                    return Ux.of(reference)._.submitted({$stop: true});
                }).then((nil) => {

                    return Ux.of(reference)._.closeAnd({}, {$loading: true});
                }).catch((error = {}) => Ux.messageCatch(
                    error,
                    () => Ux.of(reference)._.submitted({$stop: true})
                ));
            }
        })
    }
};
const rxRemove = (reference) => (file) => {
    const {$fileList = []} = reference.state;
    const index = $fileList.indexOf(file);
    const newFileList = $fileList.slice();
    newFileList.splice(index, 1);
    Ux.of(reference).in({
        $fileList: newFileList
    }).done();
    // reference.?etState({$fileList: newFileList});
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