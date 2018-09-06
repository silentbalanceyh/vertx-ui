import Ux from "ux";

const connectOp = (reference, from, to) => {
    if (Ux.Env.NODE_ENV === "development") {

    }
};
const connectForm = (reference, data) => {
    if (Ux.Env.NODE_ENV === "development") {
        console.info(data, reference.props);
    }
};
const connectTab = (reference, data) => {
    if (Ux.Env.NODE_ENV === "development") {
        const state = {};
        state.view = data.view;
        if (data.key) state.key = data.key;
        Ux.writeTree(reference, {
            "debug.active": state
        })
    }
};
export default {
    connectOp,
    connectForm,
    connectTab
}