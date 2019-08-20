import Ux from 'ux';

const yoForm = (reference) => {
    // form 提取
    let form = Ux.fromHoc(reference, "form");
    if (!form) form = {};
    // ui 提取
    return Ux.raftUi(reference, form.ui);
};
const yoButton = (reference) => {
    const button = Ux.fromHoc(reference, "button");
    return {
        op: "$opLogin",
        text: button.login,
        type: "primary",
        htmlType: "submit",
    }
};
export default {
    yoForm,
    yoButton,
}