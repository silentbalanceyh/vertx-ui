import Ux from "ux";

const connectMajor = (reference, data) => {
    if (Ux.Env.NODE_ENV === "development") {
        const state = {};
        state.view = data.view;
        if (data.key) state.key = data.key;
        console.info(reference.state);
        Ux.writeTree(reference, {
            "debug.active": state
        })
    }
};
export default {
    connectMajor
}