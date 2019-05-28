import Fx from '../Fx';
import Ux from 'ux';

const init = (ref) => {
    const {$options = {}} = ref.props;
    const op = Fx.initOpen($options,
        Ux.onReference(ref, 1));
    ref.setState({op});
};
export default {
    init
};