import Fx from '../Fx';

const init = (ref) => {
    const {reference, $options = {}} = ref.props;
    const op = Fx.initAdd(reference, $options);
    if (op) {
        ref.setState({op});
    }
};
export default {
    init
};