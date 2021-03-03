import Ex from 'ex';

const yoPage = (reference) => {
    const inherit = Ex.yoAmbient(reference);
    const {
        rxChannel           // 顶层事件专用函数
    } = reference.state;
    /*
     * 核心方法
     */
    inherit.rxChannel = rxChannel;
    /*
     * 特殊方法（打开和关闭的后期方法）
     */
    return inherit;
};
export default {
    yoPage
}