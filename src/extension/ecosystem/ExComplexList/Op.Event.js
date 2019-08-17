import Ex from "ex";

const rxClose = (reference, item = {}, isAdd = true) => (data = {}) => {
    const {options = {}} = Ex.state(reference);
    if (options[Ex.Opt.DYNAMIC_SWITCH] && isAdd) {
        Ex.rxTabEdit(reference)(data.key, data, item, {
            $submitting: false,
        });
    } else {
        Ex.rxTabClose(reference)(data.key, {
            $dirty: true,
            $submitting: false,
        });
    }
};
export default {
    rxClose
}