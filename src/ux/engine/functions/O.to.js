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
    const style = {};
    const height = document.body.clientHeight;
    style.maxHeight = height - adjust;
    style.overflow = "auto";
    return style;
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