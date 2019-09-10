import Cv from "../../constant";

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
const toHeight = (adjust = 0) => {
    const height = document.body.clientHeight;
    const width = document.body.clientWidth;
    let maxHeight = height;
    if (1400 < width && width < 1900) {
        maxHeight = height - 48 - adjust;
    } else if (1900 < width) {
        maxHeight = height - 56 - adjust;
    }
    return maxHeight;
};

const toCss = (name) => `${Cv['CSS_PREFIX']}-${name}`;

const toMessage = (content, error = false) => {
    if (content) {
        const config = {};
        config.modal = {};
        if (error) {
            config.modal.error = {content};
        } else {
            config.modal.success = {content};
        }
        return config;
    }
};
export default {
    toHeight,
    toGrid,
    toMessage,
    /* 根据 CSS_PREFIX 前缀计算的 Class */
    toCss,
}