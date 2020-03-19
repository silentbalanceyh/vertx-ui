import Ux from "ux";
import Cv from './O.constant'

export default (reference) => {
    return {
        /* 禁用缩放功能，minZoom/maxZoom 全部设置成1 */
        minZoom: 1,
        maxZoom: 1,
        /* 高度设置 */
        height: Ux.toHeight(146),
        /* 开启动画 */
        animate: true,
        defaultNode: {
            shape: Cv.SHAPE
        }
    }
};