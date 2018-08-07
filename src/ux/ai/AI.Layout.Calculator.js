import LayoutType from "./AI.Layout.Config";
import Log from "../Ux.Log";
import Value from '../Ux.Value';

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
const calcItem = (item = "", window = 1, adjustValue = 0) => {
    const splitted = item.split(',');
    const width = `${Value.valueInt(window * 100)}%`;
    const labelCol = Value.valueInt(splitted[0]);
    const wrapperCol = Value.valueInt(splitted[1]);
    const push = Value.valueInt(splitted[2]);
    const marginLeft = (adjustValue) ? adjustValue : 0;
    return {
        style: {
            width,
            marginLeft,
        },
        labelCol: {
            span: labelCol,
            push
        },
        wrapperCol: {
            span: wrapperCol,
            push
        }
    }
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
    if (!item.hasOwnProperty("optionItem")
        || (item.optionItem && !item.optionItem.hasOwnProperty("label"))) {
        /**
         * 全行布局，没有label相关属性，直接占满整行信息
         **/
        item.optionItem = _FULL_OPTS;
    } else {
        // Fix解决为空的配置
        if (!item.optionItem) item.optionItem = {};

        window = calculateWindow(layout);
        const span = item.span ? item.span : layout.span;
        /**
         * span：当前组件所占宽度
         * columns：当前行总列数
         * cellIndex：当前组件所在的列索引
         */
        const spanKey = span < 10 ? `0${span}` : span;
        key = `${columns}${cellIndex}${spanKey}`;
        const windowKey = window.window;
        if (LayoutType.span[windowKey]) {
            const layoutValue = LayoutType.span[windowKey];
            const layoutItem = layoutValue[key];
            if (layoutItem) {
                const adjust = LayoutType.adjust[windowKey];
                Object.assign(item.optionItem,
                    calcItem(layoutItem, windowKey, adjust ? adjust[key] : 0));
            }
        }
    }
    // 打印最终模板信息
    Log.render(4, {
        label: item.optionItem.label, key, layoutType: metadata[key]
    }, window);
};

export default {
    calculateLayout
}