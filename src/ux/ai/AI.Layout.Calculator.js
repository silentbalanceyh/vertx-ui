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
    let width = 100;
    const adjustWidth = Value.valueInt(splitted[2]);
    if (adjustWidth) {
        width = `${adjustWidth}%`;
    } else {
        let percent = window * 100;
        // 特殊布局
        if (window <= 0.5) {
            percent = 100;
        }
        width = `${Value.valueInt(percent)}%`;
    }
    const labelCol = Value.valueInt(splitted[0]);
    const wrapperCol = Value.valueInt(splitted[1]);
    const marginLeft = (adjustValue) ? adjustValue : 0;
    return {
        style: {
            width,
            marginLeft,
        },
        labelCol: {
            span: labelCol
        },
        wrapperCol: {
            span: wrapperCol
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
        if (LayoutType[windowKey]) {
            // 读取布局数据
            const layoutValue = LayoutType[windowKey].layout;
            const layoutItem = layoutValue[key];
            if (layoutItem) {
                // 读取偏移量
                const adjust = LayoutType[windowKey].adjust;
                const calcData = calcItem(layoutItem, windowKey, adjust ? adjust[key] : 0);
                // 没有值的时候追加
                item.optionItem = Value.assign(item.optionItem, calcData, 2);
            }
        }
    }
    // 打印最终模板信息
    Log.render(4, {
        label: item.optionItem.label, key, layoutType: metadata[key]
    }, window);
};

const calculateItem = (window = 1, key) => {
    const layoutValue = LayoutType[window].layout;
    const layoutItem = layoutValue[key];
    if (layoutItem) {
        const adjust = LayoutType[window].adjust;
        return calcItem(layoutItem, window, adjust ? adjust[key] : 0);
    } else {
        return {};
    }
};

export default {
    calculateLayout,
    calculateItem
}