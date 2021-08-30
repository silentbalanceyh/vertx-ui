import Ex from "ex";
import Ux from 'ux';

const $opViewPAdd = (reference) => (params) => {
    if (Ux.isEmpty(params.projection)) {
        Ux.sexDialog(reference, "projection", () => {
            reference.setState(Ux.turnOff())
        });
    } else {
        Ex.rx(reference).submitting();
        if (!params.projection.includes("key")) {
            params.projection.unshift("key");
        }
        /*
         * title
         * name
         * criteria
         * projection
         *
         * Action
         * uri
         * method
         */
        const {$parameters = {}} = reference.props;
        const request = Object.assign({}, params, $parameters);
        Ux.ajaxPost("/api/view-p", request).then(response => {
            /*
             * 提交和窗口关闭
             */
            Ux.sexDialog(reference, "created", {
                ...response,
                ok: () => Ex.rx(reference).close(true, Ux.turnOff())
            });
        })
    }
}
const $opViewPSave = (reference) => (params) => {
    if (Ux.isEmpty(params.projection)) {
        Ux.sexDialog(reference, "projection", () => {
            reference.setState(Ux.turnOff())
        });
    } else {
        Ex.rx(reference).submitting();
        const request = Object.assign({}, params);
        Ux.ajaxPut("/api/view-p/:key", request).then(response => {
            Ux.sexDialog(reference, "updated", {
                ...response,
                ok: () => Ex.rx(reference).close(true, Ux.turnOff())
            });
        })
    }
}
export default {
    $opViewPAdd,
    $opViewPSave,
}