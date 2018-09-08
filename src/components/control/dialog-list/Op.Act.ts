import Ux from "ux";

const $opSave = (reference: any) => Ux.ai2Event(reference, (values, mockData) => {
    Ux.ajaxPut("/api/dept", values, mockData)
        .then(data => Ux.showDialog(reference, "edit", () => {
            console.info("更新成功：", data);
            reference.props.fnClose();
        }))
});
const $opAdd = (reference: any) => Ux.ai2Event(reference, (values, mockData) => {
    Ux.ajaxPost("/api/dept", values, mockData)
        .then(data => Ux.showDialog(reference, "add", () => {
            console.info("添加成功：", data);
            reference.props.fnClose();
        }))
});
export default {
    $opAdd,
    $opSave
}