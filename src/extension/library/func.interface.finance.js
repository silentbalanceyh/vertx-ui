import __Zu from 'zet';
import __Zp from 'zep';

export default {
    /**
     * ## 「标准」`Ex.inSettlement`
     *
     * @memberOf module:in/utter
     * @param data
     * @returns {*}
     */
    inSettlement: (data = {}) =>
        __Zu.inSettlement(data),
    // 退款 / 应收初始化
    inDebt: (reference, $inited = {}, debt = true) =>
        __Zp.yoDebt(reference, $inited, debt),
    /**
     * ## 「通道」`Ex.yoDebt`
     * @memberOf module:yo/upper
     * @param reference
     * @param $inited
     * @param debt
     * @return {*}
     */
    yoDebt: (reference, $inited = {}, debt = true) =>
        __Zp.yoDebt(reference, $inited, debt),
}