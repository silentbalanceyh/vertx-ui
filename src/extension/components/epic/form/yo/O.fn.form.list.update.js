import Ex from "ex";
import Ux from 'ux';

export default (reference, virtualRef) => {
    const current = reference.props.$identifier;
    const previous = virtualRef.props.$identifier;
    if (current !== previous) {
        reference.setState({$ready: false});
        Ux.toLoading(() => Ex.I.forms(current).then(forms => {
            const state = {};
            state.$data = forms;
            state.$ready = true;
            reference.setState(state);
        }), 24);
    }
}