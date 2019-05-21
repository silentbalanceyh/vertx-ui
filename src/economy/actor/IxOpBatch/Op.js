import Fx from "../Fx";
import Ux from 'ux';

const init = (ref) => {
    const {reference, $options = {}} = ref.props;
    const op = Fx.initBatch(reference, $options);
    ref.setState({op});
};
const render = (ref, ops = []) => {
    const {$keys = []} = ref.props;
    ops = Ux.clone(ops);
    ops.forEach(op => op.disabled = 0 === $keys.length);
    return ops;
};
export default {
    init,
    configOp: render,
};