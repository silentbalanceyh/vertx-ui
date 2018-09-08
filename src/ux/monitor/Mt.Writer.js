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
        // 窗口专用
        if (item.onOk) {
            // 窗口连接
            const single = {};
            single.id = "Dialog:" + item.title;
            single.key = "Dialog:" + item.title;
            single.text = item.okText;
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
const connectSubmit = (reference, data, major = true) => {
    if (Ux.Env.MONITOR) {
        if (major) {
            Ux.writeTree(reference, {
                "debug.active.major": data,
            })
        } else {
            Ux.writeTree(reference, {
                "debug.active.sub": data,
            })
        }
    }
};
const connectDialog = (reference, data) => {
    if (Ux.Env.MONITOR) {
        const state = {};
        // 处理editKey
        state.key = data.editKey;
        state.connectKey = data.connectKey;
        state.show = data.show;
        // 链接
        Ux.writeTree(reference, {
            "debug.active.dialog": state,
        });
    }
};
export default {
    // 监控主表单
    connectMajor,
    // 监控窗口
    connectDialog,
    // 监控提交数据
    connectSubmit,
    // Pointer处理
    writePointer,
    earsePointer
}