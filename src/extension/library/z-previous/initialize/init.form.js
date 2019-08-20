const ylForm = (reference, promise) => {
    reference.setState({$ready: false});
    promise.then($inited => reference.setState({$ready: true, $inited}))
        .catch($error => reference.setState({$ready: true, $error}));
};
export default {
    ylForm
}