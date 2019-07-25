import Ex from 'ex';

const init = (reference) => {
    reference.setState({$ready: false});
    Ex.I.company().then($inited => reference.setState({$ready: true, $inited}))
        .catch($error => reference.setState({$ready: true, $error}));
};

export default {
    init,
}