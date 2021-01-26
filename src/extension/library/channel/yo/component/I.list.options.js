import Gb from '../../../functions';
import Ux from "ux";

export const Order = {
    "op.open": [
        "op.open.add",
        "op.open.filter"
    ],
    "op.batch": [
        "op.batch.edit",
        "op.batch.delete"
    ],
    "op.extra": [
        "op.extra.column",
        "op.extra.export",
        "op.extra.import"
    ],
    "op.add": [
        "op.submit.add",
        "op.submit.reset"
    ],
    "op.edit": [
        "op.submit.save",
        "op.submit.delete",
        "op.submit.reset"
    ]
}
export const Fn = Gb;
export const rxClose = (reference, item = {}, isAdd = true) => (data = {}, addOn = {}) => {
    const {options = {}} = reference.state;
    if (!data.key) {
        console.error("[ Ex ] 传入数据没有 key，tab 操作会失败，请检查数据：", data);
    }
    if (options[Fn.Opt.DYNAMIC_SWITCH] && isAdd) {
        Fn.rxTabEdit(reference)(data.key, data, item, {
            $submitting: false,
            ...addOn
        });
    } else {
        Fn.rxTabClose(reference)(data.key, {
            $dirty: true,
            $submitting: false,
            ...addOn
        });
    }
    return Ux.promise(data);
};