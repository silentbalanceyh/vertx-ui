import Ux from 'ux';

export default (reference) => (event, optionJsx = {}) => {
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
    reference.setState({data: values});
    Ux.fn(reference).onChange(values);
};