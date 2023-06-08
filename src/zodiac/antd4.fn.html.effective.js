import V4 from './antd4.fn.v4.patch';

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

const htmlErrorFocus = (item = {}) => (event) => V4.v4FormFailure(event ? event.target : {}, item.field, true);

const htmlErrorBlur = (item = {}) => (event) => V4.v4FormFailure(event ? event.target : {}, item.field, false);

export default {
    htmlReadOnly,
    htmlDisabled,
    htmlErrorFocus,
    htmlErrorBlur
};
