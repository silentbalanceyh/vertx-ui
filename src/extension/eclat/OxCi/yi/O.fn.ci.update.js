import yiData from './O.fn.data';
import Ux from 'ux';

export default (reference, virtualRef) => {
    const $previous = virtualRef.state.$index;
    const $current = reference.state.$index;
    if (undefined !== $previous && undefined !== $current) {
        if ($previous !== $current) {
            reference.setState({$ready: false});
            let initState = reference.state;
            initState = Ux.clone(initState);
            yiData(reference, initState).then(state => {
                state.$ready = true;
                reference.setState(state);
            })
        }
    }
}