import Ux from 'ux';

export default {
    rxChange: (reference, field) => (event) => {
        const value = Ux.ambEvent(event);
        const state = {};
        state[field] = value;
        let {$inited = {}} = reference.state;
        $inited = Ux.clone($inited);
        Object.assign($inited, state)
        reference.setState({$inited})
    },
    rxRadio: (reference) => (event) => {
        const value = Ux.ambEvent(event);
        let {$inited = {}} = reference.state;
        $inited = Ux.clone($inited);
        $inited.runMode = value;
        if ("TIME" === value) {
            $inited.runDuration = undefined;
            $inited.runUnit = undefined;
        } else {
            $inited.runFreq = undefined;
            $inited.runTime = undefined;
        }
        reference.setState({$inited});
    },
    rxSubmit: (reference) => (event) => {
        Ux.prevent(event);
        const {$inited = {}} = reference.state;
        Ux.fn(reference).rxSubmit($inited);
    },
    yiStep2: (reference) => {
        const {$inited = {}} = reference.props;
        const state = {};
        state.$inited = $inited;
        state.$ready = true;
        reference.setState(state);
    }
}