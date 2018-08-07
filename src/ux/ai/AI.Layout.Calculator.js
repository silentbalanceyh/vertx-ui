import LayoutType from "./AI.Layout.Config";
import Log from "../Ux.Log";

const _FULL_OPTS = {
    style: {
        width: "100%"
    },
    labelCol: {
        span: 0
    },
    wrapperCol: {
        span: 24
    }
};
const _aiOptionItem = (item, key, config) => {
    let layoutType = null;
    let window = 1;
    let dft = false;
    if (config.layout) {
        layoutType = config.layout;
    } else {
        // 计算
        window = config.window ? config.window : 1;
        layoutType = LayoutType[window];
        if (!layoutType) {
            dft = true;
            layoutType = LayoutType[1];
        }
    }
    if (item.optionItem && item.optionItem.full) {
        // 全行处理
        item.optionItem = _FULL_OPTS;
    } else if (layoutType && layoutType.hasOwnProperty(key)) {
        const optionItem = layoutType[key];
        // 前边解析已处理掉了optionItem的赋值
        if (item.optionItem && 0 < Object.keys(item.optionItem).length) {
            if (!item.optionItem.style) item.optionItem.style = optionItem.style;
            if (!item.optionItem.labelCol) item.optionItem.labelCol = optionItem.labelCol;
            if (!item.optionItem.wrapperCol) item.optionItem.wrapperCol = optionItem.wrapperCol;
        } else {
            item.optionItem = optionItem;
        }
    }
    Log.render(4, {
        label: item.optionItem.label,
        key: key,
        layoutType: layoutType[key]
    }, {
        window, dft
    });
};
const calculateWindow = (config = {}) => {
    const window = config.window ? config.window : 1;
    let dft = !LayoutType[window];
    const metadata = dft ? LayoutType[1] : LayoutType[window];
    return {window, dft, metadata}
};
const calculateLayout = (item, layout = {}) => {
    const {cellIndex, columns} = layout;
    let key = null;
    let metadata = {};
    let window = {};
    if (item.optionItem && item.optionItem.full) {
        /**
         * 全行布局，没有label相关属性，直接占满整行信息
         **/
        item.optionItem = _FULL_OPTS;
    } else {
        window = calculateWindow(layout);
        const span = item.span ? item.span : layout.span;
        /**
         * span：当前组件所占宽度
         * columns：当前行总列数
         * cellIndex：当前组件所在的列索引
         */
        const spanKey = span < 10 ? `0${span}` : span;
        const key = `${columns}${cellIndex}${spanKey}`;
        console.info(key, window);
    }
    // 打印最终模板信息
    Log.render(4, {
        label: item.optionItem.label, key, layoutType: metadata[key]
    }, window);
};

export default {
    calculateLayout
}