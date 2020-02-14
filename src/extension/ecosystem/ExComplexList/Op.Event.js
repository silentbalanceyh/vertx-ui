import Ex from "ex";
import Ux from 'ux';

const rxClose = (reference, item = {}, isAdd = true) => (data = {}, addOn = {}) => {
    const {options = {}} = reference.state;
    if (!data.key) {
        console.error("[ Ex ] 传入数据没有 key，tab 操作会失败，请检查数据：", data);
    }
    if (options[Ex.Opt.DYNAMIC_SWITCH] && isAdd) {
        Ex.rxTabEdit(reference)(data.key, data, item, {
            $submitting: false,
            ...addOn
        });
    } else {
        Ex.rxTabClose(reference)(data.key, {
            $dirty: true,
            $submitting: false,
            ...addOn
        });
    }
    return Ux.promise(data);
};
export default {
    rxClose
}