import Fx from '../Fx';

const init = (ref) => {
    const {$options = {}} = ref.props;
    const op = Fx.initExtra($options);
    ref.setState({op});
};

export default {
    init
};