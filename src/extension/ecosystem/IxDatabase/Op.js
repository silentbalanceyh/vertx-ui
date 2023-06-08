import Ux from "ux";

const fnCategory = (reference) => (event, optionJsx = {}) => {
    /* 选择值 */
    const value = Ux.ambEvent(event);
    /* 旧值 */
    const values = reference.props.value ? Ux.clone(reference.props.value) : {};
    const {_trigger = {}} = optionJsx;
    if (_trigger[value]) {
        Object.assign(values, _trigger[value]);
    }
    values.jdbcUrl = Ux.formatExpr(values['jdbcUrl'], values, true);
    values.category = value;
    /* 变更和状态更新 */
    Ux.of(reference).in({data: values}).handle(() => {

        Ux.fn(reference).onChange(values);
    })
    // reference.?etState({data: values});
    // Ux.fn(reference).onChange(values);
};

export default {
    onChange: (reference) => ({
        category: fnCategory(reference)
    }),
    renders: {
        driverClassName: (reference, jsx) => {
            const {value = {}} = reference.props;
            if ("MYSQL" === value.category) {
                return Ux.on(Ux.aiSelect).onChange(reference, {
                    optionJsx: jsx,
                    field: "driverClassName"
                });
            } else {
                jsx.readOnly = true;
                /*
                 * 删除 $renders
                 */
                const jsxAttrs = Ux.clone(jsx);
                if (jsxAttrs.$renders) {
                    delete jsxAttrs.$renders;
                }
                return Ux.aiInput(reference, jsxAttrs);
            }
        }
    }
}