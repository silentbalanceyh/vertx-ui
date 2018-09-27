import Ux from "ux";

const $opSave = (reference: any) => Ux.ai2Event(reference, (values, mockData) =>
    Ux.ajaxPut("/api/dept", values, mockData)
        .then(data => Ux.showDialog(reference, "edit", () =>
            Ux.rxAct(reference).response(data).close().to()
        )));

const $opAdd = (reference: any) => Ux.ai2Event(reference, (values, mockData) =>
    Ux.ajaxPost("/api/dept", values, mockData)
        .then(data => Ux.showDialog(reference, "add", () =>
            Ux.rxAct(reference).response(data).close().to())));

export default {
    $opAdd,
    $opSave
}