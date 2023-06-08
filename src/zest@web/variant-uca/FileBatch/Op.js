import __Zn from '../zero.uca.dependency';

const rxVCard = (reference) => (event) => {
    __Zn.prevent(event);
    __Zn.of(reference).in({
        $listType: __Zn.Env.TYPE_UPLOAD.CARD,
    }).done();
    // reference.?etState({$listType: "picture-card"});
}
const rxVList = (reference) => (event) => {
    __Zn.prevent(event);
    __Zn.of(reference).in({
        $listType: __Zn.Env.TYPE_UPLOAD.TEXT,
    }).done();
}
const rxVClean = (reference) => (event) => {
    __Zn.prevent(event);
    const {rxRemove} = reference.props;
    if (__Zn.isFunction(rxRemove)) {
        // Fix: https://e.gitee.com/szzw/issues/table?issue=I6VHGI
        const rx2Remove = rxRemove(reference);
        if (__Zn.isFunction(rx2Remove)) {
            let {fileList = []} = reference.state;
            fileList = __Zn.clone(fileList);
            fileList = fileList.filter(item => !rx2Remove(item));
            __Zn.of(reference).in({
                fileList
            }).handle(() => {
                const error = __Zn.fromHoc(reference, "error");
                __Zn.messageSuccess(error.success);
                __Zn.fn(reference).onChange(fileList);
            })
        }
    } else {
        // 放开权限做删除
        __Zn.of(reference).in({
            fileList: []
        }).handle(() => {

            __Zn.fn(reference).onChange([]);
        })
    }
    // __Zn.fn(reference).onChange([]);
    // reference.?etState({fileList: []});
}
// eslint-disable-next-line import/no-anonymous-default-export
export default {
    rxVCard,
    rxVList,
    rxVClean,
}