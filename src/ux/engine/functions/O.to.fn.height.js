/**
 * ## 标准函数
 *
 * 根据修正宽度计算组件最大高度信息，按分辨率智能切换。
 *
 * @memberOf module:_to
 * @param {Number} adjust 修正高度值。
 * @returns {number} 返回最终计算的页面高度值。
 */
export default (adjust = 0) => {
    const height = document.body.clientHeight;
    const width = document.body.clientWidth;
    /* 模拟过后的基础宽度 */
    /*
    * 计算头部宽度
    * 整个框架中唯一一个 ux-header 的元素，存在于
    * */
    const eleHeader = document.getElementById("__ELE_HEADER");
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