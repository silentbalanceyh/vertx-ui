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
/**
 *
 * @param item
 * @param id
 */
const writePointer = (item = {}, id) => {
    if (Ux.Env.MONITOR) {
        const key = Ux.Env.KEY_POINTER;
        let data = Ux.Session.get(key);
        if (!data) data = {};
        // 单个按钮
        if (item.key) {
            const single = {};
            single.id = item.id;
            single.key = item.key;
            single.text = item.text;
            single.icon = item.icon;
            single.to = id;
            data[single.key] = single;
            // 存储到当前Session中
            Ux.Session.put(key, data);
        }
    }
};
const earsePointer = () => {
    if (Ux.Env.MONITOR) {
        const key = Ux.Env.KEY_POINTER;
        // 存储到当前Session中
        Ux.Session.remove(key);
    }
};
export default {
    connectMajor,
    writePointer,
    earsePointer
}