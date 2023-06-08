import Ux from "ux";

export default {
    rxDelete: (reference, item) => (event) => {
        Ux.prevent(event);
        // 成功执行
        const {value = {}} = reference.props;
        const $value = Ux.clone(value);
        if ($value.hasOwnProperty(item.fieldCond)) {
            // Fix: https://gitee.com/silentbalanceyh/vertx-zero-scaffold/issues/I6VQX3
            $value[item.fieldCond] = Ux.Env.CV_DELETE;
            // delete $value[item.fieldCond]; //  = Ux.Env.CV_DELETE;
        }
        Ux.fn(reference).onChange($value);
    },
    rxActive: (reference) => ($activeKey) => {
        Ux.of(reference).in({$activeKey}).done()
    }
}