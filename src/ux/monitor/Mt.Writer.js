import Ux from "ux";

const connectMajor = (reference, data) => {
    if (Ux.Env.MONITOR) {
        const state = {};
        /**
         * 读取当前的view处理
         */
        state.key = data.tabs.activeKey;
        state.view = data.view;
        state.id = data.key;
        /**
         * Tab页专用
         */
        const item = Ux.elementUnique(data.tabs.items, "key", state.key);
        if (item) {
            state.text = item.tab;
            state.index = item.index;
        }
        /**
         * 记录专用
         */
        const {record} = reference.state;
        if (record) {
            state.record = record[state.key];
        }
        Ux.writeTree(reference, {
            "debug.active.form": state,
        });
    }
};
export default {
    connectMajor
}