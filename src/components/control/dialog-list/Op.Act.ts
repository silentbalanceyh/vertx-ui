import Ux from "ux";

const $opSave = (reference: any) => Ux.ai2Event(reference, (values, mockData) => {
    console.info("更新之前：", values);
    Ux.ajaxPut("/api/dept", values, mockData)
        .then(data => Ux.showDialog(reference, "edit", () => {
            console.info("更新之后：", data);
            reference.props.fnClose();
        }))
});
const $opAdd = (reference: any) => Ux.ai2Event(reference, (values, mockData) => {
    console.info("添加之前：", values);
    Ux.ajaxPost("/api/dept", values, mockData)
        .then(data => Ux.showDialog(reference, "add", () => {
            console.info("添加之后：", data);
            reference.props.fnClose();
        }))
});
export default {
    $opAdd,
    $opSave
}