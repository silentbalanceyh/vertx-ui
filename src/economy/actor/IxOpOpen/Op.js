import Fx from '../Fx';
import Ux from 'ux';
import U from 'underscore';

const init = (ref) => {
    const {$options = {}} = ref.props;
    const op = Fx.initOpen($options,
        Ux.onReference(ref, 1));
    ref.setState({op});
};
const _isDisabled = ($cond = {}) => {
    const valid = {};
    Object.keys($cond).forEach(key => {
        const value = $cond[key];
        if (U.isArray(value)) {
            if (0 < value.length) {
                valid[key] = value;
            }
        } else {
            if (undefined !== value) {
                valid[key] = value;
            }
        }
    });
    // 无条件
    return 0 === Object.keys(valid).length;
};
const configOp = (ref) => {
    const {op = []} = ref.state;
    const {$cond = {}} = ref.props;
    // 特殊按钮（清除Filter专用）
    const $op = Ux.clone(op);
    if ($cond) {
        $op.filter(item => 'btnFilter' === item.key)
            .forEach(item => item.disabled = _isDisabled($cond));
    }
    return $op;
};
export default {
    init,
    configOp,
};