import Ex from "ex";

const rxClose = (reference, item = {}, isAdd = true) => (data = {}, addOn = {}) => {
    const {options = {}} = Ex.state(reference);
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
};
export default {
    rxClose
}