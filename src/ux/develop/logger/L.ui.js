import Cv from '../../constant';

const layout = (layoutType = {}, window, dft = true) => {
    if (Cv.DEBUG) {
        let message = `%c 「Zero」 [Layout] Layout Selector： label = ${layoutType.label}, key = ${layoutType.key}`;
        console.groupCollapsed(message, "color:#7c8577;font-weight:900");
        console.log(`%c 「Zero」 Window Parameter:`, "color:#006c54", window);
        console.log(`%c 「Zero」 Layout Object information:`, "color:#769149", layoutType);
        console.log(`%c 「Zero」 Layout Revert to default? default = `, dft ? "color:red" : "color:#d96c3", dft);
        console.groupEnd();
    }
};
const render = (phase = 1, item = {}, key = {}) => {
    if (Cv.DEBUG && Cv.DEBUG_FORM) {
        if (5 === phase) {
            // 开始打印
            const message = `%c 「Zero」 [Render] Row Config --> ${key}`;
            console.log(message, "color:#39f;font-weight:900", item);
        } else if (4 === phase) {
            // 打印模板
            layout(item, key.window, key.dft);
        } else if (3 === phase) {
            // 关闭
            console.groupEnd();
        } else if (2 === phase) {
            // 打印字段
            if (item.optionItem) {
                const mode = key ? `"Jsx"` : `"Hoc"`;
                const message = `%c 「Zero」 [Render] (${mode}) name="${item.field}", label="${item.optionItem.label}"`;
                console.groupCollapsed(message, `color:#333;font-weight:900`);
                console.log(`%c 「Zero」 Render mode: `, "color:#0c0", mode);
                console.log(`%c 「Zero」 Field optionItem: `, "color:#06c", item.optionItem);
                console.log(`%c 「Zero」 Field optionJsx：`, "color:#660", item.optionJsx);
                console.groupEnd();
            }
        } else {
            // 开始打印
            const message = `%c 「Zero」 [Render] Form configuration --> ${key}`;
            console.groupCollapsed(message, "color:#0066CC;font-weight:900", item);
        }
    }
};
export default {
    render,
    layout,
}