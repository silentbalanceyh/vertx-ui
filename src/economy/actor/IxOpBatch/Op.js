import Fx from "../Fx";
import Ux from 'ux';

const init = (ref) => {
    const {$options = {}} = ref.props;
    const op = Fx.initBatch($options);
    ref.setState({op});
};
const render = (ref, ops = []) => {
    const {$selected = []} = ref.props;
    ops = Ux.clone(ops);
    ops.forEach(op => op.disabled = 0 === $selected.length);
    return ops;
};
export default {
    init,
    configOp: render,
};