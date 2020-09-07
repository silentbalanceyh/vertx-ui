import To from './O.to';
import Rx from './O.rx';

export default {
    ltrResize: (reference) => ({
        // 添加 resize 专用
        add: (adjust) => window.addEventListener("resize", Rx.rxResize(reference, adjust)),
        // 更新 maxHeight 生成新的状态
        update: (adjust) => {
            // 读取 $heightStyle / $heightValue
            let stateRef = reference.state ? reference.state : {};
            if (!stateRef.hasOwnProperty("$heightStyle")) {
                stateRef = To.toHeightState(adjust);
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
        remove: (adjust) => window.removeEventListener("resize", Rx.rxResize(reference, adjust)),
        // 直接转成状态
        init: To.toHeightState,
    })
}