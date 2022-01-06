import React from 'react';
import Ex from "ex";
import Ux from "ux";
import ExForm from "../ExForm/UI";

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("FPaymentForm")
    .to()
)
class Component extends React.PureComponent {
    render() {
        const {$inited = {}} = this.props;
        const form = Ex.yoForm(this, null, $inited);
        return (
            <ExForm {...form}
                    $height={"300px"}
                    $op={{
                        $opSingle: (reference) => (params) => {
                            Ex.rx(reference).submitting();
                            const request = Ux.valueRequest(params);
                            const payment = Ux.clone(request);
                            request.payment = [payment];
                            request.finished = [payment.settlementId];
                            return Ux.ajaxPost("/api/payment/create", request)
                                .then(data => Ux.ajaxDialog(reference, {data, key: "single"}))
                                .then(response => Ex.rx(reference, false).close(response))
                                .catch(error => Ux.ajaxError(reference, error));
                        },
                        $opBatch: (reference) => (params) => {

                        }
                    }}/>
        )
    }
}

export default Component