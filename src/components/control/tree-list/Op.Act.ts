import Ux from 'ux';

/**
 * 主表单中的提交数据（保存专用）
 * @param reference
 */
const $opSave = (reference: any) => Ux.ai2Event(reference,
    (values, mockData) => Ux.ajaxPut("/api/dept", values, mockData)
        .then(data => Ux.showDialog(reference, "edit", () => {
            console.info("更新成功：", data);
            // 关闭Tab页专用方法，调用fnClose
            reference.props.fnClose();
        })));
/**
 * 主表单中的提交数据（添加专用）
 * @param reference
 */
const $opAdd = (reference: any) => Ux.ai2Event(reference,
    (values, mockData) => Ux.ajaxPost("/api/dept", values, mockData)
        .then(data => Ux.showDialog(reference, "add", () => {
            console.info("添加成功：", data);
            // 关闭Tab页专用方法，调用fnClose
            reference.props.fnClose();
        })));
/**
 * 主表单中的重置数据（重置专用）
 * @param reference
 */
const $opReset = (reference: any) => (event: any) => {
    event.preventDefault();
    Ux.formReset(reference);
};

export default {
    $opSave,
    $opReset,
    $opAdd
}