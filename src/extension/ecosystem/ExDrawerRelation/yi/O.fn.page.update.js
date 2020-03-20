import yiInitialize from './O.fn.initialize';
import Ux from 'ux';

export default (reference, virtualRef) => {
    const {$current} = reference.props;
    const $previous = virtualRef.props.$current;
    if ($current && $previous) {
        if ($current.identifier !== $previous.identifier) {
            reference.setState({$ready: false});
            const startState = Ux.clone(reference.state);
            yiInitialize(startState, reference).then(state => {
                state.$ready = true;
                reference.setState(state);
            })
        }
    }
}