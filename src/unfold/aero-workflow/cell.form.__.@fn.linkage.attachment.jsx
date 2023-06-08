import Ux from 'ux';

export default (ref) => (reference, jsx) => {
    // 附件部分
    const formValues = Ux.formGet(reference);
    // 登录人员和当前处理人
    const logged = Ux.isLogged();
    if ("INIT" !== formValues.phase && formValues.acceptedBy !== logged.key) {
        jsx.readOnly = true;
    }
    // 特殊删除处理
    jsx.rxRemove = (ref) => (item = {}) => {
        return logged.key === item.createdBy;
    }
    return Ux.aiFileBatch(reference, jsx);
}