import jQuery from 'jquery';

const htmlReadOnly = (id) => {
    const ele = document.getElementById(id);
    if (ele) {
        return ele.readOnly;
    }
};
const htmlDisabled = (id) => {
    const ele = document.getElementById(id);
    if (ele) {
        return ele.disabled;
    }
};
const _execError = (id, show) => {
    if (id) {
        const ele = jQuery(`#${id}`).parents();
        ele.each((index, element) => {
            const childEle = jQuery(element);
            const errorCls = childEle.attr("class");
            if (errorCls && errorCls.indexOf && 0 < errorCls.indexOf("has-error")) {
                childEle.children().each((iindex, ielement) => {
                    const errorChildEle = jQuery(ielement);
                    const errorChildCls = errorChildEle.attr("class");
                    if (errorChildCls && errorChildCls.indexOf && 0 <= errorChildCls.indexOf("ant-form-explain")) {
                        errorChildEle.css("display", show ? "block" : "none");
                    }
                });
            }
        });
    }
};
const htmlErrorFocus = (item = {}) => () => {
    _execError(item.field, true);
};
const htmlErrorBlur = (item = {}) => () => {
    _execError(item.field, false);
};
export default {
    htmlReadOnly,
    htmlDisabled,
    htmlErrorFocus,
    htmlErrorBlur
}
