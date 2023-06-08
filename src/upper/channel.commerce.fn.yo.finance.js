import Ux from 'ux';
import __Zn from './zero.module.dependency';

const yoDebt = (reference, $inited = {}, debt = true) => {
    const inherit = __Zn.yoAmbient(reference);
    inherit.$synonym = Ux.fromHoc(reference, "synonym");
    const initValue = {};
    // 表单初始化
    initValue.ticketSerial = $inited.serial;              // 应收单/退款单 号
    initValue.payMethod = "Cash"                    // 默认方式现金
    initValue.payName = $inited['signName'];
    initValue.payMobile = $inited['signMobile'];
    initValue.settlementId = $inited.settlementId;  // 关联结算单

    const {payment = []} = $inited;
    let sum = 0;
    payment.forEach(item => sum += item.amount);
    if (debt) {
        // 应收
        initValue.amountRequired = $inited.amount;      // 总收款金额
        initValue.indent = "NUM.PAYMENT.DEBT";
        initValue.amountLeft = $inited.amount - sum;
        initValue.amount = $inited.amountLeft;          // 本次收款
    } else {
        // 退款
        initValue.amountRequired = Math.abs($inited.amount);      // 总收款金额
        initValue.indent = "NUM.PAYMENT.REFUND";
        initValue.amountLeft = Math.abs($inited.amount) - sum;
        initValue.amount = $inited.amountLeft;          // 本次退款
    }
    inherit.$inited = initValue;
    const $payment = Ux.isArray($inited.payment) ? Ux.clone($inited.payment) : [];
    inherit.$payment = $payment;
    inherit.rxClose = (response = {}) => {
        /*
         * 由于支持多个值，所以先要从 response 提取当前记录
         */
        const {$inited = {}} = reference.state;
        const data = response[$inited.key] ? response[$inited.key] : {};
        const state = {};
        state.$submitting = false;
        state.$visible = false;
        // 构造多个数据信息，此处会合并

        const {payment = []} = data;
        const paymentBefore = Ux.clone($payment);
        Ux.elementSave(paymentBefore, payment);
        // 小范围更新，防止错误导致界面白屏
        const combine = Ux.clone($inited);
        combine.payment = paymentBefore;
        combine.finished = data.finished;
        state.$inited = combine;
        Ux.of(reference).in(state).done();
        // reference.?etState(state);
        // state.$ready = true;
    }
    return inherit;
}
export default {
    yoDebt,
}