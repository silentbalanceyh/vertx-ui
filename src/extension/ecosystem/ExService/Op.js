import Ux from "ux";

const yiPage = (ref) => {
    const form = Ux.fromHoc(ref, "form");
    const reference = Ux.onReference(ref, 1);
    const raft = Ux.configForm(form, {reference, id: "formService"});
    const state = {};
    state.$form = raft;
    state.$ready = true;
    ref.setState(state);
};
export default {
    yiPage
}