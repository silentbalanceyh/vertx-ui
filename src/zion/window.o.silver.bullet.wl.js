import __Rx from './window.fn.rx.event';
import __PT from './page.fn.to.rect';
import __Zn from './zero.module.dependency';

const Cv = __Zn.Env;

const wl = (reference) => ({
    // 添加 resize 专用
    add: (adjust) => window.addEventListener("resize", __Rx.rxResize(reference, adjust)),
    // 更新 maxHeight 生成新的状态
    update: (adjust) => {
        // 读取 $heightStyle / $heightValue
        let stateRef = reference.state ? reference.state : {};
        if (!stateRef.hasOwnProperty(Cv.K_NAME.HEIGHT_STYLE)) {
            stateRef = __PT.toHeightState(adjust);
        }
        let {$heightStyle = {}} = stateRef;
        // 读取 resize 之前原始存储的 maxHeight
        const {style = {}} = $heightStyle;
        const updatedRef = {$heightStyle: {}};
        const $style = {};
        if (style.maxHeight) {
            $style.maxHeight = style.maxHeight + adjust;
            updatedRef.$heightStyle.style = $style;
            updatedRef.$heightValue = $style.maxHeight;
        }
        return updatedRef;
    },
    // 添加 remove
    remove: (adjust) => window.removeEventListener("resize", __Rx.rxResize(reference, adjust)),
    // 直接转成状态
    init: __PT.toHeightState,
});

export default {
    wl,
}