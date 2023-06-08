import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;
const toHeight = (adjust = 0) => {
    const height = window.innerHeight;
    const width = document.body.clientWidth;
    /* 模拟过后的基础宽度 */
    /*
    * 计算头部宽度
    * 整个框架中唯一一个 ux-header 的元素，存在于
    * */
    const eleHeader = document.getElementById(Cv.K_UI.ELE_HEADER);
    // 基础高度（计算Header占用的基本高度
    let baseHeight;
    if (eleHeader) {
        /*
         * 直接根据 Header 计算
         * 整个系统中只有一个 __ELE_HEADER，存在于模板顶部
         */
        baseHeight = eleHeader.offsetHeight;
    } else {
        /*
         * 如果找不到，则根据分辨率来计算基础高度
         * 1024 x 768, 1009, 768
         * 1280 x 1024, 1265, 913
         * 1366 x 720, 1351, 720
         * 1440 x 900, 1440, 789
         * 1680 x 1050, 1665, 939
         * 1920 x 1080, 1920, 969
         * 1920 x 1200, 1905, 1066
         * 计算方法，width 有一个最大值不可突破，先区分分辨率的区域
         */
        if (width <= 1024) {
            console.error("您使用的分辨率过小，有可能会显示不正常！")
            /**
             * 1024 x 768
             */
            baseHeight = 32;
        } else if (1024 < width && width <= 1280) {
            /**
             * 1280 x 1024
             */
            baseHeight = 48;
        } else if (1280 < width && width <= 1366) {
            /*
             * 1366 x 720
             */
            baseHeight = 48;
        } else if (1366 < width && width <= 1440) {
            /*
             * 1440 x 900
             */
            baseHeight = 48;
        } else if (1440 < width && width <= 1680) {
            /*
             * 1680 x 1050
             */
            baseHeight = 56;
        } else if (1680 < width && width <= 1920) {
            /*
             * 1920 x 1080
             */
            baseHeight = 56;
        } else {
            /*
             * > 1920（高清）
             */
            baseHeight = 56;
        }
    }
    return (height - baseHeight - adjust);
};
const toHeightState = (adjust) => {
    const maxHeight = toHeight("number" === typeof adjust ? adjust : 0);
    const state = {};
    state.$heightStyle = {
        style: {
            maxHeight
        }
    }
    state.$heightValue = maxHeight;
    return state;
}
const toHeightStyle = (adjust = 0) => {
    const height = toHeight(adjust); // document.body.clientHeight;
    // console.log(height, window.innerHeight);
    return {
        minHeight: height,
        maxHeight: height
    }
}
const toX = (columns = []) => {
    let x = 0;
    columns.forEach(column => {
        if (column.hasOwnProperty('width')) {
            x += __Zn.valueInt(column.width, 144);
        } else {
            x += 200;
        }
    });
    return x;
};
const toGrid = (config = {}) => {
    const {grid = 3} = config;
    const style = {};
    switch (grid) {
        case 5:
            style.width = "20%";
            break;
        case 4:
            style.width = "25%";
            break;
        case 3:
            style.width = "33.33%";
            break;
        case 2:
            style.width = "50%";
            break;
        case 1:
            style.width = "100%";
            break;
        default: {
            console.error("[ Ux ] 暂时不支持该值：", grid);
            break;
        }
    }
    return style;
};
const toGridSpan = (columns = 4, index = 0) => {
    const attrs = {};
    if (1 === columns) {
        attrs.span = 24;
    } else if (2 === columns) {
        attrs.span = 12;
    } else if (3 === columns) {
        attrs.span = 8;
    } else if (4 === columns) {
        attrs.span = 6;
    } else if (5 === columns) {
        attrs.span = 4;
        if (0 < index) {
            attrs.offset = 1;
        }
    }
    return attrs;
}
export default {
    toX,
    toGrid,
    toGridSpan,
    toHeight,
    toHeightStyle,
    toHeightState,
}