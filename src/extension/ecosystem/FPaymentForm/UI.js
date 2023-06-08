import React from 'react';
import Ex from "ex";
import Ux from "ux";
import ExForm from "../ExForm/UI";

const UCA_NAME = "FPaymentForm";
@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab(UCA_NAME)
    .to()
)
class Component extends React.PureComponent {
    displayName = UCA_NAME;
    render() {
        const {$inited = {}, $payment = []} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form}
                    $height={"300px"}
                    $op={{
                        $opSingle: (reference) => (params) => {
                            Ux.of(reference)._.submitting();
                            /*
                             * 请求数据构造，特殊结构
                             * {
                             *     "payment": []        // 支付方式，多种
                             *     "finished": []       // 执行的结算单号，如果存在多个则包含多个执行的结算单号
                             * }
                             */
                            const request = Ux.valueRequest(params);
                            const payment = Ux.clone(request);
                            const paymentA = Ux.clone($payment);
                            paymentA.push(payment);
                            request.payment = paymentA;
                            request.finished = paymentA.map(payment => payment.settlementId);// [payment.settlementId];
                            // debugger
                            if (parseInt(request.amount) === request.amountLeft || parseInt(request.amount) < request.amountLeft) {
                                return Ux.ajaxPost("/api/payment/create", request)
                                    .then(data => Ux.ajaxDialog(reference, {data, key: "single"}))
                                    .then(response => Ux.of(reference)._.close(response))
                                    .catch(error => Ux.ajaxError(reference, error));
                            }
                            if (request.amount > request.amountLeft || request.amount < 0) {
                                Ux.ajaxDialog(reference, {key: "defeated"})
                                    .then(response => Ux.of(reference)._.close(response))
                                    .catch(error => Ux.ajaxError(reference, error))

                            }
                        },
                        $opBatch: (reference) => (params) => {

                        }
                    }}/>
        )
    }
}

export default Component
