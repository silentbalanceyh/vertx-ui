import __Zn from './zero.module.dependency';
import __CSS from './form.__.fn.css.uca.polymorphism';

const connectItem = (cell = {}) => {
    const {col = {}} = cell;
    const itemAttrs = __Zn.clone(col);
    if (!itemAttrs.className) itemAttrs.className = "";

    const itemOnChange = __CSS.cssOnChange();

    if (itemOnChange.includes(cell.__render)) {
        // 只添加一次
        if (0 > itemAttrs.className.indexOf("ux_form_has_error")) {
            if ("" === itemAttrs.className) {
                itemAttrs.className = `ux_form_has_error`;
            } else {
                itemAttrs.className = `ux_form_has_error ${itemAttrs.className}`;
            }
        }
        // 追加 itemDefined
        const itemDefined = __CSS.cssDefined();
        if (itemDefined.includes(cell.__render)) {
            itemAttrs.className = `${itemAttrs.className} ux_form_has_error_defined`;
        }
        // 追加 itemRelative
        const itemRelative = __CSS.cssRelative()
        if (itemRelative.includes(cell.__render)) {
            itemAttrs.className = `${itemAttrs.className} ux_form_has_error_relative`;
        }
    }
    return itemAttrs;
};
export default {
    connectItem,
}