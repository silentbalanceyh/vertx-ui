const ofRegion = (cssOptions = {}) => {
    const {
        paddingTop,
        paddingTop_ = 3,
        height,
    } = cssOptions;
    // 可见区域
    const $height = document.documentElement.clientHeight;
    const $paddingTop = $height / paddingTop_;
    const style = {};
    style.paddingTop = $paddingTop ? $paddingTop : paddingTop;
    style.height = height ? height : "100%";
    style.marginBottom = style.paddingTop;
    return style;
}
export default {
    ofRegion,
}