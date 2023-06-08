import __Zs from 'zs';

/**
 * 「标准」`Ux.uiTitle`
 *
 * @memberOf module:ui/zest
 * @param reference
 * @param fnJsx
 * @param configKey
 * @returns {*|boolean}
 */
const uiTitle = (reference, fnJsx, configKey = "page") =>
    __Zs.uiTitle(reference, fnJsx, configKey);
/**
 * 「标准」`Ux.uiButton`
 *
 * @memberOf module:ui/zest
 * @param actions
 * @param executor
 * @param reference
 * @returns {*}
 */
const uiButton = (actions, executor = {}, reference) =>
    __Zs.uiButton(actions, executor, reference);
/**
 * 「标准」`Ux.uiModal`
 *
 *
 * @memberOf module:ui/zest
 * @param config
 * @param fnChild
 * @param reference
 * @returns {*}
 */
const uiModal = (config = {}, fnChild, reference) =>
    __Zs.uiModal(config, fnChild, reference);
/**
 * 「标准」`Ux.uiQrSearch`
 *
 * @memberOf module:ui/zest
 * @param search
 * @param reference
 * @param rxQuery
 * @returns {*}
 */
const uiQrSearch = (search = {}, reference, rxQuery) =>
    __Zs.uiQrSearch(search, reference, rxQuery);
/**
 * 「标准」`Ux.uiQrRange`
 *
 * @memberOf module:ui/zest
 * @param range
 * @param reference
 * @param rxQuery
 * @returns {*}
 */
const uiQrRange = (range = {}, reference, rxQuery) =>
    __Zs.uiQrRange(range, reference, rxQuery);
/*
 * 快速开发专用
 * - ui：返回 jsx
 * - uiQr：搜索专用组件快速开发
 */
export default {
    // 「搜索」UI系列方法
    uiQrSearch,
    uiQrRange,

    // ui系列方法（快速处理）
    uiButton,
    uiModal,
    uiTitle,
}