// 导入当前目录
import DEF_LAYOUT from "./page.__.v.layout.definition";
import __Zn from './zero.module.dependency';
import {_Logger} from 'zo';
// 导入外层

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
    const adjustWidth = __Zn.valueInt(splitted[2]);
    if (adjustWidth) {
        width = `${adjustWidth}%`;
    } else {
        let percent = window * 100;
        // 特殊布局
        if (window <= 0.8 || 1 === window || 1.1 === window) {
            percent = 100;
        }
        width = `${__Zn.valueInt(percent)}%`;
    }
    const labelCol = __Zn.valueInt(splitted[0]);
    const wrapperCol = __Zn.valueInt(splitted[1]);
    let marginLeft = 0;
    let paddingLeft = 0;
    if ("string" === typeof adjustValue) {
        if (0 < adjustValue.indexOf(',')) {
            const adjustData = adjustValue.split(',');
            marginLeft = (adjustData[0]) ? adjustData[0] : 0;
            paddingLeft = (adjustData[1]) ? adjustData[0] : 0;
        } else {
            marginLeft = adjustValue ? adjustValue : 0;
        }
    }
    return {
        style: {
            width,
            marginLeft,
            paddingLeft
        },
        labelCol: {
            span: labelCol
        },
        wrapperCol: {
            span: wrapperCol
        }
    };
};
const calculateWindow = (config = {}) => {
    const window = config.window ? config.window : 1;
    let dft = !DEF_LAYOUT[window];
    const metadata = dft ? DEF_LAYOUT[1] : DEF_LAYOUT[window];
    return {window, dft, metadata};
};
const _isFull = (item) => {
    // 如果是按钮
    if ("$button" === item.field) {
        // 隐藏时Full
        return item.hidden;
    } else {
        // 不包含optionItem
        return !item.hasOwnProperty("optionItem")
            // 包含optionItem的话不包含label
            || (item.optionItem && !item.optionItem.hasOwnProperty("label"));
    }
};
const aiLayout = (item, layout = {}) => {
    const {cellIndex, columns} = layout;
    let key = null;
    let window = {};
    if (_isFull(item)) {
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
        if (DEF_LAYOUT[windowKey]) {
            // 读取布局数据
            const layoutValue = DEF_LAYOUT[windowKey].layout;
            const layoutItem = layoutValue[key];
            if (layoutItem) {
                // 读取偏移量
                const adjust = DEF_LAYOUT[windowKey].adjust;
                const calcData = calcItem(layoutItem, windowKey, adjust ? adjust[key] : 0);
                // 没有值的时候追加
                item.optionItem = __Zn.assign(item.optionItem, calcData, 2);
            }
        }
    }
    // 打印最终模板信息
    _Logger.render(4, {
        label: item.optionItem.label ? item.optionItem.label : "未设置",
        key, layoutType: layout
    }, window);
};

const aiLayoutItem = (window = 1, key) => {
    const layoutValue = DEF_LAYOUT[window].layout;
    const layoutItem = layoutValue[key];
    if (layoutItem) {
        const adjust = DEF_LAYOUT[window].adjust;
        return calcItem(layoutItem, window, adjust ? adjust[key] : 0);
    } else {
        return {};
    }
};

const aiLayoutAdjust = (window = 1) => {
    if (DEF_LAYOUT[window]) {
        return DEF_LAYOUT[window];
    }
};
export default {
    aiLayout,
    aiLayoutItem,
    aiLayoutAdjust,
};